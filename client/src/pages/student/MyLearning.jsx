import React from 'react'
import Course from './Course';
import { useGetPurchasedCoursesQuery } from '@/features/api/purchaseApi';

const MyLearning = () => {
  const { data, isLoading, isError } = useGetPurchasedCoursesQuery();
  const myLearningCourses = data?.purchasedCourse || [];

  if (isError) {
    return (
      <div className='max-w-7xl mx-auto my-16 sm:my-20 md:my-24 px-4 sm:px-6 lg:px-8'>
        <h1 className='font-bold text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6'>MY LEARNING</h1>
        <p className='text-sm sm:text-base text-red-600 dark:text-red-400'>Failed to load your courses. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto my-16 sm:my-20 md:my-24 px-4 sm:px-6 lg:px-8'>
      <h1 className='font-bold text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6'>MY LEARNING</h1>
      <div className='my-5'>
        {
          isLoading ? (
            <MyLearningSkeleton />
          ) : myLearningCourses.length === 0 ? (
            <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>You are not enrolled in any course.</p>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
              {myLearningCourses.map((item) => (
                <Course key={item._id} course={item.courseId} />
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default MyLearning;

// Skeleton component for loading state
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md">
        <div className="w-full aspect-video bg-gray-300 dark:bg-gray-700 animate-pulse" />
        <div className="p-4 sm:p-5 space-y-3">
          <div className="h-12 sm:h-14 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 flex-1 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);
