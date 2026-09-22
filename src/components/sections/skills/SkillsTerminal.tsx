"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type LineType = "system" | "command" | "output";

type TerminalLine = {
  type: LineType;
  text: string;
};

type SkillCategory = "frontend" | "backend" | "database" | "tools";

const skillData: Record<SkillCategory, string[]> = {
  frontend: [
    "• React.js       : component-based UI development",
    "• Next.js        : production React framework",
    "• TypeScript     : type-safe JavaScript development",
    "• JavaScript     : modern ES6+ development",
    "• Tailwind CSS   : utility-first styling",
    "• Shadcn UI      : reusable UI components",
  ],

  backend: [
    "• Node.js        : server-side JavaScript runtime",
    "• Express.js     : REST API development",
    "• REST API       : scalable API architecture",
    "• JWT            : authentication & authorization",
    "• Zod            : schema validation",
  ],

  database: [
    "• PostgreSQL     : relational database",
    "• MongoDB        : NoSQL database",
    "• Prisma         : type-safe ORM",
    "• Neon           : serverless PostgreSQL",
  ],

  tools: [
    "• Git            : version control",
    "• GitHub         : source code management",
    "• Docker         : containerization",
    "• Vercel         : deployment platform",
    "• Postman        : API testing",
    "• Figma          : UI design",
  ],
};

const initialHistory: TerminalLine[] = [
  {
    type: "system",
    text: "terminal system loaded. select a command below.",
  },
];

export default function SkillsTerminal() {
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

  // Always keep latest CPS value
  const cpsRef = useRef(cps);

  useEffect(() => {
    cpsRef.current = cps;
  }, [cps]);

  /**
   * Clear current timer
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
   * Type next line
   */
  const processNextLine = useCallback(() => {
    if (isTypingRef.current) return;

    if (queueRef.current.length === 0) return;

    const nextLine = queueRef.current.shift();

    if (!nextLine) return;

    /**
     * Command instantly appears
     */
    if (nextLine.type === "command") {
      setHistory((prev) => [...prev, nextLine]);

      setTimeout(() => {
        processNextLine();
      }, 0);

      return;
    }

    /**
     * Start typing output
     */
    isTypingRef.current = true;
    setIsTyping(true);
    setCurrentTypingText("");

    let charIndex = 0;

    const typeCharacter = () => {
      if (charIndex < nextLine.text.length) {
        charIndex++;

        setCurrentTypingText(
          nextLine.text.slice(0, charIndex)
        );

        /**
         * IMPORTANT:
         * CPS is read every character.
         *
         * So changing the slider immediately
         * changes typing speed.
         */
        const currentCps = Math.max(cpsRef.current, 1);
        const msPerChar = 1000 / currentCps;

        typingTimerRef.current = setTimeout(
          typeCharacter,
          msPerChar
        );
      } else {
        setHistory((prev) => [
          ...prev,
          nextLine,
        ]);

        setCurrentTypingText("");

        isTypingRef.current = false;
        setIsTyping(false);

        setTimeout(() => {
          processNextLine();
        }, 0);
      }
    };

    const currentCps = Math.max(cpsRef.current, 1);
    const msPerChar = 1000 / currentCps;

    typingTimerRef.current = setTimeout(
      typeCharacter,
      msPerChar
    );
  }, []);

  /**
   * Execute command
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
     * If something is currently typing,
     * finish visible part and continue.
     */
    if (isTypingRef.current) {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }

      setCurrentTypingText("");

      isTypingRef.current = false;
      setIsTyping(false);
    }

    /**
     * Command line
     */
    const commandLine: TerminalLine = {
      type: "command",
      text: `> ${command}`,
    };

    /**
     * Skill lines
     */
    const skillLines: TerminalLine[] =
      skillData[command].map((skill) => ({
        type: "output",
        text: skill,
      }));

    /**
     * Add command + skills
     */
    queueRef.current.push(
      commandLine,
      ...skillLines
    );

    /**
     * Real statistics
     */
    setExecsCount((prev) => prev + 1);

    setSkillsLoaded(
      (prev) =>
        prev + skillData[command].length
    );

    /**
     * Start terminal engine
     */
    processNextLine();
  };

  /**
   * Cleanup
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

            {/* Current typing */}
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
          {/* Online */}
          <div className="px-2 py-4 text-center">
            <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[10px]">
              System Status
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-wider text-emerald-400 sm:text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              ONLINE
            </div>
          </div>

          {/* Commands */}
          <div className="border-x border-white/5 px-2 py-4 text-center">
            <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[10px]">
              Commands
            </div>

            <div className="text-sm font-bold tabular-nums text-slate-200 sm:text-base">
              {String(execsCount).padStart(2, "0")}
            </div>
          </div>

          {/* Skills */}
          <div className="px-2 py-4 text-center">
            <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[10px]">
              Skills Loaded
            </div>

            <div className="text-sm font-bold tabular-nums text-slate-200 sm:text-base">
              {skillsLoaded}
            </div>
          </div>
        </div>

        {/* Commands */}
        <div className="p-3 sm:p-5">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 sm:text-xs">
            Trigger Command Matrix
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
                {command}
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
              Clear
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
                  Typewriter Frequency
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
              Wipe Terminal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}