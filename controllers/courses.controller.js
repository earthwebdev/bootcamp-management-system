import CourseModel from '../models/courses.model.js';
import BootcampModel from '../models/bootcamps.model.js';
import ReviewModel from '../models/reviews.model.js';

import mongoose from 'mongoose';
export const getCourses = async (req, res) => {
    try {  

            /* const { bootcamp } = req.query;
            //console.log(bootcamp)
            //console.log(Object.values(bootcamp)[0])
            const bootcampid = Object.values(bootcamp)[0];
            if (!mongoose.Types.ObjectId.isValid(bootcampid)) {
                return res.status(400).json({
                success: false,
                message: "No valid bootcamp found.",
                });
            }
            const bootcampData = await BootcampModel.findOne({ _id: bootcampid });
            if(bootcamp){ */
                return res.status(200).json(res.filteredResults);
            /* }else{
                return res.status(404).json({
                    success: false,
                    message: 'No bootcamp found',
                })
            } */

        
        
            /* const courses = await CourseModel.find().sort({title: 1})
                                .populate(
                                    { path: 'bootcamp' },
                                )
                                .populate(
                                    {
                                        path: 'user',
                                         select: 'name email role'
                                    }
                                )
                                ;
            if (courses.length > 0){
                return res.status(200).json({
                    success: true,
                    data: courses,
                    message: 'Courses get successfully.'
                })
            }else{
                return res.status(404).json({
                    success: false,
                    message: 'Courses not found',
                })
            }
        } else {
            return res.status(404).json({
                success: false,
                message: 'Bootcamp not found',
            })
        } */
        
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        })
    }
}

export const getCoursesById = async (req, res) => {
    try {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: 'The course was not found',
            })
        }

        const course = await CourseModel.findOne({_id:id});
        if(course){
            return res.status(200).json({
                success: true,
                data: course,
                message: 'Course details successfully.',
            })

        } else {
            return res.status(400).json({
                success: false,
                message: 'The course was not found',
            })
        }
    } catch (error) {
        
    }
}
export const addCourse = async (req, res) => {
    try{
        const { bootcamp } = req.body;
        //console.log(bootcampid);
        if (!mongoose.Types.ObjectId.isValid(bootcamp)) {
            return res.status(400).json({
              success: false,
              message: "No bootcamp found",
            });
          }
        //const bootcamp = await BootcampModel.findOne({_id: bootcampid});
        const bootcampData = await BootcampModel.findOne({ _id: bootcamp });
        //console.log(bootcamp);
        if(bootcampData){
            console.log(req.body, req.user);
            const data = req.body;
            //data.photo = uploadFile.secure_url;
            data.user = req.user.id;
            data.bootcamp = bootcamp;
            //return res.send(data);

            //const bootcamp = await BootcampModel.create(data);
            const course = await new CourseModel(data);
            await course.save();
            if(course){
                return res.status(200).json({
                    success: true,
                    message: 'Course created successfully.',
                    data: bootcamp
                })
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Unable to create Course.',
                })
            }

        } else {
            return res.status(404).json({
                success: false,
                message: 'No bootcamp found',
            })
        }        

    }catch(error){
        return res.status(404).json({
            success: false,
            message: error.message,
        })
    }
}

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const {isImageUPdated} = req.body;

        const courseData = await CourseModel.findById(id);
        const data = req.body;
        if(!courseData){
            return res.status(400).json({
                success:false,
                message: 'No course found.'
            })
        }

        if(req.user.id === courseData.user.toString()){

        }else{
            return res.status(401).json({
                success:false,
                message: 'You are not authorized to access this resource.'
            })
        }        

        const updatedCourse = await CourseModel.findOneAndUpdate({_id:id}, {$set: data}, {new:true});
        if(updatedCourse){
            return res.status(200).json({
                success: true,
                data: updatedCourse,
                message: 'Course updated successfully.'
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteCourse = async (req, res) => {
    try {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: 'No course found.'
            })
        }

        const courseData = await CourseModel.findOne({_id:id});
        //console.log(courseData.user.toString() , req.user.id);
        if(courseData){
            if(courseData.user.toString() === req.user.id){
                //delete code for teh bootcamp start                
                const deleteCourseData = await CourseModel.findOneAndDelete({_id:id});

                const reviews = await ReviewModel.find({course:id});
                if(reviews.length > 0){
                    const deletedReviews = await ReviewModel.deleteMany({course:id});
                }
                
                //delete code for the bootcamp end
                return res.status(200).json({
                    success: true,
                    data: bootcamp,
                    message: 'Course deleted successfully.'
                })
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'No authorize user to delete this course.'
                })
            }

        } else {
            return res.status(400).json({
                success: false,
                message: 'No course found.'
            })
        }

    } catch (error) {
        return res.status(400).json({
                success: false,
                message: error.message
            })
    }
    
}