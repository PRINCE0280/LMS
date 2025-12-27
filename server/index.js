import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import userRoutes from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import courseRoutes from './routes/course.route.js';
import mediaRoute from './routes/media.route.js';
import purchaseRoute from './routes/purchaseCourse.route.js';
import courseProgressRoute from './routes/courseProgress.route.js';
import subscriptionRoute from './routes/subscription.route.js';
import assignmentRoute from './routes/assignment.route.js';
import quizRoute from './routes/quiz.route.js';
dotenv.config({});

connectDB();
const app = express();

const PORT = process.env.PORT  || 4500 ;

// default middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

//apis
app.use('/api/v1/media',mediaRoute );
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/purchase', purchaseRoute);
app.use('/api/v1/progress', courseProgressRoute);
app.use('/api/v1/subscription', subscriptionRoute);
app.use('/api/v1/assignment', assignmentRoute);
app.use('/api/v1/quiz', quizRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});