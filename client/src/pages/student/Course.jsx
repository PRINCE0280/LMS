import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

const Course = () => {
  return (
    <Card className="rounded-xl dark:bg-gray-800 bg-white shadow-md hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 w-full p-0 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video">
        <img
          src="https://codewithmosh.com/_next/image?url=https%3A%2F%2Fuploads.teachablecdn.com%2Fattachments%2F0dKhU49vRbiSSWknbHAR_1920X1357.jpg&w=3840&q=75"
          alt="Course"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <CardContent className="px-4 sm:px-5 py-3 sm:py-4 space-y-2 sm:space-y-3">
        <h1 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 dark:text-white line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          Nextjs Complete Course in Hindi 2025
        </h1>

        <div className="flex items-center justify-between mt-2 sm:mt-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>PM</AvatarFallback>
            </Avatar>
            <h2 className="text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 truncate">
              Mernstack Developer
            </h2>
          </div>

          <Badge className="bg-blue-600 text-white px-2 py-1 text-xs rounded-full whitespace-nowrap flex-shrink-0 ml-2">
            Advance
          </Badge>
        </div>

        <div className="text-base sm:text-lg font-bold flex">
          <span>₹499</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default Course
