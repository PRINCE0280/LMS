import React from 'react'
import { Skeleton } from '@/components/ui/skeleton';
import Course from './Course';

const courses = [1, 2, 3, 4, 5, 6];
const Courses = () => {
      const isLoading = false; 
  return (
    <div className='bg-white dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10'>Our Courses</h2>
       <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
          {
            isLoading ? Array.from({ length: 8 }).map((_, index) => <CourseSkeleton key={index} />) : ( courses.map(course => <Course key={course} />) )

       }
       </div>
      </div>
      
    </div>
  )
}

export default Courses;

const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  )
}

