/**
 * Stateless question card component
 * @param {Object} props
 * @param {string} props.question - The question text
 * @param {string[]} props.options - Array of answer options
 * @param {string|null} props.selectedAnswer - The currently selected answer
 * @param {Function} props.onSelect - Callback function when an option is selected
 * @param {boolean} props.isSubmitted - Whether the quiz has been submitted
 */
function QuestionCard({
  question,
  options,
  selectedAnswer,
  onSelect,
  isSubmitted = false,
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      {/* Question Text */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{question}</h2>

      {/* Options List */}
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;

          return (
            <button
              key={index}
              onClick={() => !isSubmitted && onSelect(option)}
              disabled={isSubmitted}
              className={`
                w-full text-left px-4 py-3 rounded-lg border-2 transition-all
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                }
                ${isSubmitted ? "cursor-not-allowed opacity-75" : ""}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              `}
              aria-pressed={isSelected}
              type="button"
            >
              <div className="flex items-center">
                {/* Radio-style indicator */}
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-400"
                    }
                  `}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                {/* Option Text */}
                <span className="flex-1">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Answer Saved Indicator */}
      {selectedAnswer && (
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Answer saved</span>
        </div>
      )}
    </div>
  );
}

export default QuestionCard;
