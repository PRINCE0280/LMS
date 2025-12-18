import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { Link } from 'react-router-dom'

const Course = ({course}) => {
  // Guard clause to handle undefined course
  if (!course) {
    return null;
  }

  return (
   <Link to={`/course-detail/${course._id}`} className="block h-full group"> 
   <Card className="relative rounded-2xl dark:bg-[#111827] bg-white border-2 border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600 transform hover:-translate-y-2 transition-all duration-300 w-full h-full p-0 overflow-hidden flex flex-col">
      {/* Thumbnail with overlay gradient */}
      <div className="relative w-full aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-[#111827] dark:to-[#111827] flex-shrink-0 overflow-hidden">
        <img
        src={course?.CourseThumbnail || course?.courseThumbnail || "https://via.placeholder.com/400x300?text=No+Thumbnail"}
          alt="Course"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Level Badge on thumbnail */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-lg border-2 border-white/20">
            {course?.courseLevel || "All"}
          </Badge>
        </div>
      </div>

      {/* Content */}
          <CardContent className="px-5 py-4 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-800/50">
        <h1 className="font-bold text-base md:text-lg text-gray-900 dark:text-white line-clamp-2 mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {course?.courseTitle || "Untitled Course"}
        </h1>

        <div className="flex items-center gap-2 mb-4">
          <Avatar className="w-8 h-8 ring-2 ring-blue-100 dark:ring-gray-700 flex-shrink-0">
            <AvatarImage src={course?.creator?.photoUrl || "https://github.com/shadcn.png"} alt={course?.creator?.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-xs">
              {course?.creator?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              {course?.creator?.name || "Unknown"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
          </div>
        </div>

        {/* Price with styling */}
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ₹{course?.CoursePrice || "Free"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              View Course →
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
   </Link>
  )
}

export default Course
