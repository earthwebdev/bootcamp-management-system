import User from "../models/users.model.js";
import config from "../config/config.js";
//import pkg from 'jsonwebtoken';
//const { Jwt } = pkg;
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter name, email and password",
      });
    }

    //const user = User.findOne({email: email});
    const user = await User.findOne({ email });
    //console.log(user);
    if (user) {
      return res.status(400).json({
        success: false,
        message: "The user has already registered.",
      });
    } else {
      const user = new User(req.body);
      await user.save();
      return res.status(200).json({
        success: true,
        data: user,
        message: "User successfully registered",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    //const user = User.findOne({email: email});
    const user = await User.findOne({ email: email });
    //console.log(user);
    if (user) {
      const matchPasswd = await user.validPassword(password);
      //console.log(matchPasswd);
      if (matchPasswd) {
        const token = jwt.sign({ id: user._id }, config.JWT_SECRET_KEY, {
          expiresIn: "7d",
        });
        
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $set: { jwt_token: token } },
          { new: true }
        );

        return res.status(200).json({
          success: true,
          data:{
            token: updatedUser.jwt_token,
            role: updatedUser.role, 
          },          
          message: "User successfully login",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Please enter the correct email and password.",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Please enter the correct email and password.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
//profile page personal
export const userProfileMe = async (req, res) => {
  try {
    //console.log(req.user.id);
    const user = await User.findOne({ _id: req.user.id }).select(
      "name email role"
    );
    //console.log(user.jwt_token);
    if (user) {
      return res.status(200).json({
        success: true,
        data: user,
        message: "User profile fetch successfully",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "No user found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
//logout user
export const logoutUser = async (req, res) => {
  try {
    //console.log(req.user.id);
    const user = await User.findOne({ _id: req.user.id });
    //console.log(user.jwt_token);
    if (user && user.jwt_token !== "undefined") {
      const updateUserLogout = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: { jwt_token: "undefined" } },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "User successfully logout",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "User has already logout",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    //.select('name email  resetPasswordToken resetPasswordExpired');
    //console.log(user);return;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found",
      });
    }

    const resetToken = user.getResetToken();
    //console.log(resetToken);
    const mailMessage =
      "your are using. Your reset token is <a href='http://localhost:5173/resetpassword/" +
      resetToken + "'>Click here to reset password</a>" +
      "<br> your token will expire in ten minutes.";
    //console.log(user);
    try {
      await sendEmail({
        //email: user.email,
        //from: "Mailtrap <info@bootcamp.com>", // sender address
        email: user.email, // list of receivers with comma separators
        subject: "Password reset token",
        message: mailMessage,
      });

      await user.save({ validateBeforeSave: false });
    } catch (error) {
      user.resetPasswordToken = "";
      user.resetPasswordExpired = "";
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Email sent successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    //console.log(req.params)
    const resetToken = req.params.resettoken;
    //hashed password
    const hashToken = crypto
      .createHash("sha512")
      .update(resetToken)
      .digest("hex");
    console.log(hashToken, ' === ', resetToken)
    const user = await User.findOne({
      resetPasswordToken: hashToken,
      resetPasswordExpired: { $gte: new Date() },
    });
//console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid password token / password expired",
      });
    }	

    const hashPass = await hashPassword(req.body.password);
    const data = {
      password: hashPass,
      resetPasswordToken: "",
      resetPasswordExpired: "",
    };
    await User.findOneAndUpdate(
      { _id: user._id },
      { $set: data },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

const hashPassword = async (passwd) => {
  //generate salt
  const genSalt = await bcrypt.genSalt(10);
  const encryptPassword = await bcrypt.hash(passwd.toString(), genSalt);
  return encryptPassword;
};

//crud operation for the admin role user

export const usersListsForAdmin = async (req, res) => {
  try {
    //$limit = ;
    //console.log(req.params, ' ==', req.query);
    //const {page=1,limit=10} = req.query;
    const limit =
      req.query.limit !== undefined && req.query.limit < 20
        ? req.query.limit
        : 20;
    const search = req.query.search !== undefined ? req.query.search : "";
    const page = req.query.page !== undefined ? req.query.page : 1;
    const sortBy =
      req.query.sortby !== undefined ? req.query.sortby : "createdAt.desc";
    const sortingArray = sortBy.split(".");
    let sortData = {};
    if (sortingArray.length > 0) {
      const sortbyname = sortingArray[0];
      //.sort( {sortingArray[0]: sortingArray[1] === 'asc'?'1':'-1'} )
      const sortValue = sortingArray[1] === "asc" ? "1" : "-1";
      sortData = {
        [sortbyname]: sortingArray[1] === "asc" ? 1 : "-1",
      };
      console.log(sortData, sortbyname, sortingArray);
    }
    console.log(sortData);

    const users = await User.find({
      $or: [
        { name: { $regex: ".*" + search + ".*" } },
        { email: { $regex: ".*" + search + ".*" } },
      ],
      $and: [
        {
          role: { $ne: "admin" },
        },
      ],
    })
      .sort(sortData)
      .skip(limit * (page - 1))
      .limit(limit);
    //console.log(users);
    if (users?.length > 0) {
      return res.status(200).json({
        success: true,
        data: users,
        message: "Users get successfully.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "No users found.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserByUserId = async (req, res) => {
  try {
    const userId = req.params.userid;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "No user found.",
      });
    }
    //console.log(userId);return;
    const user = await User.findOne({ _id: userId }).select("name email role");
    //console.log(user);
    if (user) {
      return res.status(200).json({
        success: true,
        data: user,
        message: "User get successfully.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "No user found.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const CreateUserByAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "No user found.",
    });
  }

  const userByemail = await User.findOne({ email });
  if (userByemail) {
    return res.status(400).json({
      success: false,
      message: "User has already registered. Please try again.",
    });
  }

  const user = new User(req.body);
  await user.save();
  return res.status(200).json({
    success: true,
    data: user,
    message: "User successfully created",
  });
};

export const updateUserByAdmin = async (req, res) => {
  const userId = req.params.userid;
  //console.log(userId);return;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "No valid user found.",
    });
  }
  if (userId === req.user.id) {
    return res.status(400).json({
      success: false,
      message: "Own user can not be deleted.",
    });
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  if (!name) {
    return res.status(400).json({
      success: false,
      message: "No user found.",
    });
  }
  if (email !== undefined) {
    const userByemail = await User.findOne({ email });
    if (userByemail) {
      return res.status(400).json({
        success: false,
        message: "User has already registered. Please try again.",
      });
    }
  }

  if (role !== undefined) {
    if (!["user", "publisher"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Error user role.",
      });
    }
  }

  if (password !== undefined) {
    const encPass = await hashPassword(req.body.password);
    req.body.password = encPass;
  }

  const updateuser = await User.findByIdAndUpdate(
    userId,
    { $set: req.body },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    data: updateuser,
    message: "User successfully updated",
  });
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    const userId = req.params.userid;
    //console.log(userId);return;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "No valid user found.",
      });
    }
    //console.log(userId, req.user.id);
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Own user can not be deleted.",
      });
    }
    const user = await User.findOne({ _id: userId }).select("name email role");

    //console.log(user);
    if (user && user.role !== "admin") {
      await User.deleteOne({ _id: userId });
      return res.status(200).json({
        success: true,
        message: "User deleted successfully.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "No user found.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
