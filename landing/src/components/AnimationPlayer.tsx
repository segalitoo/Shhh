import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef, type ComponentType } from "react";

type AnimationPlayerProps = {
  component: ComponentType<Record<string, unknown>>;
  durationInFrames: number;
  compositionWidth: number;
  compositionHeight: number;
  fps?: number;
};

export function AnimationPlayer({
  component,
  durationInFrames,
  compositionWidth,
  compositionHeight,
  fps = 30,
}: AnimationPlayerProps) {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const player = playerRef.current;
        if (!player) return;
        if (entry.isIntersecting) {
          player.play();
        } else {
          player.pause();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full flex items-center justify-center">
      <Player
        ref={playerRef}
        component={component}
        durationInFrames={durationInFrames}
        compositionWidth={compositionWidth}
        compositionHeight={compositionHeight}
        fps={fps}
        style={{ width: "100%", borderRadius: "12px" }}
        loop
        autoPlay
      />
    </div>
  );
}
