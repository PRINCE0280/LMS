import React from 'react'
import Course from './Course';

const MyLearning = () => {
  const isLoading = false; // Replace with actual loading state
  const myLearningCourses = [1, 2]; // Replace with your course data

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
              {[1, 2].map((course, index) => (
                <Course key={index} />
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
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
      ></div>
    ))}
  </div>
);
