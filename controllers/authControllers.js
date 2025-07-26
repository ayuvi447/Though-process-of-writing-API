import { User } from "../models/user.modal.js";
import { validateUpdateData } from "../helperFunctions/validations.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrpt from "bcrypt";
import {
  validateSignUpUser,
  validateSignInData,
} from "../helperFunctions/validations.js";

export const register = async (req, res) => {
  const { firstName, lastName, age, gender, password, emailId } = req.body;
//   const photopath = req.file ? req?.file.path : null //get the file path if uploaded ye tha local m save krne aur db mai file ka path bs store krne k liye ki file ya photo local m kaha save hai 
 
  const photoBase64 = req.file ? req.file.buffer.toString('base64') : null

  try {


    validateSignUpUser(req);

    const hashedPassword = await bcrpt.hash(password, 10);
    console.log("Hashed Password", hashedPassword);
    const alreadyUser = await User.findOne({ emailId });
    if (alreadyUser) {
      return res.json({
        message: "user already exist.",
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
    //   photo: photopath // ye bs bataiga ki photo kaha upload h uska path jaise ki abi mere local m save h 
    photo: photoBase64 // real db ma save krne k liye
    });

    console.log(user);

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    console.log("token", token);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    console.log(user);
    return res.status(200).json({
      message: "user saved successfully.",
      data: savedUser,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Error occured while signing up",
    });
  }
};

export const login = async (req, res) => {
  const { emailId, password } = req.body;

  try {
    validateSignInData(req);

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({
        message: "user emailId not found.",
      });
    }

    const isPasswordValid = await bcrpt.compare(password, user?.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "user password is not correct.",
      });
    }
    const token = await user.getJWT();
    res.cookie("token", token, {
      httpOnly: true, // ✔️ Prevents JS from accessing the cookie
      secure: true, // ✔️ Sends cookie only over HTTPS (required on Render)
      sameSite: "None", // ✔️ Allows frontend-backend on different domains
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours
    });

    return res.status(200).json({
      message: "User logiend successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(502).json({
      message: "Error occured while login.",
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({
      message: "Fetched all users successfully.",
      data: users,
    });
  } catch (error) {
    return res.status(502).json({
      message: "cant get all users.",
    });
  }
};

export const logOutUser = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    message: "user logout successfully.",
  });
};

export const updateProfile = async (req, res) => {
  const data = req.body;
  const { firstName, lastName, emailId, gender, age } = req.body;

  try {
    const allowedUpdates = ["firstName", "lastName", "gender", "age"];

    const isUpdateAllowed = Object.keys(data).every((key) => {
      return allowedUpdates.includes(key);
    });
    if (!isUpdateAllowed) {
      return res.send("invalid updating data.");
    }
    validateUpdateData(req);

    const loggedInUser = req.user;

    Object.keys(data).forEach((key) => {
      loggedInUser[key] = data[key];
    });

    await loggedInUser.save();

    return res.status(200).json({
      message: " user profile data updated successfully.",
      data: loggedInUser,
    });

    console.log(emailId);
  } catch (error) {
    return res.status(502).json({
      message: "Profile cant be updated 😢.",
    });
  }
};

export const deleteUser = async (req, res) => {
  const { _id, firstName } = req.user;

  try {
    const user = await User.findByIdAndDelete({ _id });
    if (!user) {
      return res.status(502).json({
        message: "The user you want to find to delete is not valid.",
      });
    }
    return res.status(200).json({
      message: ` ${firstName} having ${_id} is deleted successfully.`,
    });
  } catch (error) {
    return res.json({
      message: `Error occured while deleting the user ${firstName}`,
    });
  }
};

export const forgetPassword = async (req, res) => {
  const { emailId } = req.body;
  if (!emailId)
    return res.status(502).json({
      message: "Please provide emailID.",
    });
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(502).json({
        message: "User with this email not found in the system.",
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `https://localhost:5173/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOption = {
      from: process.env.MAIL_USER,
      to: emailId,
      subject: "Reset your password",
      html: `<p>Click the following link to reset your password. This link is valid for 15 minutes:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    };

    await transporter.sendMail(mailOption);

    res.status(200).json({
      message: "Reset link for password sent successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error in forget password",
    });
  }
};

export const changePassword = async (req, res) => {
  const { password, newPassword } = req.body;

  if (!password || !newPassword) {
    return res.status(502).json({
      message: "Please provide credentials.",
    });
  }

  try {
    if(password===newPassword){
        return res.status(400).json({
            message:'Old password and new password must be same.'
        })
    }
    
    const loggedInUser = req.user;

    const isMatch = await bcrpt.compare(password, loggedInUser.password)
    if(!isMatch){
        return res.status(400).json({
            message: 'password does not match with the old password.'
        })
    }
    const newHashedPassword = await bcrpt.hash(newPassword, 10)
    loggedInUser.password = newHashedPassword

    await loggedInUser.save()

    return res.status(200).json({
        message: 'user password changed successfully.'
    })

  } catch (err) {
    return res.status(401).json({
      message: "cant change password",
    });
  }
};
