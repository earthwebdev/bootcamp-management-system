import BootcampModel from "../models/bootcamps.model.js";
import CourseModel from "../models/courses.model.js";
import ReviewModel from "../models/reviews.model.js";
import cloudinary from "../config/cloudinary.conig.js";
import mongoose from "mongoose";

export const getBootcamp = async (req, res) => {
  try {
    //advanced filtering
    //{key: {$gt: value}}
    //{key: {$lt: value}}
    //{key: {$ne: value}}
    //{key: {$eq: value}}
    //{key: {$gte: value}}
    //{key: {$lte: value}}
    //{name: /bootcamp/i} (like wala ho)
    return res.status(200).json(res.filteredResults);
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const addBootcamp = async (req, res) => {
  try {
    //console.log(req.body, req.user);
    //console.log(req.file);
    let uploadFile = await cloudinary.v2.uploader.upload(req.file.path);
    //console.log(uploadFile);
    const data = req.body;
    data.photo = uploadFile.secure_url;
    data.public_id = uploadFile.photo_public_id;
    data.user = req.user.id;
    //req.save(data);

    //const bootcamp = await BootcampModel.create(data);
    const bootcamp = await new BootcampModel(data);
    await bootcamp.save();
    if (bootcamp) {
      return res.status(200).json({
        success: true,
        message: "Bootcamp created successfully.",
        data: bootcamp,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Unable to create bootcamp.",
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBootcamp = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "No bootcamp founds.",
      });
    }

    const bootcamp = await BootcampModel.findOne({ _id: id });
    //console.log(bootcamp.user.toString(), req.user.id);
    if (bootcamp) {
      if (bootcamp.user.toString() === req.user.id) {
        //delete code for teh bootcamp start
        await cloudinary.v2.uploader.destroy(bootcamp.photo_public_id);
        const deletedBootcamp = await BootcampModel.findOneAndDelete({
          _id: id,
        });

        const courses = await CourseModel.find({ bootcamp: id });
        if (courses.length > 0) {
          const deletedCourses = await CourseModel.deleteMany({ bootcamp: id });
        }

        const reviews = await ReviewModel.find({ bootcamp: id });
        if (reviews.length > 0) {
          const deletedReviews = await ReviewModel.deleteMany({ bootcamp: id });
        }

        //delete code for the bootcamp end
        return res.status(200).json({
          success: true,
          data: bootcamp,
          message: "Bootcamp deleted successfully.",
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "No authorize user to delete this bootcamp.",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "No bootcamp founds.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBootcamp = async (req, res) => {
  try {
    const { id } = req.params;

    const { isImageUPdated } = req.body;

    const bootcamp = await BootcampModel.findById(id);
    const data = req.body;
    if (!bootcamp) {
      return res.status(400).json({
        success: false,
        message: "No bootcamp found.",
      });
    }

    if (req.user.id === bootcamp.user) {
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (isImageUPdated) {
      await cloudinary.v2.uploader.destroy(bootcamp.photo_public_id);
      let uploadFile = await cloudinary.v2.uploader.upload(req.file.path);
      //console.log(uploadFile);

      data.photo = uploadFile.secure_url;
      data.photo_public_id = uploadFile.public_id;
    }

    const updatedBootcamp = await BootcampModel.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );
    if (updatedBootcamp) {
      return res.status(200).json({
        success: true,
        data: updateBootcamp,
        message: "Bootcamp updated successfully.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
