import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ReactPlayer from "react-player";

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;
  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId, {
      refetchOnMountOrArgChange: true,
    });

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [
    completeCourse,
    { data: markCompleteData, isSuccess: completedSuccess },
  ] = useCompleteCourseMutation();
  const [
    inCompleteCourse,
    { data: markInCompleteData, isSuccess: inCompletedSuccess },
  ] = useInCompleteCourseMutation();

  useEffect(() => {
    console.log(markCompleteData);

    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData.message);
    }
    if (inCompletedSuccess) {
      refetch();
      toast.success(markInCompleteData.message);
    }
  }, [completedSuccess, inCompletedSuccess]);

  const [currentLecture, setCurrentLecture] = useState(null);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load course details</p>;

  console.log(data);

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle } = courseDetails;

  // initialze the first lecture is not exist
  const initialLecture =
    currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

  const videoUrl = currentLecture?.videoUrl || initialLecture?.videoUrl;
  
  // Extract YouTube video ID and create embed URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    try {
      // Handle youtu.be short links (e.g., https://youtu.be/VIDEO_ID)
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0]?.split('/')[0];
        return id;
      }
      
      // Handle youtube.com/watch?v= links (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const id = urlParams.get('v');
        return id;
      }
      
      // Handle youtube.com/live/ links (e.g., https://www.youtube.com/live/VIDEO_ID)
      if (url.includes('youtube.com/live/')) {
        const id = url.split('live/')[1]?.split('?')[0]?.split('&')[0];
        return id;
      }
      
      // Handle youtube.com/embed/ links (e.g., https://www.youtube.com/embed/VIDEO_ID)
      if (url.includes('youtube.com/embed/')) {
        const id = url.split('embed/')[1]?.split('?')[0]?.split('&')[0];
        return id;
      }
      
      // Handle youtube.com/v/ links (e.g., https://www.youtube.com/v/VIDEO_ID)
      if (url.includes('youtube.com/v/')) {
        const id = url.split('v/')[1]?.split('?')[0]?.split('&')[0];
        return id;
      }

      // Handle youtube.com/shorts/ links (e.g., https://www.youtube.com/shorts/VIDEO_ID)
      if (url.includes('youtube.com/shorts/')) {
        const id = url.split('shorts/')[1]?.split('?')[0]?.split('&')[0];
        return id;
      }
    } catch (error) {
      console.error("Error extracting YouTube video ID:", error);
    }
    
    return null;
  };
  
  const videoId = getYouTubeVideoId(videoUrl);
  const isYouTube = videoUrl?.includes('youtube') || videoUrl?.includes('youtu.be');
  
  // Debug: Log video info
  console.log("=== Video Debug Info ===");
  console.log("Video URL:", videoUrl);
  console.log("Is YouTube:", isYouTube);
  console.log("Video ID:", videoId);
  console.log("Will use iframe:", isYouTube && videoId);
  console.log("=====================");

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };
  // Handle select a specific lecture to watch
  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };


  const handleCompleteCourse = async () => {
    await completeCourse(courseId);
  };
  const handleInCompleteCourse = async () => {
    await inCompleteCourse(courseId);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 mt-20 mb-10">
      {/* Display course name  */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseTitle}</h1>
        <Button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          variant={completed ? "outline" : "default"}
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> <span>Completed</span>{" "}
            </div>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Video section  */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div className="w-full bg-black rounded-lg" style={{ paddingBottom: '56.25%', position: 'relative' }}>
            {videoUrl ? (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                {isYouTube && videoId ? (
                  <iframe
                    key={videoId}
                    src={`https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=1&rel=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ width: '100%', height: '100%' }}
                    onLoad={() => {
                      console.log("✅ YouTube video loaded");
                      handleLectureProgress(currentLecture?._id || initialLecture._id);
                    }}
                  />
                ) : (
                  <ReactPlayer
                    key={videoUrl}
                    url={videoUrl}
                    controls={true}
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    onReady={() => console.log("✅ ReactPlayer ready")}
                    onPlay={() => {
                      console.log("▶️ Video playing");
                      handleLectureProgress(currentLecture?._id || initialLecture._id);
                    }}
                    onError={(error) => console.error("❌ ReactPlayer error:", error)}
                  />
                )}
              </div>
            ) : (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} className="flex items-center justify-center text-white">
                No video available
              </div>
            )}
          </div>
          {/* Display current watching lecture title */}
          <div className="mt-2 ">
            <h3 className="font-medium text-lg">
              {`Lecture ${courseDetails.lectures.findIndex(
                (lec) =>
                  lec._id === (currentLecture?._id || initialLecture._id)
              ) + 1
                } : ${currentLecture?.lectureTitle || initialLecture?.lectureTitle
                }`}
            </h3>
          </div>
        </div>
        {/* Lecture Sidebar  */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
          <div className="flex-1 overflow-y-auto">
            {courseDetails?.lectures.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${lecture._id === currentLecture?._id
                    ? "bg-gray-200 dark:dark:bg-gray-800"
                    : ""
                  } `}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {lecture.lectureTitle}
                      </CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      variant={"outline"}
                      className="bg-green-200 text-green-600"
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;