"use client";

import { useEffect, useRef } from "react";

type Section =
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "services"
  | "experience"
  | "contact";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
  pulseSpeed: number;
  cluster: number;
};

type Packet = {
  from: number;
  to: number;
  progress: number;
  speed: number;
};

type TrailPoint = {
  x: number;
  y: number;
  life: number;
  size: number;
};

type Burst = {
  x: number;
  y: number;
  radius: number;
  life: number;
  maxRadius: number;
};

type ThemeColors = {
  background: string;
  primary: string;
  accent: string;
  connection: string;
  connectionOpacity: number;
  node: string;
  packet: string;
};

const DARK_COLORS: ThemeColors = {
  background: "#100C16",
  primary: "#8D52FE",
  accent: "#C7A6FF",
  connection: "141,82,254",
  connectionOpacity: 0.16,
  node: "199,166,255",
  packet: "#8D52FE",
};

const LIGHT_COLORS: ThemeColors = {
  background: "#F7F5FA",
  primary: "#7040C0",
  accent: "#7040C0",
  connection: "112,64,192",
  connectionOpacity: 0.09,
  node: "91,52,155",
  packet: "#7040C0",
};

const SECTION_CONFIG: Record<
  Section,
  {
    darkDensity: number;
    lightDensity: number;
    connectionDistance: number;
    speed: number;
    darkGlow: number;
    lightGlow: number;
    clusterMode: boolean;
    packetCount: number;
  }
> = {
  hero: {
    darkDensity: 64,
    lightDensity: 38,
    connectionDistance: 145,
    speed: 0.12,
    darkGlow: 0.06,
    lightGlow: 0.022,
    clusterMode: false,
    packetCount: 14,
  },

  about: {
    darkDensity: 46,
    lightDensity: 28,
    connectionDistance: 130,
    speed: 0.08,
    darkGlow: 0.035,
    lightGlow: 0.014,
    clusterMode: false,
    packetCount: 10,
  },

  skills: {
    darkDensity: 82,
    lightDensity: 48,
    connectionDistance: 155,
    speed: 0.15,
    darkGlow: 0.065,
    lightGlow: 0.024,
    clusterMode: true,
    packetCount: 22,
  },

  projects: {
    darkDensity: 92,
    lightDensity: 54,
    connectionDistance: 160,
    speed: 0.17,
    darkGlow: 0.07,
    lightGlow: 0.028,
    clusterMode: true,
    packetCount: 28,
  },

  services: {
    darkDensity: 68,
    lightDensity: 42,
    connectionDistance: 145,
    speed: 0.11,
    darkGlow: 0.05,
    lightGlow: 0.02,
    clusterMode: true,
    packetCount: 18,
  },

  experience: {
    darkDensity: 60,
    lightDensity: 36,
    connectionDistance: 140,
    speed: 0.09,
    darkGlow: 0.04,
    lightGlow: 0.017,
    clusterMode: true,
    packetCount: 14,
  },

  contact: {
    darkDensity: 42,
    lightDensity: 25,
    connectionDistance: 125,
    speed: 0.06,
    darkGlow: 0.028,
    lightGlow: 0.01,
    clusterMode: false,
    packetCount: 8,
  },
};

export default function DeveloperSignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: false,
    });

    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    let animationFrame = 0;

    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let trail: TrailPoint[] = [];
    let bursts: Burst[] = [];

    let lastSection: Section = "hero";
    let lastTheme: "dark" | "light" = "dark";

    const sectionRef = {
      current: "hero" as Section,
    };

    const themeRef = {
      current: "dark" as "dark" | "light",
    };

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      previousX: -1000,
      previousY: -1000,
      active: false,
      speed: 0,
      idleTime: 0,
    };

    const current = {
      density: 64,
      connectionDistance: 145,
      speed: 0.12,
      glow: 0.06,
    };

    let lastBurstTime = 0;

    // --------------------------------------------------
    // Theme
    // --------------------------------------------------

    const getTheme = () => {
      const isDark =
        document.documentElement.classList.contains("dark");

      themeRef.current = isDark ? "dark" : "light";

      return isDark ? DARK_COLORS : LIGHT_COLORS;
    };

    // --------------------------------------------------
    // Config
    // --------------------------------------------------

    const getConfig = () => {
      const config = SECTION_CONFIG[sectionRef.current];

      const dark = themeRef.current === "dark";

      return {
        ...config,

        density: dark
          ? config.darkDensity
          : config.lightDensity,

        glow: dark
          ? config.darkGlow
          : config.lightGlow,
      };
    };

    // --------------------------------------------------
    // Resize
    // --------------------------------------------------

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      if (!width || !height) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      createNodes();
    };

    // --------------------------------------------------
    // Create Nodes
    // --------------------------------------------------

    const createNodes = () => {
      if (!width || !height) return;

      const config = getConfig();

      nodes = [];
      packets = [];

      const maxNodes = Math.min(
        config.density,
        Math.max(24, Math.floor(width / 16))
      );

      for (let i = 0; i < maxNodes; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;

        // Keep Hero text area calmer.
        if (sectionRef.current === "hero") {
          if (Math.random() < 0.72) {
            x =
              width * 0.42 +
              Math.random() * width * 0.58;
          }
        }

        nodes.push({
          x,
          y,

          vx:
            (Math.random() - 0.5) *
            config.speed,

          vy:
            (Math.random() - 0.5) *
            config.speed,

          radius:
            Math.random() * 1.1 + 0.5,

          pulse:
            Math.random() *
            Math.PI *
            2,

          pulseSpeed:
            Math.random() * 0.014 + 0.006,

          cluster:
            Math.floor(Math.random() * 5),
        });
      }

      for (
        let i = 0;
        i < config.packetCount;
        i++
      ) {
        const from = Math.floor(
          Math.random() * nodes.length
        );

        let to = Math.floor(
          Math.random() * nodes.length
        );

        if (nodes.length > 1 && to === from) {
          to = (to + 1) % nodes.length;
        }

        packets.push({
          from,
          to,
          progress: Math.random(),
          speed:
            Math.random() * 0.0014 +
            0.0006,
        });
      }
    };

    // --------------------------------------------------
    // Section Detection
    // --------------------------------------------------

    const detectSection = () => {
      const sections =
        Object.keys(
          SECTION_CONFIG
        ) as Section[];

      let closest: Section = "hero";
      let closestDistance = Infinity;

      const viewportCenter =
        window.innerHeight / 2;

      for (const section of sections) {
        const element =
          document.getElementById(section);

        if (!element) continue;

        const rect =
          element.getBoundingClientRect();

        const center =
          rect.top +
          rect.height / 2;

        const distance =
          Math.abs(
            center -
              viewportCenter
          );

        if (distance < closestDistance) {
          closestDistance = distance;
          closest = section;
        }
      }

      if (closest !== lastSection) {
        lastSection = closest;

        sectionRef.current = closest;

        createNodes();
      }
    };

    // --------------------------------------------------
    // Smooth Config
    // --------------------------------------------------

    const updateConfig = () => {
      const config = getConfig();

      current.density +=
        (config.density -
          current.density) *
        0.025;

      current.connectionDistance +=
        (config.connectionDistance -
          current.connectionDistance) *
        0.025;

      current.speed +=
        (config.speed -
          current.speed) *
        0.025;

      current.glow +=
        (config.glow -
          current.glow) *
        0.025;
    };

    // --------------------------------------------------
    // Background
    // --------------------------------------------------

    const drawBackground = (
      time: number
    ) => {
      const colors = getTheme();

      ctx.fillStyle =
        colors.background;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      const offsetX =
        Math.sin(
          time * 0.00012
        ) *
        width *
        0.05;

      const offsetY =
        Math.cos(
          time * 0.00015
        ) *
        height *
        0.035;

      const centerX =
        width * 0.72 +
        offsetX;

      const centerY =
        height * 0.42 +
        offsetY;

      const radius =
        width * 0.65;

      const gradient =
        ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          radius
        );

      if (
        themeRef.current ===
        "dark"
      ) {
        gradient.addColorStop(
          0,
          `rgba(141,82,254,${current.glow})`
        );

        gradient.addColorStop(
          0.4,
          "rgba(141,82,254,0.018)"
        );

        gradient.addColorStop(
          1,
          "rgba(16,12,22,0)"
        );
      } else {
        gradient.addColorStop(
          0,
          `rgba(141,82,254,${current.glow})`
        );

        gradient.addColorStop(
          0.42,
          "rgba(141,82,254,0.008)"
        );

        gradient.addColorStop(
          1,
          "rgba(247,245,250,0)"
        );
      }

      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );
    };

    // --------------------------------------------------
    // Connections
    // --------------------------------------------------

    const drawConnections = () => {
      const colors = getTheme();

      const distanceLimit =
        current.connectionDistance;

      const clusterMode =
        getConfig().clusterMode;

      for (
        let i = 0;
        i < nodes.length;
        i++
      ) {
        const a = nodes[i];

        for (
          let j = i + 1;
          j < nodes.length;
          j++
        ) {
          const b = nodes[j];

          if (
            clusterMode &&
            a.cluster !== b.cluster &&
            (i * 17 + j * 31) % 100 >
              14
          ) {
            continue;
          }

          const dx = a.x - b.x;
          const dy = a.y - b.y;

          const distance =
            Math.sqrt(
              dx * dx +
              dy * dy
            );

          if (
            distance >
            distanceLimit
          ) {
            continue;
          }

          let opacity =
            (1 -
              distance /
                distanceLimit) *
            colors.connectionOpacity;

          // Cursor boosts nearby connections.
          if (mouse.active) {
            const midX =
              (a.x + b.x) / 2;

            const midY =
              (a.y + b.y) / 2;

            const mouseDistance =
              Math.hypot(
                midX - mouse.x,
                midY - mouse.y
              );

            if (
              mouseDistance < 150
            ) {
              const boost =
                1 -
                mouseDistance /
                  150;

              opacity +=
                boost *
                (themeRef.current ===
                "dark"
                  ? 0.08
                  : 0.035);
            }
          }

          ctx.beginPath();

          ctx.moveTo(
            a.x,
            a.y
          );

          ctx.lineTo(
            b.x,
            b.y
          );

          ctx.strokeStyle =
            `rgba(${colors.connection},${opacity})`;

          ctx.lineWidth =
            themeRef.current ===
            "dark"
              ? 0.55
              : 0.45;

          ctx.stroke();
        }
      }
    };

    // --------------------------------------------------
    // Cursor Trail
    // --------------------------------------------------

    const updateTrail = () => {
      if (!mouse.active) {
        for (const point of trail) {
          point.life -= 0.018;
        }

        trail = trail.filter(
          (point) =>
            point.life > 0
        );

        return;
      }

      const distance =
        Math.hypot(
          mouse.x -
            mouse.previousX,
          mouse.y -
            mouse.previousY
        );

      if (distance > 3) {
        trail.push({
          x: mouse.x,
          y: mouse.y,
          life:
            themeRef.current ===
            "dark"
              ? 1
              : 0.65,
          size:
            Math.min(
              2.5,
              0.8 +
                distance *
                  0.025
            ),
        });
      }

      if (trail.length > 22) {
        trail.splice(
          0,
          trail.length - 22
        );
      }

      for (const point of trail) {
        point.life -=
          themeRef.current ===
          "dark"
            ? 0.025
            : 0.032;
      }

      trail = trail.filter(
        (point) =>
          point.life > 0
      );
    };

    const drawTrail = () => {
      for (
        let i = 0;
        i < trail.length;
        i++
      ) {
        const point = trail[i];

        const alpha =
          point.life *
          (themeRef.current ===
          "dark"
            ? 0.22
            : 0.1);

        ctx.beginPath();

        ctx.arc(
          point.x,
          point.y,
          point.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `rgba(141,82,254,${alpha})`;

        ctx.fill();
      }
    };

    // --------------------------------------------------
    // Cursor Ripple
    // --------------------------------------------------

    const drawCursorSignal = (
      time: number
    ) => {
      if (!mouse.active) return;

      const dark =
        themeRef.current ===
        "dark";

      const pulse =
        Math.sin(
          time * 0.003
        ) *
        0.5 +
        0.5;

      // Outer scanner ring
      ctx.beginPath();

      ctx.arc(
        mouse.x,
        mouse.y,
        dark
          ? 24 + pulse * 4
          : 19 + pulse * 3,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        dark
          ? `rgba(141,82,254,${0.08 + pulse * 0.05})`
          : `rgba(112,64,192,${0.055 + pulse * 0.035})`;

      ctx.lineWidth = 0.7;

      ctx.stroke();

      // Inner ring
      ctx.beginPath();

      ctx.arc(
        mouse.x,
        mouse.y,
        dark
          ? 8 + pulse * 2
          : 7 + pulse
      ,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        dark
          ? "rgba(199,166,255,0.24)"
          : "rgba(112,64,192,0.15)";

      ctx.lineWidth = 0.6;

      ctx.stroke();

      // Crosshair
      const size =
        dark ? 13 : 11;

      ctx.beginPath();

      ctx.moveTo(
        mouse.x - size,
        mouse.y
      );

      ctx.lineTo(
        mouse.x - size + 5,
        mouse.y
      );

      ctx.moveTo(
        mouse.x + size - 5,
        mouse.y
      );

      ctx.lineTo(
        mouse.x + size,
        mouse.y
      );

      ctx.moveTo(
        mouse.x,
        mouse.y - size
      );

      ctx.lineTo(
        mouse.x,
        mouse.y - size + 5
      );

      ctx.moveTo(
        mouse.x,
        mouse.y + size - 5
      );

      ctx.lineTo(
        mouse.x,
        mouse.y + size
      );

      ctx.strokeStyle =
        dark
          ? "rgba(199,166,255,0.16)"
          : "rgba(112,64,192,0.11)";

      ctx.lineWidth = 0.5;

      ctx.stroke();

      // Cursor center
      ctx.beginPath();

      ctx.arc(
        mouse.x,
        mouse.y,
        dark ? 1.6 : 1.3,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        dark
          ? "#C7A6FF"
          : "#7040C0";

      ctx.fill();
    };

    // --------------------------------------------------
    // Mouse Field
    // --------------------------------------------------

    const drawMouseField = () => {
      if (!mouse.active) return;

      const dark =
        themeRef.current ===
        "dark";

      const radius =
        dark ? 180 : 145;

      for (const node of nodes) {
        const dx =
          node.x -
          mouse.x;

        const dy =
          node.y -
          mouse.y;

        const distance =
          Math.hypot(
            dx,
            dy
          );

        if (
          distance > radius
        ) {
          continue;
        }

        const strength =
          1 -
          distance / radius;

        const opacity =
          dark
            ? strength * 0.18
            : strength * 0.075;

        ctx.beginPath();

        ctx.moveTo(
          mouse.x,
          mouse.y
        );

        ctx.lineTo(
          node.x,
          node.y
        );

        ctx.strokeStyle =
          `rgba(141,82,254,${opacity})`;

        ctx.lineWidth =
          dark ? 0.6 : 0.45;

        ctx.stroke();
      }
    };

    // --------------------------------------------------
    // Nodes
    // --------------------------------------------------

    const updateNodes = (
      time: number
    ) => {
      const colors = getTheme();

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < -30) {
          node.x =
            width + 30;
        }

        if (
          node.x >
          width + 30
        ) {
          node.x = -30;
        }

        if (node.y < -30) {
          node.y =
            height + 30;
        }

        if (
          node.y >
          height + 30
        ) {
          node.y = -30;
        }

        node.pulse +=
          node.pulseSpeed;

        // ----------------------------------------------
        // Cursor attraction / repulsion
        // ----------------------------------------------

        if (mouse.active) {
          const dx =
            mouse.x -
            node.x;

          const dy =
            mouse.y -
            node.y;

          const distance =
            Math.hypot(
              dx,
              dy
            );

          if (
            distance < 175 &&
            distance > 18
          ) {
            const force =
              (1 -
                distance /
                  175) *
              (themeRef.current ===
              "dark"
                ? 0.0025
                : 0.0012);

            node.vx +=
              dx * force;

            node.vy +=
              dy * force;
          }

          // Tiny repulsion very close
          if (
            distance < 42 &&
            distance > 0
          ) {
            const push =
              (1 -
                distance /
                  42) *
              0.002;

            node.vx -=
              dx * push;

            node.vy -=
              dy * push;
          }
        }

        // Natural damping
        node.vx *= 0.995;
        node.vy *= 0.995;

        // Keep velocity under control
        const maxSpeed =
          themeRef.current ===
          "dark"
            ? 0.55
            : 0.4;

        node.vx = Math.max(
          -maxSpeed,
          Math.min(
            maxSpeed,
            node.vx
          )
        );

        node.vy = Math.max(
          -maxSpeed,
          Math.min(
            maxSpeed,
            node.vy
          )
        );

        const pulse =
          Math.sin(
            node.pulse +
              time * 0.0007
          ) *
            0.5 +
          0.5;

        const distanceToMouse =
          Math.hypot(
            node.x -
              mouse.x,
            node.y -
              mouse.y
          );

        const mouseBoost =
          mouse.active &&
          distanceToMouse <
            170
            ? 1 -
              distanceToMouse /
                170
            : 0;

        const radius =
          node.radius +
          mouseBoost *
            (themeRef.current ===
            "dark"
              ? 1.4
              : 0.9) +
          pulse * 0.22;

        // Node
        ctx.beginPath();

        ctx.arc(
          node.x,
          node.y,
          radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `rgba(${colors.node},${
            themeRef.current ===
            "dark"
              ? 0.28 +
                pulse *
                  0.24 +
                mouseBoost *
                  0.48
              : 0.16 +
                pulse *
                  0.13 +
                mouseBoost *
                  0.24
          })`;

        ctx.fill();

        // Highlighted node halo
        if (
          pulse > 0.8 ||
          mouseBoost > 0.3
        ) {
          ctx.beginPath();

          ctx.arc(
            node.x,
            node.y,
            themeRef.current ===
            "dark"
              ? 4 +
                pulse * 3 +
                mouseBoost * 3
              : 3 +
                pulse * 2,
            0,
            Math.PI * 2
          );

          ctx.strokeStyle =
            themeRef.current ===
            "dark"
              ? `rgba(141,82,254,${
                  0.04 +
                  mouseBoost *
                    0.12
                })`
              : `rgba(112,64,192,${
                  0.025 +
                  mouseBoost *
                    0.05
                })`;

          ctx.lineWidth =
            themeRef.current ===
            "dark"
              ? 0.65
              : 0.5;

          ctx.stroke();
        }
      }
    };

    // --------------------------------------------------
    // Packets
    // --------------------------------------------------

    const drawPackets = () => {
      const colors = getTheme();

      for (const packet of packets) {
        const from =
          nodes[packet.from];

        const to =
          nodes[packet.to];

        if (!from || !to) {
          continue;
        }

        packet.progress +=
          packet.speed *
          (current.speed /
            0.12);

        if (
          packet.progress >=
          1
        ) {
          packet.progress = 0;

          packet.from =
            Math.floor(
              Math.random() *
                nodes.length
            );

          packet.to =
            Math.floor(
              Math.random() *
                nodes.length
            );

          if (
            packet.to ===
            packet.from &&
            nodes.length > 1
          ) {
            packet.to =
              (packet.to + 1) %
              nodes.length;
          }
        }

        const x =
          from.x +
          (to.x - from.x) *
            packet.progress;

        const y =
          from.y +
          (to.y - from.y) *
            packet.progress;

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          themeRef.current ===
          "dark"
            ? 1.2
            : 0.85,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          colors.packet;

        ctx.shadowColor =
          colors.accent;

        ctx.shadowBlur =
          themeRef.current ===
          "dark"
            ? 8
            : 4;

        ctx.fill();

        ctx.shadowBlur = 0;
      }
    };

    // --------------------------------------------------
    // Signal Bursts
    // --------------------------------------------------

    const createBurst = (
      x: number,
      y: number
    ) => {
      const now =
        performance.now();

      if (
        now - lastBurstTime <
        180
      ) {
        return;
      }

      lastBurstTime = now;

      bursts.push({
        x,
        y,
        radius: 3,
        life: 1,
        maxRadius:
          themeRef.current ===
          "dark"
            ? 42
            : 30,
      });

      if (bursts.length > 5) {
        bursts.shift();
      }
    };

    const updateBursts = () => {
      for (const burst of bursts) {
        burst.radius +=
          (burst.maxRadius -
            burst.radius) *
          0.075;

        burst.life -=
          themeRef.current ===
          "dark"
            ? 0.018
            : 0.024;
      }

      bursts = bursts.filter(
        (burst) =>
          burst.life > 0
      );
    };

    const drawBursts = () => {
      for (const burst of bursts) {
        ctx.beginPath();

        ctx.arc(
          burst.x,
          burst.y,
          burst.radius,
          0,
          Math.PI * 2
        );

        ctx.strokeStyle =
          themeRef.current ===
          "dark"
            ? `rgba(141,82,254,${
                burst.life *
                0.16
              })`
            : `rgba(112,64,192,${
                burst.life *
                0.09
              })`;

        ctx.lineWidth =
          themeRef.current ===
          "dark"
            ? 0.8
            : 0.6;

        ctx.stroke();
      }
    };

    // --------------------------------------------------
    // Technical HUD
    // --------------------------------------------------

    const drawTechnicalMarks = (
      time: number
    ) => {
      const dark =
        themeRef.current ===
        "dark";

      const opacity = dark
        ? 0.035
        : 0.015;

      ctx.save();

      ctx.strokeStyle =
        `rgba(141,82,254,${opacity})`;

      ctx.fillStyle =
        `rgba(141,82,254,${
          opacity * 1.5
        })`;

      ctx.lineWidth =
        dark ? 0.5 : 0.4;

      // Upper-right signal bars
      const baseX =
        width * 0.72;

      const baseY =
        height * 0.18;

      for (
        let i = 0;
        i < 5;
        i++
      ) {
        ctx.beginPath();

        ctx.moveTo(
          baseX +
            i * 34,
          baseY
        );

        ctx.lineTo(
          baseX +
            20 +
            i * 34,
          baseY
        );

        ctx.stroke();
      }

      // HUD frame
      const frameX =
        width * 0.78;

      const frameY =
        height * 0.22;

      ctx.beginPath();

      ctx.moveTo(
        frameX,
        frameY
      );

      ctx.lineTo(
        frameX + 24,
        frameY
      );

      ctx.moveTo(
        frameX,
        frameY
      );

      ctx.lineTo(
        frameX,
        frameY + 14
      );

      ctx.stroke();

      // Small scanning lines
      for (
        let i = 0;
        i < 4;
        i++
      ) {
        const y =
          height * 0.72 +
          i * 10;

        ctx.beginPath();

        ctx.moveTo(
          width * 0.82,
          y
        );

        ctx.lineTo(
          width * 0.82 +
            20 +
            Math.sin(
              time *
                0.001 +
                i
            ) *
              5,
          y
        );

        ctx.stroke();
      }

      ctx.restore();
    };

    // --------------------------------------------------
    // Contact Convergence
    // --------------------------------------------------

    const drawContactConvergence = (
      time: number
    ) => {
      if (
        sectionRef.current !==
        "contact"
      ) {
        return;
      }

      const targetX =
        width * 0.78;

      const targetY =
        height * 0.5;

      for (const node of nodes) {
        const dx =
          targetX -
          node.x;

        const dy =
          targetY -
          node.y;

        const distance =
          Math.hypot(
            dx,
            dy
          );

        if (
          distance < 40
        ) {
          continue;
        }

        const strength =
          themeRef.current ===
          "dark"
            ? 0.000015
            : 0.000008;

        node.vx +=
          dx * strength;

        node.vy +=
          dy * strength;
      }

      const pulse =
        Math.sin(
          time * 0.002
        ) *
          0.5 +
        0.5;

      ctx.beginPath();

      ctx.arc(
        targetX,
        targetY,
        themeRef.current ===
        "dark"
          ? 2 +
              pulse * 2
          : 1.5 +
              pulse,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        themeRef.current ===
        "dark"
          ? `rgba(199,166,255,${
              0.35 +
              pulse * 0.3
            })`
          : `rgba(112,64,192,${
              0.22 +
              pulse * 0.18
            })`;

      ctx.fill();

      ctx.beginPath();

      ctx.arc(
        targetX,
        targetY,
        themeRef.current ===
        "dark"
          ? 20 +
              pulse * 10
          : 16 +
              pulse * 7,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        themeRef.current ===
        "dark"
          ? `rgba(141,82,254,${
              0.04 +
              pulse * 0.04
            })`
          : `rgba(112,64,192,${
              0.025 +
              pulse * 0.025
            })`;

      ctx.lineWidth =
        themeRef.current ===
        "dark"
          ? 0.6
          : 0.5;

      ctx.stroke();
    };

    // --------------------------------------------------
    // Mouse
    // --------------------------------------------------

    const handleMouseMove = (
      event: MouseEvent
    ) => {
      const rect =
        canvas.getBoundingClientRect();

      const nextX =
        event.clientX -
        rect.left;

      const nextY =
        event.clientY -
        rect.top;

      const distance =
        Math.hypot(
          nextX -
            mouse.targetX,
          nextY -
            mouse.targetY
        );

      mouse.previousX =
        mouse.x;

      mouse.previousY =
        mouse.y;

      mouse.targetX =
        nextX;

      mouse.targetY =
        nextY;

      mouse.speed =
        mouse.speed * 0.8 +
        distance * 0.2;

      mouse.active = true;
      mouse.idleTime = 0;

      if (
        distance > 28
      ) {
        createBurst(
          nextX,
          nextY
        );
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;

      mouse.targetX = -1000;
      mouse.targetY = -1000;

      mouse.x = -1000;
      mouse.y = -1000;

      mouse.speed = 0;
    };

    // --------------------------------------------------
    // Animation
    // --------------------------------------------------

    const animate = (
      time: number
    ) => {
      const previousTheme =
        themeRef.current;

      getTheme();

      if (
        previousTheme !==
        themeRef.current
      ) {
        createNodes();
      }

      updateConfig();

      detectSection();

      // Smooth cursor
      if (mouse.active) {
        mouse.x +=
          (mouse.targetX -
            mouse.x) *
          0.18;

        mouse.y +=
          (mouse.targetY -
            mouse.y) *
          0.18;

        mouse.speed *= 0.92;
      }

      updateTrail();
      updateBursts();

      drawBackground(time);
      drawConnections();
      drawMouseField();
      drawTrail();
      updateNodes(time);
      drawPackets();
      drawBursts();
      drawCursorSignal(time);
      drawContactConvergence(time);
      drawTechnicalMarks(time);

      animationFrame =
        requestAnimationFrame(
          animate
        );
    };

    // --------------------------------------------------
    // Resize Observer
    // --------------------------------------------------

    const resizeObserver =
      new ResizeObserver(() => {
        resize();
      });

    resizeObserver.observe(
      canvas
    );

    // --------------------------------------------------
    // Events
    // --------------------------------------------------

    window.addEventListener(
      "scroll",
      detectSection,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "mousemove",
      handleMouseMove,
      {
        passive: true,
      }
    );

    document.addEventListener(
      "mouseleave",
      handleMouseLeave
    );

    // --------------------------------------------------
    // Initial
    // --------------------------------------------------

    getTheme();

    resize();

    animationFrame =
      requestAnimationFrame(
        animate
      );

    // --------------------------------------------------
    // Cleanup
    // --------------------------------------------------

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      resizeObserver.disconnect();

      window.removeEventListener(
        "scroll",
        detectSection
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      document.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}