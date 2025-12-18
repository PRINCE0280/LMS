import Razorpay from "razorpay";
import crypto from "crypto";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import User from "../models/user.model.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    console.log("Received courseId:", courseId, "Type:", typeof courseId);

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if course is free
    if (!course.CoursePrice || course.CoursePrice === 0) {
      // Directly enroll user for free courses
      const existingPurchase = await CoursePurchase.findOne({
        userId,
        courseId,
        status: "completed",
      });

      if (existingPurchase) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }

      // Create free purchase record
      const freePurchase = new CoursePurchase({
        userId,
        courseId,
        amount: 0,
        status: "completed",
        paymentIntentId: `free_${Date.now()}`,
      });

      await freePurchase.save();

      // Enroll user
      await User.findByIdAndUpdate(userId, {
        $addToSet: { enrolledCourses: courseId },
      });

      await Course.findByIdAndUpdate(courseId, {
        $addToSet: { enrolledStudents: userId },
      });

      return res.status(200).json({
        success: true,
        free: true,
        message: "Enrolled in free course successfully",
      });
    }

    // Check if already purchased
    const existingPurchase = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed",
    });

    if (existingPurchase) {
      return res.status(400).json({ message: "Course already purchased" });
    }

    // Create Razorpay order with shortened receipt
    const receiptId = `rcpt_${Date.now().toString().slice(-10)}`;
    const options = {
      amount: course.CoursePrice * 100, // amount in paise
      currency: "INR",
      receipt: receiptId,
      notes: {
        courseId: courseId,
        userId: userId,
        courseTitle: course.courseTitle,
      },
    };

    const order = await razorpay.orders.create(options);

    // Create purchase record
    const newPurchase = new CoursePurchase({
      userId,
      courseId,
      amount: course.CoursePrice,
      status: "pending",
      paymentIntentId: order.id,
    });

    await newPurchase.save();

    return res.status(200).json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    const userId = req.id;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Update purchase status
    const purchase = await CoursePurchase.findOne({
      paymentIntentId: razorpay_order_id,
    }).populate({ path: "courseId" });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    purchase.status = "completed";
    purchase.paymentIntentId = razorpay_payment_id;
    await purchase.save();

    // Make all lectures visible
    if (purchase.courseId && purchase.courseId.lectures.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: purchase.courseId.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }

    // Update user's enrolledCourses
    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId },
    });

    // Update course's enrolledStudents
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { enrolledStudents: userId },
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      purchase,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};


export const getCourseDetailsWithPurchaseStatus = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.id;

  try {
    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const purchased = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed",
    });

    res.json({
      course,
      purchased: !!purchased,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching course details" });
  }
};

export const getAllPurchasedCourse = async (req, res) => {
  try {
    const userId = req.id;
    const purchasedCourse = await CoursePurchase.find({
      userId,
      status: "completed",
    }).populate("courseId");

    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
