import { shuffleOptions } from "../utils/shuffleOptions";

const API_URL = "https://opentdb.com/api.php?amount=15";

/**
 * Fetches and normalizes quiz questions from Open Trivia DB API
 * @param {number} retryCount - Number of retry attempts
 * @returns {Promise<Array>} Array of normalized question objects
 * @throws {Error} If the fetch fails or response is invalid
 */
export async function fetchQuizQuestions(retryCount = 0) {
  const MAX_RETRIES = 2;
  const RETRY_DELAY = 2000; // 2 seconds

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      // Handle rate limiting specifically
      if (response.status === 429 && retryCount < MAX_RETRIES) {
        console.warn(
          `Rate limited. Retrying in ${RETRY_DELAY}ms... (Attempt ${
            retryCount + 1
          }/${MAX_RETRIES})`
        );
        // Exponential backoff: increases delay with each retry to reduce API load
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * (retryCount + 1))
        );
        return fetchQuizQuestions(retryCount + 1);
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error("Invalid response format from API");
    }

    if (data.response_code !== 0) {
      // Response code 1: No Results, 2: Invalid Parameter, 3: Token Not Found, 4: Token Empty
      if (data.response_code === 1) {
        throw new Error("No questions available. Please try again later.");
      }
      throw new Error("API returned an error code");
    }

    return normalizeQuestions(data.results);
  } catch (error) {
    console.error("Failed to fetch quiz questions:", error);

    // Provide more helpful error messages
    if (error.message.includes("429") || error.message.includes("rate")) {
      throw new Error("Too many requests. Please wait a moment and try again.");
    }

    if (error.message.includes("fetch")) {
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    }

    throw new Error(
      error.message || "Failed to load quiz questions. Please try again."
    );
  }
}

/**
 * Normalizes raw API questions into a consistent format
 * @param {Array} rawQuestions - Raw questions from the API
 * @returns {Array} Normalized question objects
 */
function normalizeQuestions(rawQuestions) {
  return rawQuestions.map((question, index) => {
    const allOptions = [question.correct_answer, ...question.incorrect_answers];

    return {
      id: index + 1,
      question: decodeHTML(question.question),
      // Shuffle options to prevent positional bias (e.g., "correct answer is always first")
      options: shuffleOptions(allOptions).map((option) => decodeHTML(option)),
      correctAnswer: decodeHTML(question.correct_answer),
    };
  });
}

/**
 * Decodes HTML entities in strings
 * Uses browser's native HTML parser instead of regex for proper handling of
 * all entity types (&quot;, &amp;, &#39;, etc.) without edge case failures
 * @param {string} html - String with HTML entities
 * @returns {string} Decoded string
 */
function decodeHTML(html) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  return textarea.value;
}
