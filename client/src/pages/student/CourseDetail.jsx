import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle, CardHeader } from "@/components/ui/card";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCourseDetailsWithStatusQuery } from "@/features/api/purchaseApi";
import ReactPlayer from "react-player";

const CourseDetail = () => {
  const { courseId } = useParams(); 
  const navigate = useNavigate();

  // Use the new query to fetch both course details and purchase status
  const { data, isLoading, isError, refetch } = useGetCourseDetailsWithStatusQuery(courseId, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load course details.</p>;

  const { course, purchased } = data;
 
  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-[#2D2F31] text-white w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 text-left">
          <h1 className="font-bold text-2xl md:text-3xl mt-2">{course?.courseTitle}</h1>
          <p className="text-base md:text-lg mt-2">{course?.subTitle}</p>
          <p className="mt-2">
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.creator?.name || "Instructor"}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm mt-2">
            <BadgeInfo size={"16"} />
            <p>Last updated {new Date(course?.updatedAt).toLocaleDateString()}</p>
          </div>
          <p className="mt-2">Students enrolled: {course?.enrolledStudents?.length || 0}</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-2/3 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <div
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: course?.Description }}
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-lg md:text-2xl">
                Course Content
              </CardTitle>
              <CardDescription>
                {course?.lectures?.length || 0} lectures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course?.lectures?.map((lecture, index) => (
                <div
                  key={lecture._id}
                  className="flex items-center gap-3 text-sm"
                >
                  <span>
                    {lecture.isPreviewFree ? (
                      <PlayCircle size={"14"} />
                    ) : (
                      <Lock size={"14"} />
                    )}
                  </span>
                  <p>{lecture.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full lg:w-1/3">
          <Card className="sticky top-4">
            {/* Card Content */}
            <CardContent className="p-4 flex flex-col">
              {course?.lectures && course.lectures.length > 0 && course.lectures[0]?.videoUrl ? (
                <>
                  <div className="w-full aspect-video mb-4 bg-gray-100 rounded-md overflow-hidden">
                    {(() => {
                      const videoUrl = course.lectures[0]?.videoUrl;
                      const isYouTube = videoUrl?.includes('youtube') || videoUrl?.includes('youtu.be');
                      
                      // Extract YouTube video ID
                      let videoId = null;
                      if (videoUrl?.includes('youtu.be/')) {
                        videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
                      } else if (videoUrl?.includes('youtube.com/watch?v=')) {
                        videoId = videoUrl.split('v=')[1]?.split('&')[0];
                      }
                      
                      return isYouTube && videoId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=1&rel=0`}
                          title="Course preview"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      ) : (
                        <ReactPlayer
                          width="100%"
                          height="100%"
                          url={videoUrl}
                          controls={true}
                          light={true}
                        />
                      );
                    })()}
                  </div>
                  <h1 className="text-base md:text-lg font-medium mb-2">
                    {course.lectures[0]?.lectureTitle}
                  </h1>
                </>
              ) : (
                <div className="w-full aspect-video mb-4 bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">No video preview available</p>
                </div>
              )}
              
              <div className="my-4">
                <h2 className="text-xl md:text-2xl font-bold">
                  {course?.CoursePrice === 0 || !course?.CoursePrice ? (
                    "Free"
                  ) : (
                    `₹${course?.CoursePrice}`
                  )}
                </h2>
              </div>
            </CardContent>

            {/* Card Footer */}
            <CardFooter className="flex flex-col gap-3 p-4 pt-0">
              {purchased ? (
                <Button
                  onClick={handleContinueCourse}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton 
                  courseId={courseId}
                  courseTitle={course?.courseTitle}
                  coursePrice={course?.CoursePrice}
                />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
