import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const MEDIA_API = "http://localhost:5000/api/v1/media";
const LectureTab = () => {
      const navigate = useNavigate();
      const params = useParams();
      const { courseId, lectureId } = params;
      
      const { data: lectureData, isLoading: lectureLoading, error: lectureError } = useGetLectureByIdQuery({lectureId });
      const lecture = lectureData?.lecture;
      const isCourseFreePriced = lectureData?.isCourseFreePriced;
      
      const [lectureTitle, setLectureTitle] = useState('');
      const [uploadVideoInfo, setUploadedVideoInfo] = useState(null);
      const [isFree, setIsFree] = useState(false);
      const [mediaProgress, setMediaProgress] = useState(false);
      const [uploadProgress, setUploadProgress] = useState(0);
      const [btnDisable, setBtnDisable] = useState(true);
      const [videoSource, setVideoSource] = useState('file');
      const [youtubeUrl, setYoutubeUrl] = useState('');
      
      const [removeLecture, {isLoading:removeLoading, data:removeData,isSuccess: removeSuccess}] = useRemoveLectureMutation();
      const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();

      useEffect(() => {
            if (lecture) {
                  setLectureTitle(lecture.lectureTitle || '');
                  // Lecture model has videoUrl and publicId directly, not nested in videoInfo
                  if (lecture.videoUrl) {
                        setUploadedVideoInfo({ videoUrl: lecture.videoUrl, publicId: lecture.publicId });
                        // Check if existing video is a YouTube URL
                        if (lecture.videoUrl.includes('youtube') || lecture.videoUrl.includes('youtu.be')) {
                              setVideoSource('youtube');
                              setYoutubeUrl(lecture.videoUrl);
                        } else {
                              setVideoSource('file');
                        }
                  }
                  // If course is free, toggle should be ON, otherwise use lecture's isPreviewFree value
                  setIsFree(isCourseFreePriced ? true : lecture.isPreviewFree);
            }
      }, [lecture, isCourseFreePriced]);
      
      const handleYoutubeUrlChange = (e) => {
            const url = e.target.value;
            setYoutubeUrl(url);
            if (url) {
                  setUploadedVideoInfo({ videoUrl: url, publicId: 'youtube' });
                  setBtnDisable(false);
            } else {
                  setBtnDisable(true);
            }
      };
      const fileChangeHandler = async (e) => {
            const file = e.target.files[0];
            if (file) {
                  const formData = new FormData();
                  formData.append('file', file);
                  setMediaProgress(true);
                  try {
                        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                              withCredentials: true,
                              onUploadProgress: ({ loaded, total }) => {
                                    let percent = Math.floor((loaded * 100) / total);
                                    setUploadProgress(percent);
                              }
                        });
                        if (res.data.success) {
                              setUploadedVideoInfo({ videoUrl: res.data.data.secure_url, publicId: res.data.data.public_id });
                              setBtnDisable(false);
                              toast.success("Video Uploaded Successfully");
                        }
                  } catch (error) {
                        console.error(error);
                        toast.error("Video Upload Failed");
                  }
                  finally {
                        setMediaProgress(false);
                  }
            }
      }
      const editLectureHandler = async () => {
            await editLecture({ lectureTitle, videoInfo: uploadVideoInfo, courseId, lectureId, isPreviewFree: isFree });
      }
      
      useEffect(() => {
            if (isSuccess) {
                  toast.success(data?.message || "Lecture Updated Successfully");
            }
            if (error) {
                  toast.error(error?.data?.message || "Lecture Update Failed");
            }
      }, [isSuccess, error]);
      
      const removeLectureHandler = async () => {
            await removeLecture({courseId, lectureId});
      }
      useEffect(() => {
            if (removeSuccess) {
                  toast.success(removeData?.message || "Lecture Removed Successfully");
                  navigate(`/admin/courses/${courseId}/lectures`);
            }
      }, [removeSuccess]);

      if (lectureLoading) {
            return <div className="flex items-center justify-center min-h-screen">
                  <Loader2 className="h-8 w-8 animate-spin" />
            </div>
      }

      return (
            <div>
                  <Card>
                        <CardHeader className='flex justify-between'>
                              <div>
                                    <CardTitle>Edit Lecture</CardTitle>
                                    <CardDescription>Make Changes and Click save when done. </CardDescription>
                              </div>
                              <div className='flex items-center gap-2'>
                                    <Button variant='destructive' onClick={removeLectureHandler} disabled={removeLoading}>
                                          {
                                                removeLoading ? <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Please wait
                                                </> : 'Remove Lecture'
                                          }
                                    </Button>
                              </div>
                        </CardHeader>
                        <CardContent>
                              <div>
                                    <Label>Title</Label>
                                    <input type='text'
                                          value={lectureTitle}
                                          onChange={(e) => setLectureTitle(e.target.value)}
                                          className='w-full mt-2 mb-4 p-2 border rounded-md'
                                          placeholder='Eg. Introduction to JavaScript'
                                    />
                              </div>
                              <div className='my-5'>
                                    <Label>Video Source</Label>
                                    <div className='flex gap-4 mt-2 mb-4'>
                                          <label className='flex items-center gap-2'>
                                                <input 
                                                      type='radio' 
                                                      name='videoSource' 
                                                      value='file'
                                                      checked={videoSource === 'file'}
                                                      onChange={(e) => setVideoSource(e.target.value)}
                                                />
                                                Upload File
                                          </label>
                                          <label className='flex items-center gap-2'>
                                                <input 
                                                      type='radio' 
                                                      name='videoSource' 
                                                      value='youtube'
                                                      checked={videoSource === 'youtube'}
                                                      onChange={(e) => setVideoSource(e.target.value)}
                                                />
                                                YouTube Link
                                          </label>
                                    </div>

                                    {videoSource === 'file' ? (
                                          <>
                                                <Label>Video File <span className='text-red-500'>*</span></Label>
                                                <input type='file'
                                                      accept='video/*'
                                                      onChange={fileChangeHandler}
                                                      className='w-fit mt-2 mb-4 p-2 border rounded-md'
                                                />
                                          </>
                                    ) : (
                                          <>
                                                <Label>YouTube URL <span className='text-red-500'>*</span></Label>
                                                <input 
                                                      type='text'
                                                      value={youtubeUrl || ''}
                                                      onChange={handleYoutubeUrlChange}
                                                      className='w-full mt-2 mb-4 p-2 border rounded-md'
                                                      placeholder='https://www.youtube.com/watch?v=...'
                                                />
                                          </>
                                    )}
                              </div>
                              <div className='flex items-center space-x-2 my-5'>
                                    <Switch 
                                          id='airplane-mode' 
                                          checked={isFree}
                                          onCheckedChange={setIsFree}
                                          disabled={isCourseFreePriced}
                                    />
                                    <Label htmlFor='airplane-mode'>
                                          Is this video FREE
                                          {isCourseFreePriced && <span className='text-sm text-gray-500 ml-2'>(Course is free - all lectures are free)</span>}
                                    </Label>
                              </div>
                              {
                                    mediaProgress && (
                                          <div className='my-4'>
                                                <Progress value={uploadProgress} className='w-full' />
                                                <p>{`${uploadProgress}%`}</p>
                                          </div>
                                    )
                              }
                              <div className='mt-4'>
                                    <Button onClick={editLectureHandler} disabled={isLoading}>
                                       {
                                          isLoading ? <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Please wait
                                          </> : 'Update Lecture'
                                       }
                                    </Button>

                              </div>

                        </CardContent>

                  </Card>

            </div>
      )
}

export default LectureTab
