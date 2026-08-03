"use client";

import React from "react";
import { Database, Sparkles, Wrench, PenTool, Hash, Bot, Code, Terminal } from "lucide-react";

const orbits = [
  {
    size: "w-[27.5rem] h-[27.5rem] md:w-[45rem] md:h-[45rem]",
    duration: 18,
    icons: [
      { component: Database, alt: "Supabase", angle: -60 },
      { component: Sparkles, alt: "gemini", angle: 0 },
      { component: Wrench, alt: "Make", angle: 60 },
    ],
  },
  {
    size: "w-[37.5rem] h-[37.5rem] md:w-[55rem] md:h-[55rem]",
    duration: 24,
    icons: [
      { component: PenTool, alt: "Figma", angle: 0 },
      { component: Hash, alt: "Slack", angle: -90 },
    ],
  },
  {
    size: "w-[45rem] h-[45rem] md:w-[66.25rem] md:h-[66.25rem]",
    duration: 30,
    icons: [
      { component: Bot, alt: "Claude", angle: -60 },
      { component: Code, alt: "react", angle: 0 },
      { component: Terminal, alt: "python", angle: 60 },
    ],
  },
];

export default function OrbitingCirclesGlobe({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative w-full h-[27.5rem] md:h-[40rem] overflow-visible flex justify-center mt-12 lg:mt-0">
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)) }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) - 360deg)) }
        }
        @keyframes counter-cw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)) }
        }
        @keyframes counter-ccw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)) }
        }
      `}</style>

      {/* Center particle globe (Now dynamic children) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 aspect-square pointer-events-auto w-[18.75rem] md:w-[36.25rem] z-10 flex items-center justify-center">
        {children}
      </div>

      {/* Orbiting rings */}
      {orbits.map((orbit, index) => {
        const isCW = index % 2 === 0;
        const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
        const counterAnim = isCW ? "counter-cw" : "counter-ccw";

        const allIcons = [
          ...orbit.icons,
          ...orbit.icons.map((ic) => ({
            ...ic,
            angle: ic.angle + 180,
            alt: `${ic.alt}-mirror`,
          })),
        ];

        return (
          <div
            key={index}
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-white/20 shadow-[0_0_15px_rgba(34,211,238,0.05)] ${orbit.size} pointer-events-none`}
          >
            {allIcons.map((iconData, iconIndex) => {
              const IconComp = iconData.component;
              return (
                <div
                  key={iconIndex}
                  className="absolute top-0 left-1/2 h-1/2 -ml-8 origin-bottom flex flex-col justify-start items-center"
                  style={
                    {
                      "--start-angle": `${iconData.angle}deg`,
                      animation: `${orbitAnim} ${orbit.duration}s linear infinite`,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="p-3 sm:p-4 border border-white/20 rounded-full bg-slate-900/80 backdrop-blur-md -mt-8 relative z-10 shadow-lg"
                    style={
                      {
                        "--counter-offset": `${-iconData.angle}deg`,
                        animation: `${counterAnim} ${orbit.duration}s linear infinite`,
                      } as React.CSSProperties
                    }
                  >
                    <IconComp className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
