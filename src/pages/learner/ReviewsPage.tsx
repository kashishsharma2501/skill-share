import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Star, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { StarRatingInput } from '@/components/ui/Rating';
import { Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockReviews } from '@/data/mockReviews';
import { mockBookings } from '@/data/mockBookings';
import { formatRelativeTime, formatDate } from '@/utils/format';
import { useToast } from '@/components/ui/Toast';

export function LearnerReviewsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const newReviewParam = searchParams.get('newReview') === 'true';
  const bookingIdParam = searchParams.get('bookingId');

  const myReviews = mockReviews.filter((r) => r.learnerId === 'u1');
  const pendingReview = bookingIdParam
    ? mockBookings.find((b) => b.id === bookingIdParam)
    : mockBookings.find((b) => b.learnerId === 'u1' && b.status === 'completed');

  const [showModal, setShowModal] = useState(newReviewParam);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { toast('warning', 'Please select a rating.'); return; }
    if (comment.trim().length < 10) { toast('warning', 'Please write at least a brief review.'); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSubmitted(false);
    setRating(0);
    setComment('');
    navigate('/dashboard/reviews', { replace: true });
  };

  return (
    <DashboardLayout title="My Reviews" subtitle="Reviews you've written after completed sessions">
      {/* Pending review prompt */}
      {pendingReview && !submitted && (
        <div className="card p-5 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A] dark:text-slate-100">
                How was your {pendingReview.skill} session?
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">with {pendingReview.providerName} · {formatDate(pendingReview.date)}</p>
            </div>
          </div>
          <Button size="sm" variant="primary" onClick={() => setShowModal(true)}>
            Write a Review
          </Button>
        </div>
      )}

      {/* Reviews list */}
      {myReviews.length === 0 ? (
        <EmptyState
          icon={<Star className="w-6 h-6" />}
          title="No reviews yet"
          description="Complete a session and share your experience to help others in the community."
          action={{ label: 'Explore Skills', onClick: () => navigate('/explore') }}
        />
      ) : (
        <div className="space-y-4">
          {myReviews.map((review) => (
            <div key={review.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-[#0F172A] dark:text-slate-100">{review.skillTaught}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">with {review.providerName}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-600'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">"{review.comment}"</p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B]">
                {review.isVerified && (
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <CheckCircle className="w-3 h-3" /> Verified session
                  </span>
                )}
                <span className="text-xs text-slate-400 ml-auto">{formatRelativeTime(review.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review modal */}
      <Modal
        isOpen={showModal}
        onClose={handleClose}
        title={submitted ? 'Review submitted!' : 'Rate your session'}
        description={submitted ? undefined : pendingReview ? `${pendingReview.skill} with ${pendingReview.providerName}` : undefined}
        size="md"
      >
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-semibold text-[#0F172A] dark:text-slate-100 mb-2">Thank you for your review!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              Your feedback helps the community find great teachers.
            </p>
            <Button variant="primary" onClick={handleClose}>Done</Button>
          </div>
        ) : (
          <div className="space-y-5">
            {pendingReview && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <Avatar src={pendingReview.providerAvatar} name={pendingReview.providerName} size="md" />
                <div>
                  <p className="text-sm font-medium text-[#0F172A] dark:text-slate-100">{pendingReview.providerName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{pendingReview.skill} · {formatDate(pendingReview.date)}</p>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-[#0F172A] dark:text-slate-200 mb-3">Overall rating</p>
              <StarRatingInput value={rating} onChange={setRating} size="lg" />
              {rating > 0 && (
                <p className="text-xs text-slate-500 mt-1">
                  {['', 'Poor', 'Below average', 'Good', 'Very good', 'Excellent!'][rating]}
                </p>
              )}
            </div>

            <Textarea
              label="Your review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your experience. What did you learn? What made this session valuable?"
              rows={4}
            />

            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={handleClose}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} loading={submitting} disabled={rating === 0}>
                Submit Review
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
