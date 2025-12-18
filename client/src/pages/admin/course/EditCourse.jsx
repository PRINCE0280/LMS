import { Button } from '@/components/ui/button'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import CourseTab from './CourseTab'

const EditCourse = () => {
      const params = useParams();
      const courseId = params.courseId;

      return (
            <div className='flex-1 '>
                  <div className='flex items-center justify-between mb-5'>
                        <h1 className='text-xl font-bold'>Add detail information regarding course </h1>
                        <Link to={`/admin/courses/${courseId}/lectures`}>
                              <Button variant='link' className="hover:text-blue-600">Go to lectures Page</Button>
                        </Link>
                  </div>
                  <CourseTab />
            </div>
      )
}

export default EditCourse
