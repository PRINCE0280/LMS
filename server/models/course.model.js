import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({      
      courseTitle: {
            type: String,
            required: true,
      },
      subTitle: {    
            type: String,
      },
      Description: {    
            type: String,
      },
      instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
      },
      category:{    
            type: String,
            required: true,
      },
      courseLevel: {
            type: String, // duration in hours
            enum: ['Beginner', 'Intermediate', 'Advanced'],
      },
      CoursePrice: {
            type: Number,
      },
       CourseThumbnail: {
            type: String,
      },
      enrolledStudents: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
      }],
      lectures: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lecture',
            }],
      creator : 
      {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
      },
      isPublished: {    
            type: Boolean,
            default: false,
      },
},{ timestamps: true });
 export const Course = mongoose.model('Course', courseSchema);
