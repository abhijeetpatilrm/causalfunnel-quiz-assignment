import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);

  // Load quiz results from sessionStorage
  useEffect(() => {
    const storedResult = sessionStorage.getItem("quizResult");

    if (!storedResult) {
      // No quiz result found, redirect to start
      navigate("/");
      return;
    }

    try {
      const parsedResult = JSON.parse(storedResult);
      setQuizData(parsedResult);
    } catch (error) {
      console.error("Failed to parse quiz results:", error);
      navigate("/");
    }
  }, [navigate]);

  // Calculate score
  const calculateScore = (questions, userAnswers) => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  // Show loading while data is being loaded
  if (!quizData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const { questions, userAnswers } = quizData;
  const totalQuestions = questions.length;
  const attemptedCount = userAnswers.filter((answer) => answer !== null).length;
  const correctAnswersCount = calculateScore(questions, userAnswers);
  const scorePercentage =
    totalQuestions > 0
      ? Math.round((correctAnswersCount / totalQuestions) * 100)
      : 0;

  // Clear quiz result and navigate to start
  const handleStartNewQuiz = () => {
    sessionStorage.removeItem("quizResult");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Quiz Results
          </h1>

          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {correctAnswersCount}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {attemptedCount - correctAnswersCount}
              </div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {scorePercentage}%
              </div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>

          {/* Restart Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleStartNewQuiz}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
              type="button"
            >
              Start New Quiz
            </button>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Answer Review
          </h2>

          {questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            const wasAttempted = userAnswer !== null;

            return (
              <div
                key={question.id}
                className={`
                  bg-white rounded-lg shadow-md p-6 border-l-4
                  ${
                    !wasAttempted
                      ? "border-gray-400"
                      : isCorrect
                      ? "border-green-500"
                      : "border-red-500"
                  }
                `}
              >
                {/* Question Number and Text */}
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-500 mb-2">
                    Question {index + 1}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {question.question}
                  </h3>
                </div>

                {/* Answer Comparison */}
                <div className="space-y-3">
                  {/* User's Answer */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-24 text-sm font-semibold text-gray-700">
                      Your Answer:
                    </div>
                    <div
                      className={`
                        flex-1 px-3 py-2 rounded
                        ${
                          !wasAttempted
                            ? "bg-gray-100 text-gray-500 italic"
                            : isCorrect
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      `}
                    >
                      {wasAttempted ? userAnswer : "Not Answered"}
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-24 text-sm font-semibold text-gray-700">
                      Correct Answer:
                    </div>
                    <div className="flex-1 px-3 py-2 rounded bg-green-50 text-green-800 font-medium">
                      {question.correctAnswer}
                    </div>
                  </div>
                </div>

                {/* Result Badge */}
                <div className="mt-4 flex items-center gap-2">
                  {!wasAttempted ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                      Unanswered
                    </span>
                  ) : isCorrect ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-200 text-green-800">
                      ✓ Correct
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-200 text-red-800">
                      ✗ Incorrect
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Restart Button */}
        <div className="mt-8 text-center pb-8">
          <button
            onClick={handleStartNewQuiz}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
            type="button"
          >
            Start New Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
