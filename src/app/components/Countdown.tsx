import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { timerStartSound, timerEndSound } from "./sounds";

export const QuizCountdown: React.FC<{ onCountdownComplete: () => void }> = ({
  onCountdownComplete,
}) => {
  return (
    <div className="flex items-center justify-center h-[90vh] dark:bg-black bg-white dark:text-white">
      <CountdownCircleTimer
        isPlaying
        duration={3}
        colors={["#faff00", "#ff01fb"]}
        trailColor="#fffeff"
        strokeWidth={10}
        colorsTime={[3, 0]}
        size={120}
        onUpdate={() => timerStartSound.play()}
        onComplete={() => {
          timerEndSound.play();
          onCountdownComplete();
          return { shouldRepeat: false };
        }}
      >
        {({ remainingTime }) => (
          <div className="text-6xl">
            {remainingTime === 0 ? "Go!" : remainingTime}
          </div>
        )}
      </CountdownCircleTimer>
    </div>
  );
};
