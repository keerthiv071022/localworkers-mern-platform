
import { useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import "./ReviewForm.css";

function ReviewForm({ serviceRequestId, onSuccess, onCancel }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/reviews",
        {
          serviceRequestId,
          rating,
          comment: comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSuccess?.(response.data.review);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit your review."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Rate Your Experience</h3>
      <p>How was the service provided by this worker?</p>

      <div className="review-stars" role="group" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={star <= rating ? "selected" : ""}
            onClick={() => setRating(star)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            aria-pressed={rating === star}
            disabled={loading}
          >
            <Star
              size={28}
              fill={star <= rating ? "currentColor" : "none"}
            />
          </button>
        ))}
      </div>

      <label htmlFor={`review-comment-${serviceRequestId}`}>
        Your Review (Optional)
      </label>

      <textarea
        id={`review-comment-${serviceRequestId}`}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this worker..."
        maxLength={500}
        rows={4}
        disabled={loading}
      />

      <small>{comment.length}/500 characters</small>

      {error && <p className="review-error" role="alert">{error}</p>}

      <div className="review-form-actions">
        <button
          type="button"
          className="review-cancel-btn"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="review-submit-btn"
          disabled={loading || rating === 0}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;
