import jwt from "jsonwebtoken";
import { User } from "../models/user.modal.js";

export const isAuth = async (req, res, next) => {
  const cookie = req.cookie;
  const { token } = cookie;

  try {
    const decodedMsg = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedMsg;

    const user = await User.findOne({ _id });
    if (!user) {
      throw new Error("User cant find.");
    }

    req.user = user;
    next();
  } catch (error) {
    return res.send("isAuth having someError");
  }
};
