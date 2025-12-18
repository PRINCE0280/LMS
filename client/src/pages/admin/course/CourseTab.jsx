import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation, useRemoveCourseMutation } from '@/features/api/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseTab = () => {
      const [input, setInput] = useState(
            {
                  courseTitle: "",
                  subTitle: "",
                  description: "",
                  category: "",
                  courseLevel: "",
                  coursePrice: "",
                  courseThumbnail: ""
            });
             const params = useParams();
             const courseId = params.courseId;
      const {data:courseByIdData, isLoading:courseByIdLoading ,refetch} =
       useGetCourseByIdQuery(courseId,{
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true,
            pollingInterval: 2000, // Refetch every 2 seconds
            skipPollingIfUnfocused: false
       });
      const [publishCourse,{}] = usePublishCourseMutation();
      const [removeCourse, {isLoading: removing}] = useRemoveCourseMutation();
      const publishStatusHandler = async (action) => {
            // Toggle publish status
            try { 
                  const res = await publishCourse({courseId, query: action});
                  refetch();
                  if(res?.data?.course?.isPublished) {
                        toast.success("Course Published Successfully");
                  } else {
                        toast.success("Course Unpublished Successfully");
                  }
            } catch (error) {
                  toast.error("Failed to toggle publish status");
            }
      }

      useEffect(() => {
            if (courseByIdData?.course) {
                  const course = courseByIdData.course;
                  setInput({

                        courseTitle: course.courseTitle || "",
                        subTitle: course.subTitle || "",
                        description: course.Description || "",
                        category: course.category || "",
                        courseLevel: course.courseLevel || "",
                        coursePrice: course.CoursePrice || "",
                        courseThumbnail: ""
                  });
                  if (course.CourseThumbnail) {
                        setPreviewThumbnail(course.CourseThumbnail);
                  }
            }
      }, [courseByIdData]);
      const navigate = useNavigate();
     
      const [editCourse, { data, isLoading, error, isSuccess }] = useEditCourseMutation();
      const [previewThumbnail, setPreviewThumbnail] = useState("");
      const changeEventHandler = (e) => {
            const { name, value } = e.target;
            setInput({ ...input, [name]: value });
      }
      const selectCategory = (value) => {
            setInput({ ...input, category: value });
      }
      const selectCourseLevel = (value) => {
            setInput({ ...input, courseLevel: value });
      }
      // get file
      const selectThumbnail = (e) => {
            const file = e.target.files?.[0];
            if (file) {
                  setInput({ ...input, courseThumbnail: file });
                  const fileReader = new FileReader();
                  fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
                  fileReader.readAsDataURL(file);
            }
      }

      const updateCourseHandler = async () => {
            const formData = new FormData();
            formData.append('courseTitle', input.courseTitle);
            formData.append('subTitle', input.subTitle);
            formData.append('description', input.description);
            formData.append('category', input.category);
            formData.append('courseLevel', input.courseLevel);
            formData.append('coursePrice', input.coursePrice);
            if (input.courseThumbnail) {
                  formData.append('courseThumbnail', input.courseThumbnail);
            }

            await editCourse({formData,courseId});
      }

      const removeCourseHandler = async () => {
            const confirm = window.confirm("Are you sure you want to remove this course? This will delete its lectures too.");
            if (!confirm) return;
            try {
                  const res = await removeCourse({courseId});
                  if(res?.data?.success){
                        toast.success(res.data.message || 'Course removed successfully');
                        navigate('/admin/courses');
                  } else {
                        toast.error(res?.error?.data?.message || 'Failed to remove course');
                  }
            } catch (error) {
                  toast.error('Failed to remove course');
            }
      }
      useEffect(() => {
            if (isSuccess) {
                  toast.success(data?.message || 'Course updated successfully');
                  refetch(); // Force refetch after successful update
            }
            if (error) {
                  toast.error(error?.data?.message || 'Failed to update course');
            }
      }, [isSuccess, error, refetch]);

      if (courseByIdLoading) {
            return (
                  <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
            );
      }

      return (
            <Card>
                  <CardHeader className="flex flex-row justify-between">
                        <div>
                              <CardTitle>Basic Course Information</CardTitle>
                              <CardDescription>Make changes to your courses here. Click save when you're done.</CardDescription>
                        </div>
                        <div className='space-x-2'>
                              <Button variant="outline" disabled={courseByIdData?.course?.lectures?.length === 0} onClick={()=>publishStatusHandler(courseByIdData?.course?.isPublished? false :true)}>
                                    {courseByIdData?.course?.isPublished? "Unpublish" : "Publish"}
                              </Button>
                              <Button variant='destructive' disabled={removing} onClick={removeCourseHandler}>Remove Course</Button>
                        </div>
                  </CardHeader>
                  <CardContent>
                        <div className='space-y-4 mt-5'>
                              <div>
                                    <Label>Title</Label>
                                    <input type="text"
                                          name='courseTitle'
                                          className='w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50'
                                          value={input.courseTitle}
                                          onChange={changeEventHandler}
                                          placeholder='Eg. Full Stack Developer' />
                              </div>
                              <div>
                                    <Label>Subtitle</Label>
                                    <input type="text"
                                          name='subTitle'
                                          value={input.subTitle}
                                          onChange={changeEventHandler}
                                          className='w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50'
                                          placeholder='Become a Full Stack Developer from zero to hero in 2 months' />
                              </div>
                              <div>
                                    <Label>Description</Label>
                                    <RichTextEditor input={input} setInput={setInput} />
                              </div>
                              <div className='flex items-center gap-5'>
                                    <div>
                                          <Label>Category</Label>
                                          <Select value={input.category} onValueChange={selectCategory}>
                                                <SelectTrigger className='w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50'
                                                >
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
                                    <div >
                                          <Label>Course Level</Label>
                                          <Select value={input.courseLevel} onValueChange={selectCourseLevel}>
                                                <SelectTrigger className='w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50'
                                                >
                                                      <SelectValue placeholder="Select a Course Level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                      <SelectGroup>
                                                            <SelectLabel>Course Level</SelectLabel>
                                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                                      </SelectGroup>
                                                </SelectContent>
                                          </Select>
                                    </div>
                                    <div>
                                          <Label>Price in(INR)</Label>
                                          <input type="number"
                                                name='coursePrice'
                                                value={input.coursePrice}
                                                onChange={changeEventHandler}
                                                className='w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50'
                                                placeholder='Eg. 499' />

                                    </div>
                              </div>
                              <div className='flex flex-col items-start'>
                                    <Label>Course Thumbnail</Label>
                                    <input type="file"
                                          accept='image/*'
                                          onChange={selectThumbnail}
                                          name='courseThumbnail'
                                          className='w-1/3 mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 file:font-semibold'
                                    />
                                    {
                                          previewThumbnail && (
                                                <img src={previewThumbnail} alt="Thumbnail Preview" className='e-64 my-2' />
                                          )
                                    }
                              </div>
                              <div>
                                    <Button variant="outline" className="mr-3" onClick={() => navigate("/admin/courses")}>Cancel </Button>
                                    <Button disabled={isLoading} onClick={updateCourseHandler}>
                                          {
                                                isLoading ?
                                                      <>
                                                            <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                                                            Please wait
                                                      </>
                                                      : 'Save'
                                          }

                                    </Button>
                              </div>
                        </div>
                  </CardContent>

            </Card>
      )
}

export default CourseTab
