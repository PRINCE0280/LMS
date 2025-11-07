import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
      try {
            const token = req.cookies.token;
            if (!token) {
                  return res.status(401).json({
                        success: false,
                        message: "Unauthorized"
                  });
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            if (!decoded) {
                  return res.status(401).json({
                        success: false,
                        message: "Invalid token"
                  });
            }
            req.id = decoded.userId;
            next();
      } catch (error) {
            console.error("Error verifying token:", error);
            return res.status(500).json({
                  success: false,
                  message: "Failed to verify token"
            });
      }
}
export default isAuthenticated;