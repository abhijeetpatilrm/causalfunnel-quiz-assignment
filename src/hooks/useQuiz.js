import { useState, useEffect } from "react";
import { fetchQuizQuestions } from "../services/quizApi";

/**
 * Custom hook for managing quiz state and logic
 * @returns {Object} Quiz state and action handlers
 */
export function useQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questionStatusMap, setQuestionStatusMap] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch questions on mount
  useEffect(() => {
    async function loadQuestions() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchQuizQuestions();

        setQuestions(data);
        setUserAnswers(new Array(data.length).fill(null));
        setQuestionStatusMap(new Array(data.length).fill("unvisited"));

        // Mark first question as visited
        if (data.length > 0) {
          setQuestionStatusMap((prev) => {
            const updated = [...prev];
            updated[0] = "visited";
            return updated;
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load quiz questions");
      } finally {
        setIsLoading(false);
      }
    }

    loadQuestions();
  }, []);

  /**
   * Select an answer for the current question
   * @param {string} answer - The selected answer
   */
  const selectAnswer = (answer) => {
    if (isSubmitted) return;

    setUserAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = answer;
      return updated;
    });

    setQuestionStatusMap((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = "attempted";
      return updated;
    });
  };

  /**
   * Navigate to a specific question by index
   * @param {number} index - The question index to navigate to
   */
  const goToQuestion = (index) => {
    if (index < 0 || index >= questions.length) return;
    if (isSubmitted) return;

    setCurrentQuestionIndex(index);

    setQuestionStatusMap((prev) => {
      const updated = [...prev];
      if (updated[index] === "unvisited") {
        updated[index] = "visited";
      }
      return updated;
    });
  };

  /**
   * Navigate to the next question
   */
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      goToQuestion(currentQuestionIndex + 1);
    }
  };

  /**
   * Navigate to the previous question
   */
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1);
    }
  };

  /**
   * Submit the quiz and mark as complete
   * Stores quiz results in sessionStorage for persistence across route changes
   */
  const submitQuiz = () => {
    // Store quiz results in sessionStorage
    const quizResult = {
      questions,
      userAnswers,
      submittedAt: new Date().toISOString(),
    };

    sessionStorage.setItem("quizResult", JSON.stringify(quizResult));

    setIsSubmitted(true);
  };

  return {
    // State
    questions,
    currentQuestionIndex,
    userAnswers,
    questionStatusMap,
    isLoading,
    error,
    isSubmitted,

    // Current question helper
    currentQuestion: questions[currentQuestionIndex] || null,

    // Actions
    selectAnswer,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    submitQuiz,

    // Helper values
    totalQuestions: questions.length,
    attemptedCount: questionStatusMap.filter((status) => status === "attempted")
      .length,
    isFirstQuestion: currentQuestionIndex === 0,
    isLastQuestion: currentQuestionIndex === questions.length - 1,
  };
}
