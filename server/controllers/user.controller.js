 import User from "../models/user.model.js";
 import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

// Generate 6-digit OTP
const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for registration
export const sendRegisterOTP = async (req, res) => {
      try {
            const { name, email, password } = req.body;
            
            if (!name || !email || !password) {
                  return res.status(400).json({
                        success: false,
                        message: "All fields are required"
                  });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser.isVerified) {
                  return res.status(400).json({
                        success: false,
                        message: "User already exists with this email"
                  });
            }

            // Generate OTP
            const otp = generateOTP();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            if (existingUser) {
                  // Update existing unverified user
                  existingUser.name = name;
                  existingUser.password = hashedPassword;
                  existingUser.otp = otp;
                  existingUser.otpExpiry = otpExpiry;
                  await existingUser.save();
            } else {
                  // Create new user
                  await User.create({
                        name,
                        email,
                        password: hashedPassword,
                        otp,
                        otpExpiry,
                        isVerified: false
                  });
            }

            // Send OTP email
            await sendOTPEmail(email, otp, name);

            return res.status(200).json({
                  success: true,
                  message: "OTP sent to your email successfully"
            });
      } catch (error) {
            console.error("Error sending OTP:", error);
            return res.status(500).json({
                  success: false,
                  message: "Failed to send OTP"
            });
      }
};

// Verify OTP and complete registration
export const verifyOTP = async (req, res) => {
      try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                  return res.status(400).json({
                        success: false,
                        message: "Email and OTP are required"
                  });
            }

            const user = await User.findOne({ email });

            if (!user) {
                  return res.status(404).json({
                        success: false,
                        message: "User not found"
                  });
            }

            // Check if OTP matches
            if (user.otp !== otp) {
                  return res.status(400).json({
                        success: false,
                        message: "Invalid OTP"
                  });
            }

            // Check if OTP is expired
            if (user.otpExpiry < new Date()) {
                  return res.status(400).json({
                        success: false,
                        message: "OTP has expired. Please request a new one"
                  });
            }

            // Mark user as verified and clear OTP
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();

            // Generate token and log in user
            return generateToken(res, user, "Account verified successfully");

      } catch (error) {
            console.error("Error verifying OTP:", error);
            return res.status(500).json({
                  success: false,
                  message: "Failed to verify OTP"
            });
      }
};

// Resend OTP
export const resendOTP = async (req, res) => {
      try {
            const { email } = req.body;

            if (!email) {
                  return res.status(400).json({
                        success: false,
                        message: "Email is required"
                  });
            }

            const user = await User.findOne({ email });

            if (!user) {
                  return res.status(404).json({
                        success: false,
                        message: "User not found"
                  });
            }

            if (user.isVerified) {
                  return res.status(400).json({
                        success: false,
                        message: "User is already verified"
                  });
            }

            // Generate new OTP
            const otp = generateOTP();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();

            // Send OTP email
            await sendOTPEmail(email, otp, user.name);

            return res.status(200).json({
                  success: true,
                  message: "OTP resent successfully"
            });
      } catch (error) {
            console.error("Error resending OTP:", error);
            return res.status(500).json({
                  success: false,
                  message: "Failed to resend OTP"
            });
      }
};

 export const register = async (req, res) => {
      try {
            // Registration logic here
            const { name, email, password } = req.body;
            if (!name || !email || !password) { 
                  return res.status(400).json({ 
                        success: false,
                        message: "All fields are required"
                  });
            }
            const user = await User.findOne({ email });     
            if (user) {
                  return res.status(400).json({ 
                        success: false,                                 
                        message: "User already exists"
                  });
            }
           const hashedPassword = await bcrypt.hash(password, 10);
           const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
           });
           // Set httpOnly JWT cookie named "token" and respond
           return generateToken(res, newUser, "Account created successfully");
      }
             catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ success: false, message: "Failed to register user" });
      }
};

// Login without OTP (OTP only for signup)
export const login = async (req, res) => {
      try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                  return res.status(400).json({
                        success: false,
                        message: "All fields are required"
                  });
            }

            const user = await User.findOne({ email });
            if (!user) {
                  return res.status(400).json({
                        success: false,
                        message: "Incorrect email or password"
                  });
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                  return res.status(400).json({
                        success: false,
                        message: "Incorrect email or password"
                  });
            }

            // Login directly without OTP
            return generateToken(res, user, `Welcome back, ${user.name}`);
            
      } catch (error) {
            console.error("Error during login:", error);
            return res.status(500).json({
                  success: false,
                  message: "Failed to login"
            });
      }
};

// Send OTP for login (DEPRECATED - keeping for backward compatibility)
export const sendLoginOTP = async (req, res) => {
      try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                  return res.status(400).json({
                        success: false,
                        message: "All fields are required"
                  });
            }

            const user = await User.findOne({ email });
            if (!user) {
                  return res.status(400).json({
                        success: false,
                        message: "Incorrect email or password"
                  });
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                  return res.status(400).json({
                        success: false,
                        message: "Incorrect email or password"
                  });
            }

            // If user is an instructor, login directly without OTP
            if (user.role === 'instructor') {
                  return generateToken(res, user, `Welcome back, ${user.name}`);
            }

            // For students, send OTP
            const otp = generateOTP();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();

            // Send OTP email
            await sendOTPEmail(email, otp, user.name);

            return res.status(200).json({
                  success: true,
                  message: "OTP sent to your email successfully"
            });
      } catch (error) {
            console.error("Error sending login OTP:", error);
            return res.status(500).json({
                  success: false,
                  message: "Failed to send OTP"
            });
      }
};

// Verify OTP for login
export const verifyLoginOTP = async (req, res) => {
      try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                  return res.status(400).json({
                        success: false,
                        message: "Email and OTP are required"
                  });
            }

            const user = await User.findOne({ email });

            if (!user) {
                  return res.status(404).json({
                        success: false,
                        message: "User not found"
                  });
            }

            // Check if OTP matches
            if (user.otp !== otp) {
                  return res.status(400).json({
                        success: false,
                        message: "Invalid OTP"
                  });
            }

            // Check if OTP is expired
            if (user.otpExpiry < new Date()) {
                  return res.status(400).json({
                        success: false,
                        message: "OTP has expired. Please request a new one"
                  });
            }

            // Clear OTP
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();

            // Generate token and log in user
            return generateToken(res, user, `Welcome back, ${user.name}`);

      } catch (error) {
            console.error("Error verifying login OTP:", error);
            return res.status(500).json({
                  success: false,
                  message: "Failed to verify OTP"
            });
      }
};

      export const logout = (_, res) => {
            try {
                  return res.status(200).cookie("token", "", {maxAge: 0}).json({
                        success: true,
                        message: "Logged out successfully"
                  }); 
                  
            } catch (error) {
                  console.error("Error logging out user:", error);
                  return res.status(500).json({
                         success: false,
                         message: "Failed to log out user"
                  });
            }
}
      export const getUserProfile = async (req, res) => {
            try {
                    const userId = req.id;
                    const user = await User.findById(userId)
                        .select("-password")
                        .populate({
                            path: "enrolledCourses",
                            populate: {
                                path: "creator",
                                select: "name photoUrl"
                            }
                        });
                    if (!user) {
                        return res.status(404).json({
                            success: false,
                            message: "User not found"
                        });
                    }
                    return res.status(200).json({
                        success: true,
                        user
                    });
                }

             catch (error) {       

                  console.error("Error fetching user profile:", error);
                  return res.status(500).json({
                        success: false,
                        message: "Failed to fetch user profile"
                  });
            }
      };
      export const updateProfile = async (req, res) => {
            try {
                  const { name } = req.body;
                  const userId = req.id;
                  const ProfilePhoto = req.file;
                  
                  console.log("Update Profile - Name:", name);
                  console.log("Update Profile - UserId:", userId);
                  console.log("Update Profile - File:", ProfilePhoto);

                  const user = await User.findById(userId);
                  if (!user) {
                        return res.status(404).json({
                              success: false,
                              message: "User not found"
                        });
                  }

                  let photoUrl = user.photoUrl; // Keep existing photo by default

                  // Only update photo if a new one is uploaded
                  if (ProfilePhoto) {
                        //extract the existing photo public id from the url if it is exists
                        if(user.photoUrl)
                        {
                          const publicId = user.photoUrl.split('/').pop().split('.')[0]; //extracting public id from url
                          //delete the existing photo from cloudinary
                          await deleteMediaFromCloudinary(publicId);
                        }

                        //upload new photo to cloudinary
                        const CloudResponse = await uploadToCloudinary(ProfilePhoto.path);
                        photoUrl = CloudResponse.secure_url;
                  }

                  const updatedData = {name, photoUrl};
                  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");

                  return res.status(200).json({
                        success: true,
                        message: "Profile updated successfully",
                        user: updatedUser
                  });
            } catch (error) {
                  console.error("Error updating user profile:", error);
                  return res.status(500).json({
                        success: false,
                        message: error.message || "Failed to update user profile"
                  });
            }
      };