import React from 'react'
import { Skeleton } from '@/components/ui/skeleton';
import Course from './Course';
import { useGetPublishedCoursesQuery } from '@/features/api/courseApi';

const Courses = () => {
  const { data, isLoading, isError} = useGetPublishedCoursesQuery();
  if(isError) return <h1>Error in loading courses</h1>;

  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-white dark:bg-[#111827] min-h-screen overflow-x-hidden">
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10'>Our Courses</h2>
       <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
          {
            isLoading ? Array.from({ length: 8 }).map((_, index) => <CourseSkeleton key={index} />) : 
            ( 
              data?.courses && data.courses.map(course => <Course key={course._id} course={course} />) )

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

