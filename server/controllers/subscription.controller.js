import Razorpay from "razorpay";
import crypto from "crypto";
import { Subscription } from "../models/subscription.model.js";
import User from "../models/user.model.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Razorpay Order for Subscription
export const createSubscriptionOrder = async (req, res) => {
  try {
    const userId = req.id;
    const { subscriptionType, amount } = req.body;

    // Validate subscription type
    const validSubscriptionTypes = ["generative-ai", "it-certifications", "data-science"];
    if (!validSubscriptionTypes.includes(subscriptionType)) {
      return res.status(400).json({ message: "Invalid subscription type" });
    }

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      userId,
      subscriptionType,
      status: "active",
    });

    if (existingSubscription) {
      return res.status(400).json({ 
        message: "You already have an active subscription",
        subscription: existingSubscription 
      });
    }

    // Create Razorpay order
    const receiptId = `sub_${Date.now().toString().slice(-10)}`;
    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: receiptId,
      notes: {
        subscriptionType: subscriptionType,
        userId: userId,
      },
    };

    const order = await razorpay.orders.create(options);

    // Create subscription record
    const newSubscription = new Subscription({
      userId,
      subscriptionType,
      amount,
      status: "pending",
      paymentIntentId: order.id,
    });

    await newSubscription.save();

    res.status(200).json({
      success: true,
      order: order,
      keyId: process.env.RAZORPAY_KEY_ID,
      subscriptionId: newSubscription._id,
    });
  } catch (error) {
    console.error("Create subscription order error:", error);
    res.status(500).json({ message: "Failed to create subscription order" });
  }
};

// Verify Subscription Payment
export const verifySubscriptionPayment = async (req, res) => {
  try {
    const userId = req.id;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      subscriptionId,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: "Payment verification failed" 
      });
    }

    // Update subscription status
    const subscription = await Subscription.findById(subscriptionId);
    
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Set subscription dates (1 month from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    subscription.status = "active";
    subscription.startDate = startDate;
    subscription.endDate = endDate;
    subscription.paymentIntentId = razorpay_payment_id;
    await subscription.save();

    // Update user's subscription field
    await User.findByIdAndUpdate(userId, {
      $set: { 
        [`subscription.${subscription.subscriptionType}`]: {
          active: true,
          endDate: endDate,
        }
      },
    });

    res.status(200).json({
      success: true,
      message: "Subscription activated successfully",
      subscription,
    });
  } catch (error) {
    console.error("Verify subscription payment error:", error);
    res.status(500).json({ message: "Failed to verify subscription payment" });
  }
};

// Get User Subscriptions
export const getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.id;

    const subscriptions = await Subscription.find({ 
      userId,
      status: "active" 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    console.error("Get user subscriptions error:", error);
    res.status(500).json({ message: "Failed to get subscriptions" });
  }
};

// Check Subscription Status
export const checkSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.id;
    const { subscriptionType } = req.params;

    const subscription = await Subscription.findOne({
      userId,
      subscriptionType,
      status: "active",
      endDate: { $gte: new Date() },
    });

    res.status(200).json({
      success: true,
      hasActiveSubscription: !!subscription,
      subscription: subscription || null,
    });
  } catch (error) {
    console.error("Check subscription status error:", error);
    res.status(500).json({ message: "Failed to check subscription status" });
  }
};
