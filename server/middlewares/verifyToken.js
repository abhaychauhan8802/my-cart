import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.userId = user.id;
      next();
    });
  } catch (error) {
    console.log("Error in verifyToken", error.message);
    res.status(500).json({ message: error.message });
  }
};
