/**
 * Circular progress indicator component
 * @param {Object} props
 * @param {number} props.percentage - Progress percentage (0-100)
 * @param {number} props.size - Size of the circle in pixels
 */
function CircularProgress({ percentage = 0, size = 40 }) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-blue-500 transition-all duration-300"
          strokeLinecap="round"
        />
      </svg>
      {/* Percentage text */}
      <span className="absolute text-xs font-semibold text-gray-700">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}

export default CircularProgress;
