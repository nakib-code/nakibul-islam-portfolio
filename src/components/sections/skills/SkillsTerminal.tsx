"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type LineType = "system" | "command" | "output";

type TerminalLine = {
  type: LineType;
  text: string;
};

type SkillCategory =
  | "frontend"
  | "backend"
  | "database"
  | "tools";

const skillKeys: Record<SkillCategory, string[]> = {
  frontend: [
    "react",
    "nextjs",
    "typescript",
    "javascript",
    "tailwind",
    "shadcn",
  ],

  backend: [
    "nodejs",
    "express",
    "restApi",
    "jwt",
    "zod",
  ],

  database: [
    "postgresql",
    "mongodb",
    "prisma",
    "neon",
  ],

  tools: [
    "git",
    "github",
    "docker",
    "vercel",
    "postman",
    "figma",
  ],
};

const initialHistory: TerminalLine[] = [
  {
    type: "system",
    text: "terminal system loaded. select a command below.",
  },
];

export default function SkillsTerminal() {
  const { t } = useTranslation("common");

  const [history, setHistory] =
    useState<TerminalLine[]>(initialHistory);

  const [execsCount, setExecsCount] = useState(0);
  const [skillsLoaded, setSkillsLoaded] = useState(0);

  const [cps, setCps] = useState(15);

  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingText, setCurrentTypingText] =
    useState("");

  const queueRef = useRef<TerminalLine[]>([]);

  const typingTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const isTypingRef = useRef(false);

  const cpsRef = useRef(cps);

  /**
   * Keep latest CPS available inside async timer.
   */
  useEffect(() => {
    cpsRef.current = cps;
  }, [cps]);

  /**
   * Process next terminal line.
   *
   * Using a ref avoids the recursive useCallback
   * declaration problem.
   */
  const processNextLineRef =
    useRef<() => void>(() => {});

  /**
   * Stop current typing.
   */
  const stopTyping = useCallback(() => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    isTypingRef.current = false;

    setIsTyping(false);
    setCurrentTypingText("");
  }, []);

  /**
   * Terminal engine.
   */
  useEffect(() => {
    processNextLineRef.current = () => {
      if (isTypingRef.current) {
        return;
      }

      if (queueRef.current.length === 0) {
        return;
      }

      const nextLine = queueRef.current.shift();

      if (!nextLine) {
        return;
      }

      /**
       * Command lines appear instantly.
       */
      if (nextLine.type === "command") {
        setHistory((prev) => [
          ...prev,
          nextLine,
        ]);

        typingTimerRef.current = setTimeout(() => {
          processNextLineRef.current();
        }, 0);

        return;
      }

      /**
       * Start typing output.
       */
      isTypingRef.current = true;

      setIsTyping(true);
      setCurrentTypingText("");

      let charIndex = 0;

      const typeCharacter = () => {
        if (charIndex < nextLine.text.length) {
          charIndex += 1;

          setCurrentTypingText(
            nextLine.text.slice(0, charIndex)
          );

          /**
           * Read latest CPS on every character.
           */
          const currentCps = Math.max(
            cpsRef.current,
            1
          );

          const msPerChar =
            1000 / currentCps;

          typingTimerRef.current = setTimeout(
            typeCharacter,
            msPerChar
          );

          return;
        }

        /**
         * Typing finished.
         */
        setHistory((prev) => [
          ...prev,
          nextLine,
        ]);

        setCurrentTypingText("");

        isTypingRef.current = false;
        setIsTyping(false);

        typingTimerRef.current = setTimeout(() => {
          processNextLineRef.current();
        }, 0);
      };

      const currentCps = Math.max(
        cpsRef.current,
        1
      );

      const msPerChar =
        1000 / currentCps;

      typingTimerRef.current = setTimeout(
        typeCharacter,
        msPerChar
      );
    };
  }, []);

  /**
   * Execute terminal command.
   */
  const executeCommand = (
    command: SkillCategory | "clear"
  ) => {
    /**
     * CLEAR
     */
    if (command === "clear") {
      stopTyping();

      queueRef.current = [];

      setHistory([]);

      setExecsCount(0);
      setSkillsLoaded(0);

      return;
    }

    /**
     * Stop current typing if another
     * command is clicked.
     */
    if (isTypingRef.current) {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }

      isTypingRef.current = false;

      setIsTyping(false);
      setCurrentTypingText("");
    }

    /**
     * Command line.
     */
    const commandLine: TerminalLine = {
      type: "command",
      text: `> ${command}`,
    };

    /**
     * Skill output lines.
     */
    const skillLines: TerminalLine[] =
      skillKeys[command].map((skillKey) => ({
        type: "output",
        text: t(`skills.terminal.${skillKey}`),
      }));

    /**
     * Add command + skill lines to queue.
     */
    queueRef.current.push(
      commandLine,
      ...skillLines
    );

    /**
     * Update statistics.
     */
    setExecsCount((prev) => prev + 1);

    setSkillsLoaded(
      (prev) =>
        prev + skillKeys[command].length
    );

    /**
     * Start terminal engine.
     */
    processNextLineRef.current();
  };

  /**
   * Cleanup timers on unmount.
   */
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-4">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f17] font-mono text-slate-200 shadow-2xl">

        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0f1520] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
          </div>

          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
            skills_terminal
          </span>
        </div>

        {/* Terminal Screen */}
        <div className="p-3 sm:p-5">
          <div
            className="
              h-[280px]
              overflow-y-auto
              overscroll-contain
              rounded-xl
              border border-white/5
              bg-[#060a10]
              p-4
              scrollbar-thin
              scrollbar-thumb-slate-800
              scrollbar-track-transparent
              sm:h-[330px]
              sm:p-5
            "
          >
            {history.map((line, index) => (
              <div
                key={`${index}-${line.text}`}
                className={`
                  mb-2
                  whitespace-pre-wrap
                  break-words
                  text-[11px]
                  leading-5
                  sm:text-sm
                  sm:leading-relaxed
                  ${
                    line.type === "system"
                      ? "text-amber-400"
                      : line.type === "command"
                        ? "text-blue-400"
                        : "pl-1 text-slate-300"
                  }
                `}
              >
                {line.text}
              </div>
            ))}

            {/* Current Typing */}
            {isTyping && currentTypingText && (
              <div className="mb-2 whitespace-pre-wrap break-words pl-1 text-[11px] leading-5 text-slate-300 sm:text-sm sm:leading-relaxed">
                {currentTypingText}

                <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-slate-400 sm:h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-3 border-y border-white/5 bg-[#0b1019]">

          {/* System Status */}
          <div className="px-2 py-4 text-center">
            <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[10px]">
              {t("skills.terminal.systemStatus")}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-wider text-emerald-400 sm:text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              {t("skills.terminal.online")}
            </div>
          </div>

          {/* Commands */}
          <div className="border-x border-white/5 px-2 py-4 text-center">
            <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[10px]">
              {t("skills.terminal.commands")}
            </div>

            <div className="text-sm font-bold tabular-nums text-slate-200 sm:text-base">
              {String(execsCount).padStart(2, "0")}
            </div>
          </div>

          {/* Skills */}
          <div className="px-2 py-4 text-center">
            <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[10px]">
              {t("skills.terminal.skillsLoaded")}
            </div>

            <div className="text-sm font-bold tabular-nums text-slate-200 sm:text-base">
              {skillsLoaded}
            </div>
          </div>
        </div>

        {/* Commands */}
        <div className="p-3 sm:p-5">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 sm:text-xs">
            {t("skills.terminal.commandMatrix")}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {(
              [
                "frontend",
                "backend",
                "database",
                "tools",
              ] as SkillCategory[]
            ).map((command) => (
              <button
                key={command}
                type="button"
                onClick={() =>
                  executeCommand(command)
                }
                className="
                  rounded-lg
                  border border-white/5
                  bg-[#111824]
                  px-3
                  py-2.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                  transition
                  duration-200
                  hover:border-blue-500/30
                  hover:bg-blue-500/10
                  hover:text-blue-300
                  active:scale-[0.97]
                  focus:outline-none
                  focus:ring-1
                  focus:ring-blue-500/50
                  sm:text-xs
                "
              >
                {t(`skills.categories.${command}`)}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                executeCommand("clear")
              }
              className="
                col-span-2
                rounded-lg
                border
                border-red-500/10
                bg-red-500/5
                px-3
                py-2.5
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-red-400
                transition
                hover:bg-red-500/10
                hover:text-red-300
                active:scale-[0.97]
                focus:outline-none
                focus:ring-1
                focus:ring-red-500/30
                sm:col-span-1
                sm:text-xs
              "
            >
              {t("skills.terminal.clear")}
            </button>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="border-t border-white/5 bg-[#0a0f17] p-3 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Slider */}
            <div className="w-full sm:max-w-md">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 sm:text-[10px]">
                  {t(
                    "skills.terminal.typewriterFrequency"
                  )}
                </span>

                <span className="text-[10px] font-bold tabular-nums text-blue-400 sm:text-xs">
                  {cps} CPS
                </span>
              </div>

              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={cps}
                onChange={(event) =>
                  setCps(
                    Number(event.target.value)
                  )
                }
                className="
                  h-1.5
                  w-full
                  cursor-pointer
                  appearance-none
                  rounded-full
                  bg-slate-800
                  accent-blue-500
                  focus:outline-none
                "
              />

              <div className="mt-1 flex justify-between text-[8px] text-slate-600">
                <span>5</span>
                <span>20</span>
                <span>40</span>
              </div>
            </div>

            {/* Wipe */}
            <button
              type="button"
              onClick={() =>
                executeCommand("clear")
              }
              className="
                w-full
                rounded-lg
                border
                border-red-500/10
                px-4
                py-2
                text-[9px]
                font-bold
                uppercase
                tracking-wider
                text-red-400
                transition
                hover:bg-red-500/10
                active:scale-[0.97]
                sm:w-auto
              "
            >
              {t("skills.terminal.wipe")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}