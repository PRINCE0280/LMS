import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateCourseMutation } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const AddCourse = () => {
  const [courseTitle,setCourseTitle] = useState("");
  const [category,setCategory] = useState("");
  const navigate = useNavigate();
 
  const [createCourse, {data, isLoading, error , isSuccess} ] = useCreateCourseMutation();

  const getSelectedCategory = (value) => {
    setCategory(value);
    }; 
  const CreateCourseHandler = async () => {
    await createCourse({courseTitle,category});
  }
     //for displaying toast messages
     useEffect(() => {
      if (isSuccess) {
       toast.success(data.message || "Course created successfully");
        navigate("/admin/courses");
      } else if (error) { 
        alert("Error in creating course");  
      }
    } 
    , [isSuccess, error, navigate]);

  return (
    <div className='flex-1 mx-10'>
      <div className='mb-4 '>
        <h1 className='font-bold text-xl'>Lets add course, add some details for your new course</h1>
        <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, reiciendis?</p>
      </div>
      <div className='space-y-4'>
        <div>
          <label className='block mb-2 font-medium'>Title</label>
          <input type="text" 
          className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500' 
          placeholder='Your Course Name'
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          />
        </div>
        <div>
          <label className='block mb-2 font-medium'>Category</label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="nextjs">Next JS</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="frontend-development">Frontend Development</SelectItem>
                <SelectItem value="fullstack-development">Fullstack Development</SelectItem>
                <SelectItem value="mern-stack">MERN Stack Development</SelectItem>
                <SelectItem value="javascript">Javascript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="docker">Docker</SelectItem>
                <SelectItem value="mongodb">MongoDB</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center gap-2 '>
          <Button variant="outline" onClick={() =>navigate("/admin/courses")} className='ml-2'>Back</Button>
          <Button disabled={isLoading} onClick={CreateCourseHandler} >
            {
              isLoading ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
              </>
                : 'Create'
            }
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddCourse
