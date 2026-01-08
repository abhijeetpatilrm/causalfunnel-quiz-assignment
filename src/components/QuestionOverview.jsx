/**
 * Stateless question overview/navigation component
 * @param {Object} props
 * @param {number} props.totalQuestions - Total number of questions
 * @param {string[]} props.questionStatusMap - Array of question statuses
 * @param {number} props.currentIndex - Index of the current question
 * @param {Function} props.onQuestionSelect - Callback when a question is selected
 */
function QuestionOverview({
  totalQuestions,
  questionStatusMap,
  currentIndex,
  onQuestionSelect,
}) {
  /**
   * Get button styling based on status and current state
   * @param {number} index - Question index
   * @returns {string} CSS classes
   */
  const getButtonClasses = (index) => {
    const status = questionStatusMap[index];
    const isCurrent = index === currentIndex;

    let baseClasses =
      "w-10 h-10 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";

    if (isCurrent) {
      // Current question - distinctive border
      baseClasses += " ring-2 ring-offset-2";
    }

    // Status-based colors
    if (status === "attempted") {
      return `${baseClasses} bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 ${
        isCurrent ? "ring-green-500" : ""
      }`;
    } else if (status === "visited") {
      return `${baseClasses} bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 ${
        isCurrent ? "ring-blue-500" : ""
      }`;
    } else {
      // unvisited
      return `${baseClasses} bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-400 ${
        isCurrent ? "ring-gray-400" : ""
      }`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Question Overview
      </h3>

      {/* Grid of question buttons */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, index) => (
          <button
            key={index}
            onClick={() => onQuestionSelect(index)}
            className={getButtonClasses(index)}
            aria-label={`Go to question ${index + 1}`}
            aria-current={index === currentIndex ? "true" : "false"}
            type="button"
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-300"></div>
          <span>Unvisited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500"></div>
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span>Attempted</span>
        </div>
      </div>
    </div>
  );
}

export default QuestionOverview;
