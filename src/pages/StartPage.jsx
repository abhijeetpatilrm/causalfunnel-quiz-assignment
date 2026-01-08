import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StartPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isEmailValid = isValidEmail(email);
  const showError = touched && !isEmailValid && email.length > 0;

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEmailValid) {
      // Store email in sessionStorage
      sessionStorage.setItem("userEmail", email);

      // Navigate to quiz page
      navigate("/quiz");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Quiz Assessment
            </h1>
            <p className="text-gray-600">
              Test your knowledge with 15 multiple-choice questions. You'll have
              30 minutes to complete the quiz.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-blue-900 mb-2">Instructions:</h2>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>15 questions in total</li>
              <li>30 minutes time limit</li>
              <li>You can navigate between questions</li>
              <li>Review your answers before submitting</li>
            </ul>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Enter your email"
                className={`
                  w-full px-4 py-3 rounded-lg border-2 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${
                    showError
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 bg-white"
                  }
                `}
                required
              />
              {showError && (
                <p className="text-red-600 text-sm mt-2">
                  Please enter a valid email address
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isEmailValid}
              className={`
                w-full py-3 rounded-lg font-semibold transition-all
                ${
                  isEmailValid
                    ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              Start Quiz
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500">
          <p>Make sure you have a stable internet connection</p>
        </div>
      </div>
    </div>
  );
}

export default StartPage;
