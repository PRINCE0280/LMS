import jwt from 'jsonwebtoken';

// Generates a JWT and sends it as an httpOnly cookie along with a JSON body
export const generateToken = (res, user, message) => {
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: '2d',
      });

      return res
            .cookie('token', token, {
                  httpOnly: true,
                  sameSite: 'strict',
                  secure: process.env.NODE_ENV === 'production',
                  maxAge: 2 * 24 * 60 * 60 * 1000,
                  path: '/',
            })
            .status(200)
            .json({
                  success: true,
                  user,
                  message,
            });
};