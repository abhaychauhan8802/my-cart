import jwt from "jsonwebtoken";

export const generateToken = ({ userId }) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return accessToken;
};
