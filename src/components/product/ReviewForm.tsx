import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { inputClasses } from "@/components/ui/formStyles";
import { cn } from "@/utils/cn";
import { hasErrors, validateReview, type ReviewFormValues } from "@/utils/validation";

interface ReviewFormProps {
  onSubmit: (values: ReviewFormValues) => void;
}

const EMPTY_REVIEW: ReviewFormValues = { rating: 0, comment: "" };
const RATINGS = [1, 2, 3, 4, 5] as const;

/** Controlled form: one state object, radio buttons for the rating, a textarea for the comment. */
export function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [values, setValues] = useState<ReviewFormValues>(EMPTY_REVIEW);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Errors are derived from values on every render — no extra state to keep in sync
  const errors = validateReview(values);
  const showErrors = submitAttempted;

  function handleRatingChange(event: ChangeEvent<HTMLInputElement>) {
    setValues((prev) => ({ ...prev, rating: Number(event.target.value) }));
  }

  function handleCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setValues((prev) => ({ ...prev, comment: event.target.value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);
    if (hasErrors(errors)) return;

    onSubmit({ rating: values.rating, comment: values.comment.trim() });
    setValues(EMPTY_REVIEW);
    setSubmitAttempted(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-xl bg-ink-100/60 p-4 dark:bg-ink-900">
      <h3 className="text-base">Write a review</h3>

      <fieldset aria-describedby={showErrors && errors.rating ? "review-rating-error" : undefined}>
        <legend className="mb-1.5 text-sm font-semibold">Rating</legend>
        <div className="flex gap-1">
          {RATINGS.map((rating) => (
            <label key={rating} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={values.rating === rating}
                onChange={handleRatingChange}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-10 place-items-center rounded-lg text-2xl transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500",
                  rating <= values.rating ? "text-low" : "text-ink-300 hover:text-ink-400 dark:text-ink-600",
                )}
              >
                ★
              </span>
              <span className="sr-only">
                {rating} {rating === 1 ? "star" : "stars"}
              </span>
            </label>
          ))}
        </div>
        {showErrors && errors.rating && (
          <p id="review-rating-error" className="mt-1 text-sm text-out dark:text-red-400">
            {errors.rating}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="review-comment" className="mb-1.5 block text-sm font-semibold">
          Comment
        </label>
        <textarea
          id="review-comment"
          rows={3}
          value={values.comment}
          onChange={handleCommentChange}
          placeholder="What did you like or dislike?"
          aria-invalid={showErrors && errors.comment ? true : undefined}
          aria-describedby={showErrors && errors.comment ? "review-comment-error" : undefined}
          className={inputClasses(Boolean(showErrors && errors.comment), "resize-y")}
        />
        {showErrors && errors.comment && (
          <p id="review-comment-error" className="mt-1 text-sm text-out dark:text-red-400">
            {errors.comment}
          </p>
        )}
      </div>

      <Button type="submit" variant="secondary" className="self-start">
        Post review
      </Button>
    </form>
  );
}
