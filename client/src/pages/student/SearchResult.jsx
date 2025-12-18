import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
   
  return (
    <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-300 dark:border-gray-700 py-6 gap-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 rounded-lg px-4 -mx-4">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-4 w-full md:flex-1 group"
      >
        <img
          src={course.CourseThumbnail}
          alt="course-thumbnail"
          className="h-32 w-full md:w-56 md:h-40 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200"
        />
        <div className="flex flex-col gap-2 justify-between flex-1">
          <div>
            <h1 className="font-bold text-lg md:text-xl text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {course.courseTitle}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
              {course.subTitle}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Instructor: <span className="font-semibold text-gray-900 dark:text-gray-100">{course.creator?.name}</span>
            </p>
            <Badge className="w-fit bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800">
              {course.courseLevel}
            </Badge>
          </div>
        </div>
      </Link>
      <div className="flex md:flex-col items-start md:items-end justify-between md:justify-start w-full md:w-auto gap-2 mt-2 md:mt-0">
        <h1 className="font-bold text-xl md:text-2xl text-gray-900 dark:text-gray-100">
          ₹{course.CoursePrice}
        </h1>
      </div>
    </div>
  );
};

export default SearchResult;