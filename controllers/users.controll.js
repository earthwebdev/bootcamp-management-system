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
      res.status(400).json({
        status: false,
        message: "Please enter name, email and password",
      });
    }

    //const user = User.findOne({email: email});
    const user = await User.findOne({ email });
    //console.log(user);
    if (user) {
      res.status(400).json({
        status: false,
        message: "The user has already registered.",
      });
    } else {
      const user = new User(req.body);
      await user.save();
      res.status(200).json({
        status: true,
        data: user,
        message: "User successfully registered",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        status: false,
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
          expiresIn: "1d",
        });
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $set: { jwt_token: token } },
          { new: true }
        );

        res.status(200).json({
          status: true,
          token: token,
          message: "User successfully registered",
        });
      } else {
        res.status(400).json({
          status: false,
          message: "Please enter the correct email and password.",
        });
      }
    } else {
      res.status(400).json({
        status: false,
        message: "Please enter the correct email and password.",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
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
      res.status(200).json({
        status: true,
        data: user,
        message: "User profile fetch successfully",
      });
    } else {
      res.status(200).json({
        status: false,
        message: "No user found",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
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
      res.status(200).json({
        status: true,
        message: "User successfully logout",
      });
    } else {
      res.status(200).json({
        status: false,
        message: "User has already logout",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
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
      res.status(400).json({
        status: false,
        message: "No user found",
      });
    }

    const resetToken = user.getResetToken();
    console.log(resetToken);
    const mailMessage =
      "your are using. Your reset token is " +
      resetToken +
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
      res.status(400).json({
        status: false,
        message: error.message,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Email sent successfully.",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
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
    //console.log(hashToken)
    const user = await User.findOne({
      resetPasswordToken: hashToken,
      resetPasswordExpired: { $gte: new Date() },
    });

    if (!user) {
      res.status(400).json({
        status: false,
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

    res.status(200).json({
      status: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(200).json({
      status: false,
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
      res.status(200).json({
        status: true,
        data: users,
        message: "Users get successfully.",
      });
    } else {
      res.status(400).json({
        status: false,
        message: "No users found.",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const getUserByUserId = async (req, res) => {
  try {
    const userId = req.params.userid;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        status: false,
        message: "No user found.",
      });
    }
    //console.log(userId);return;
    const user = await User.findOne({ _id: userId }).select("name email role");
    //console.log(user);
    if (user) {
      res.status(200).json({
        status: true,
        data: user,
        message: "User get successfully.",
      });
    } else {
      res.status(400).json({
        status: false,
        message: "No user found.",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const CreateUserByAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({
      status: false,
      message: "No user found.",
    });
  }

  const userByemail = await User.findOne({ email });
  if (userByemail) {
    res.status(400).json({
      status: false,
      message: "User has already registered. Please try again.",
    });
  }

  const user = new User(req.body);
  await user.save();
  res.status(200).json({
    status: true,
    data: user,
    message: "User successfully created",
  });
};

export const updateUserByAdmin = async (req, res) => {
  const userId = req.params.userid;
  //console.log(userId);return;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({
      status: false,
      message: "No valid user found.",
    });
  }
  if (userId === req.user.id) {
    res.status(400).json({
      status: false,
      message: "Own user can not be deleted.",
    });
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  if (!name) {
    res.status(400).json({
      status: false,
      message: "No user found.",
    });
  }
  if (email !== undefined) {
    const userByemail = await User.findOne({ email });
    if (userByemail) {
      res.status(400).json({
        status: false,
        message: "User has already registered. Please try again.",
      });
    }
  }

  if (role !== undefined) {
    if (!["user", "publisher"].includes(role)) {
      res.status(400).json({
        status: false,
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

  res.status(200).json({
    status: true,
    data: updateuser,
    message: "User successfully updated",
  });
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    const userId = req.params.userid;
    //console.log(userId);return;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        status: false,
        message: "No valid user found.",
      });
    }
    //console.log(userId, req.user.id);
    if (userId === req.user.id) {
      res.status(400).json({
        status: false,
        message: "Own user can not be deleted.",
      });
    }
    const user = await User.findOne({ _id: userId }).select("name email role");

    //console.log(user);
    if (user && user.role !== "admin") {
      await User.deleteOne({ _id: userId });
      res.status(200).json({
        status: true,
        message: "User deleted successfully.",
      });
    } else {
      res.status(400).json({
        status: false,
        message: "No user found.",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
