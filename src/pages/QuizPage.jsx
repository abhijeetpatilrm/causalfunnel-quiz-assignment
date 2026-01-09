import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../hooks/useQuiz";
import Timer from "../components/Timer";
import QuestionCard from "../components/QuestionCard";
import QuestionOverview from "../components/QuestionOverview";
import CircularProgress from "../components/CircularProgress";

const QUIZ_DURATION_SECONDS = 1800; // 30 minutes

function QuizPage() {
  const navigate = useNavigate();
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    questionStatusMap,
    isLoading,
    error,
    isSubmitted,
    currentQuestion,
    selectAnswer,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    totalQuestions,
    attemptedCount,
    isFirstQuestion,
    isLastQuestion,
  } = useQuiz();

  // Scroll to top when question changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentQuestionIndex]);

  // Prevent accidental tab close/refresh during active quiz
  // Only active when quiz is in progress (not loading, not submitted) to avoid
  // annoying users on the start page or after they've finished
  useEffect(() => {
    if (!isLoading && !isSubmitted && questions.length > 0) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = ""; // Required for Chrome
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [isLoading, isSubmitted, questions.length]);

  // Handle timer expiry
  const handleTimerExpire = () => {
    // Guard against double submission if user manually submits at the exact moment timer expires
    if (!isSubmitted) {
      submitQuiz();
      navigate("/report");
    }
  };

  // Handle manual submit
  const handleSubmit = () => {
    const confirmed = window.confirm(
      "Are you sure you want to submit the quiz? You cannot change your answers after submission."
    );
    if (confirmed) {
      submitQuiz();
      navigate("/report");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Quiz
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No questions
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No questions available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Top Bar - Timer and Progress */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold text-gray-700">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
            {/* Circular Progress Indicator */}
            <CircularProgress
              percentage={
                totalQuestions > 0 ? (attemptedCount / totalQuestions) * 100 : 0
              }
              size={40}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Time Remaining:</span>
            <Timer
              totalSeconds={QUIZ_DURATION_SECONDS}
              onExpire={handleTimerExpire}
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 h-1 rounded-full mb-6 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-300"
            style={{
              width: `${
                totalQuestions > 0 ? (attemptedCount / totalQuestions) * 100 : 0
              }%`,
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Question Card */}
          <div className="lg:col-span-2">
            {/* Animation wrapper - key forces re-render on question change */}
            <div key={currentQuestionIndex} className="animate-fadeIn">
              <QuestionCard
                question={currentQuestion.question}
                options={currentQuestion.options}
                selectedAnswer={userAnswers[currentQuestionIndex]}
                onSelect={selectAnswer}
                isSubmitted={isSubmitted}
              />
            </div>

            {/* Navigation Controls */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={previousQuestion}
                disabled={isFirstQuestion}
                className={`
                  px-6 py-2 rounded-lg font-semibold transition-all
                  ${
                    isFirstQuestion
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }
                `}
                type="button"
              >
                Previous
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
                type="button"
              >
                Submit Quiz
              </button>

              <button
                onClick={nextQuestion}
                disabled={isLastQuestion}
                className={`
                  px-6 py-2 rounded-lg font-semibold transition-all
                  ${
                    isLastQuestion
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }
                `}
                type="button"
              >
                Next
              </button>
            </div>
          </div>

          {/* Sidebar - Question Overview */}
          <div className="lg:col-span-1">
            <QuestionOverview
              totalQuestions={totalQuestions}
              questionStatusMap={questionStatusMap}
              currentIndex={currentQuestionIndex}
              onQuestionSelect={goToQuestion}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
