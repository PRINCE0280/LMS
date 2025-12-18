 import User from "../models/user.model.js";
 import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";
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
            // Send a single response including cookie + JSON using helper
            return generateToken(res, user, `Welcome back, ${user.name}`);
      } catch (error) {
            console.error("Error logging in user:", error);
            res.status(500).json({ success: false, message: "Failed to log in user" });
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