import React, { useState } from 'react';
import { Star, User, Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGetCourseReviewsQuery, useGetUserReviewQuery } from '@/features/api/reviewApi';
import { Skeleton } from '@/components/ui/skeleton';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import ReviewModal from './ReviewModal';

const CourseReviews = ({ courseId, showUserReviewFirst = false }) => {
  const { data, isLoading } = useGetCourseReviewsQuery(courseId);
  const { user } = useSelector((store) => store.auth);
  const { data: userReviewData } = useGetUserReviewQuery(courseId, {
    skip: !user || !showUserReviewFirst,
  });
  const [showEditModal, setShowEditModal] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const reviews = data?.reviews || [];
  const averageRating = data?.averageRating || 0;
  const totalReviews = data?.totalReviews || 0;
  const userReview = userReviewData?.review;

  // Filter out user's review from the general list if showing it separately
  const otherReviews = showUserReviewFirst && userReview
    ? reviews.filter(review => review._id !== userReview._id)
    : reviews;

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {totalReviews > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 dark:text-white">
                  {averageRating}
                </div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Course Rating
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Based on student feedback
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User's Own Review - Show First if Enrolled */}
      {showUserReviewFirst && userReview && (
        <div className="space-y-2">
          <Card className="border-2 border-blue-500 dark:border-blue-400 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {user?.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          You
                        </h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowEditModal(true)}
                          className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= userReview.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(userReview.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  {userReview.comment && (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {userReview.comment}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Review Modal */}
      {showEditModal && (
        <ReviewModal
          courseId={courseId}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {otherReviews.length === 0 && (!showUserReviewFirst || !userReview) ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No reviews yet. Be the first to review this course!
              </p>
            </CardContent>
          </Card>
        ) : (
          otherReviews.map((review) => (
            <Card key={review._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    {review.userId?.photoUrl ? (
                      <img
                        src={review.userId.photoUrl}
                        alt={review.userId.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {review.userId?.name || 'Anonymous'}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseReviews;
