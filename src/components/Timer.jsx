import { useState, useEffect, useRef } from "react";

/**
 * Countdown timer component
 * @param {Object} props
 * @param {number} props.totalSeconds - Total seconds to count down from
 * @param {Function} props.onExpire - Callback function to call when timer reaches zero
 */
function Timer({ totalSeconds, onExpire }) {
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const hasExpiredRef = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Don't start if totalSeconds is invalid
    if (totalSeconds <= 0) {
      return;
    }

    // Start the countdown
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time is up
          clearInterval(intervalRef.current);

          // Call onExpire only once
          if (!hasExpiredRef.current && onExpire) {
            hasExpiredRef.current = true;
            onExpire();
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [totalSeconds, onExpire]);

  /**
   * Format seconds into MM:SS format
   * @param {number} seconds - Total seconds
   * @returns {string} Formatted time string
   */
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="text-2xl font-mono font-bold text-gray-900">
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
}

export default Timer;
