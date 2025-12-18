import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

      const CreateLecture = () => {
      const navigate = useNavigate();
      const [lectureTitle, setLectureTitle] = useState("");
      const params = useParams();
      const [createLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation();
      const createLectureHandler = async () => {
            await createLecture({ courseId: params.courseId, lectureTitle });
      };
      const { data: lectureData, isSuccess: lectureIsSuccess, isLoading: lectureLoading, isError: lectureError,refetch} = useGetCourseLectureQuery({ courseId: params.courseId });
      useEffect(() => {
            if (isSuccess) {
                  refetch();
                  toast.success(data?.message || "Lecture Created Successfully");
            }
            if (error) {
                  toast.error(error?.data?.message || "Lecture Creation Failed");
            }
      }, [isSuccess, error]);
      return (
            <div className='flex-1 mx-10'>
                  <div className='mb-4 '>
                        <h1 className='font-bold text-xl'>Lets add lecture, add some details for your new lecture</h1>
                        <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, reiciendis?</p>
                  </div>
                  <div className='space-y-4'>
                        <div>
                              <Label className='block mb-2 font-medium'>Title</Label>
                              <Input type="text"
                                    className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Your Title Name'
                                    value={lectureTitle}
                                    onChange={(e) => setLectureTitle(e.target.value)}
                              />
                        </div>
                        <div className='flex items-center gap-2 '>
                              <Button variant="outline" onClick={() => navigate(`/admin/courses/${params.courseId}`)} className='ml-2'>Back to courses</Button>
                              <Button disabled={isLoading} onClick={createLectureHandler} >
                                    {
                                          isLoading ? <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Please wait
                                          </>
                                                : 'Create Lecture'
                                    }
                              </Button>
                        </div>
                        <div className='mt-10'>
                              {lectureLoading ? (
                                    <p>Loading lectures...</p>
                              ) : lectureError ? (
                                    <p>Failed to load lectures.</p>
                              ) : !lectureData?.lectures?.length ? (
                                    <p>No lectures available</p>
                              ) : (
                                    lectureData.lectures.map((lecture, index) => (
                                         <Lecture key={lecture._id} lecture={lecture} courseId={params.courseId} index={index} />
                                    ))
                               
                              )}
                        </div>
                  </div>
            </div>
      )
}
export default CreateLecture
