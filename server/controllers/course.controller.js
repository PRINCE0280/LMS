import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, deletevideoFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
      try {
            const { courseTitle, category } = req.body;
            if (!courseTitle || !category) {
                  return res.status(400).json({
                        message: 'Course title and category are required'
                  });
            }
            const course = await Course.create({
                  courseTitle,
                  category,
                  creator: req.id,
                  instructor: req.id,
            });
            return res.status(201).json({
                  course,
                  message: 'Course created successfully'
            });
      } catch (error) {

            return res.status(500).json({ message: 'Server Error', error: error.message });
      }
};

export const searchCourse = async (req, res) => {
      try {
            const { query = "", categories = [], sortByPrice = "" } = req.query;
            console.log(categories);

            // create search query
            const searchCriteria = {
                  isPublished: true,
                  $or: [
                        { courseTitle: { $regex: query, $options: "i" } },
                        { subTitle: { $regex: query, $options: "i" } },
                        { category: { $regex: query, $options: "i" } },
                  ]
            }

            // if categories selected
            if (categories.length > 0) {
                  searchCriteria.category = { $in: categories };
            }

            // define sorting order
            const sortOptions = {};
            if (sortByPrice === "low") {
                  sortOptions.CoursePrice = 1;//sort by price in ascending
            } else if (sortByPrice === "high") {
                  sortOptions.CoursePrice = -1; // descending
            }

            let courses = await Course.find(searchCriteria).populate({ path: "creator", select: "name photoUrl" }).sort(sortOptions);

            return res.status(200).json({
                  success: true,
                  courses: courses || []
            });

      } catch (error) {
            console.log(error);

      }
}

export const getPublishedCourses = async (_, res) => {
      try {
            const courses = await Course.find({ isPublished: true }).populate({ path: 'creator', select: 'name photoUrl' });
            if (!courses) {
                  return res.status(404).json({
                        courses: [],
                        message: 'No published courses found'
                  });
            }
            return res.status(200).json({
                  courses,
            });
      }
      catch (error) {
            return res.status(500).json({ message: 'failed to get published courses', error: error.message });
      }
};

export const getCreatorCourses = async (req, res) => {
      try {
            const userId = req.id;
            const courses = await Course.find({ creator: userId });
            if (!courses) {
                  return res.status(404).json({
                        courses: [],
                        message: 'No courses found for this creator'
                  });
            };
            return res.status(200).json({
                  courses,
            });

      }
      catch (error) {

            return res.status(500).json({ message: 'Server Error', error: error.message });
      }
}
export const editCourse = async (req, res) => {
      try {
            const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
            const thumbnail = req.file ? req.file.path : null;

            let course = await Course.findById(req.params.courseId);
            if (!course) {
                  return res.status(404).json({
                        message: 'Course not found'
                  });
            }
            let courseThumbnail;
            if (thumbnail) {
                  if (course.CourseThumbnail) {
                        const publicId = course.CourseThumbnail.split('/').pop().split('.')[0];
                        await deleteMediaFromCloudinary(publicId);
                  }
                  //Upload thumbnail to cloudinary
                  courseThumbnail = await uploadToCloudinary(thumbnail);
            }

            const updateData = {
                  courseTitle,
                  subTitle,
                  Description: description,
                  category,
                  courseLevel,
                  CoursePrice: coursePrice,
            };
            if (courseThumbnail?.secure_url) {
                  updateData.CourseThumbnail = courseThumbnail.secure_url;
            }

            course = await Course.findByIdAndUpdate(req.params.courseId, updateData, { new: true });
            return res.status(200).json({
                  course,
                  message: 'Course updated successfully'
            });
      } catch (error) {
            return res.status(500).json({
                  message: 'Failed to edit course',
                  error: error.message
            });

      }
};
export const getCourseById = async (req, res) => {
      try {
            const courseId = req.params.courseId;
            const course = await Course.findById(courseId);
            if (!course) {
                  return res.status(404).json({
                        message: 'Course not found'
                  });
            }
            return res.status(200).json({
                  course,
            });
      } catch (error) {
            return res.status(500).json({ message: 'Failed to get course by id', error: error.message });
      }
};

export const removeCourse = async (req, res) => {
      try {
            const { courseId } = req.params;
            const course = await Course.findById(courseId);
            if (!course) {
                  return res.status(404).json({ message: 'Course not found' });
            }

            // delete course thumbnail if exists
            if (course.CourseThumbnail) {
                  try {
                        const publicId = course.CourseThumbnail.split('/').pop().split('.')[0];
                        await deleteMediaFromCloudinary(publicId);
                  } catch (err) {
                        console.log('Failed to delete course thumbnail from Cloudinary:', err.message);
                  }
            }

            // delete lectures and their videos
            if (course.lectures?.length) {
                  for (const lectureId of course.lectures) {
                        const lecture = await Lecture.findById(lectureId);
                        if (lecture?.publicId) {
                              try {
                                    await deletevideoFromCloudinary(lecture.publicId);
                              } catch (err) {
                                    console.log('Failed to delete lecture video from Cloudinary:', err.message);
                              }
                        }
                        await Lecture.findByIdAndDelete(lectureId);
                  }
            }

            await Course.findByIdAndDelete(courseId);
            return res.status(200).json({ success: true, message: 'Course removed successfully' });
      } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to remove course', error: error.message });
      }
};

export const createLecture = async (req, res) => {
      try {
            const { lectureTitle } = req.body;
            const { courseId } = req.params;
            console.log('CreateLecture request params:', { courseId });
            console.log('CreateLecture request body:', { lectureTitle });
            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                  return res.status(400).json({ message: 'Invalid course id' });
            }
            if (!lectureTitle) {
                  return res.status(400).json({
                        message: 'Lecture title is required'
                  });
            }
            const lecture = await Lecture.create({ lectureTitle });
            const course = await Course.findById(courseId);
            if (course) {
                  course.lectures.push(lecture._id);
                  await course.save();
            } else {
                  return res.status(404).json({
                        message: 'Course not found'
                  });
            }
            return res.status(201).json({
                  lecture,
                  message: 'Lecture created successfully'
            });
      } catch (error) {
            console.error('CreateLecture error:', error);
            return res.status(500).json({ message: 'Failed to create lecture', error: error.message });
      }
}

export const getCourseLecture = async (req, res) => {
      try {
            const { courseId } = req.params;
            const course = await Course.findById(courseId).populate('lectures');
            if (!course) {
                  return res.status(404).json({
                        message: 'Course not found'
                  });
            }
            return res.status(200).json({
                  lectures: course.lectures,
            });
      } catch (error) {
            return res.status(500).json({ message: 'Failed to get lecture', error: error.message });
      }
};
export const editLecture = async (req, res) => {
      try {
            const { lectureTitle, videoInfo, isPreviewFree } = req.body;
            const { lectureId, courseId } = req.params;
            console.log("Edit Lecture Request - Params:", { lectureId, courseId });
            console.log("Edit Lecture Request - Body:", { lectureTitle, videoInfo, isPreviewFree });
            const lecture = await Lecture.findById(lectureId);
            if (!lecture) {
                  return res.status(404).json({
                        message: 'Lecture not found'
                  });
            }
            //update lecture
            if (lectureTitle) lecture.lectureTitle = lectureTitle;
            if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
            if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
            if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;
            await lecture.save();
            // Ensure the course still has the lecture id if it was not already 
            const course = await Course.findById(courseId);
            if (course && !course.lectures.includes(lecture._id)) {
                  course.lectures.push(lecture._id);
                  await course.save();
            }
            return res.status(200).json({
                  success: true,
                  lecture,
                  message: 'Lecture updated successfully'
            });
      } catch (error) {
            console.log("Edit lecture error:", error);
            return res.status(500).json({ success: false, message: 'Failed to edit lecture', error: error.message });
      }
};
export const removeLecture = async (req, res) => {
      try {
            const { lectureId } = req.params;

            const lecture = await Lecture.findByIdAndDelete(lectureId);
            if (!lecture) {
                  return res.status(404).json({
                        message: 'Lecture not found'
                  });
            }
            //delete lecture reference from cloudinary if exists
            if (lecture.publicId) {
                  await deletevideoFromCloudinary(lecture.publicId);
            }
            // remove lecture from course's lecture list
            await Course.updateOne(
                  { lectures: lectureId },
                  { $pull: { lectures: lectureId } }
            );
            return res.status(200).json({
                  success: true,
                  message: 'Lecture removed successfully'
            });
      } catch (error) {
            console.log("Remove lecture error:", error);
            return res.status(500).json({ success: false, message: 'Failed to remove lecture', error: error.message });
      }
};
export const getLectureById = async (req, res) => {
      try {
            const { lectureId } = req.params;
            const lecture = await Lecture.findById(lectureId);
            if (!lecture) {
                  return res.status(404).json({
                        message: 'Lecture not found'
                  });
            }

            // Find the course this lecture belongs to
            const course = await Course.findOne({ lectures: lectureId });
            const isCourseFreePriced = !course?.CoursePrice || course?.CoursePrice === 0;

            return res.status(200).json({
                  lecture,
                  isCourseFreePriced,
                  message: 'Lecture retrieved successfully'
            });
      } catch (error) {
            return res.status(500).json({ message: 'Failed to get lecture', error: error.message });
      }
};

// Publish and unpublish course logic
export const toggleCoursePublish = async (req, res) => {
      try {
            const { courseId } = req.params;
            const { publish } = req.query;
            const course = await Course.findById(courseId);
            if (!course) {
                  return res.status(404).json({
                        message: 'Course not found'
                  });
            }

            // Update only the isPublished field without triggering full validation
            const updatedCourse = await Course.findByIdAndUpdate(
                  courseId,
                  { isPublished: publish === 'true' },
                  { new: true, runValidators: false }
            );

            return res.status(200).json({
                  success: true,
                  course: updatedCourse,
                  message: `Course has been ${updatedCourse.isPublished ? 'published' : 'unpublished'} successfully`
            });
      } catch (error) {
            console.log("Fail to update Status:", error);
            return res.status(500).json({ success: false, message: 'Failed to toggle course publish status', error: error.message });
      }
};