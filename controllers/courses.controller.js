import CourseModel from '../models/courses.model.js';
import BootcampModel from '../models/bootcamps.model.js';

import mongoose from 'mongoose';
export const getCourses = async (req, res) => {
    try {  

            /* const { bootcamp } = req.query;
            //console.log(bootcamp)
            //console.log(Object.values(bootcamp)[0])
            const bootcampid = Object.values(bootcamp)[0];
            if (!mongoose.Types.ObjectId.isValid(bootcampid)) {
                res.status(400).json({
                status: false,
                message: "No valid bootcamp found.",
                });
            }
            const bootcampData = await BootcampModel.findOne({ _id: bootcampid });
            if(bootcamp){ */
                res.status(200).json(res.filteredResults);
            /* }else{
                res.status(404).json({
                    status: false,
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
                res.status(200).json({
                    status: true,
                    data: courses,
                    message: 'Courses get successfully.'
                })
            }else{
                res.status(404).json({
                    status: false,
                    message: 'Courses not found',
                })
            }
        } else {
            res.status(404).json({
                status: false,
                message: 'Bootcamp not found',
            })
        } */
        
    } catch (error) {
        res.status(404).json({
            status: false,
            message: error.message,
        })
    }
}
export const addCourse = async (req, res) => {
    try{
        const { bootcampid } = req.body;
        //console.log(bootcampid);
        if (!mongoose.Types.ObjectId.isValid(bootcampid)) {
            res.status(400).json({
              status: false,
              message: "No bootcamp found",
            });
          }
        //const bootcamp = await BootcampModel.findOne({_id: bootcampid});
        const bootcamp = await BootcampModel.findOne({ _id: bootcampid });
        //console.log(bootcamp);
        if(bootcamp){
            console.log(req.body, req.user);
            const data = req.body;
            //data.photo = uploadFile.secure_url;
            data.user = req.user.id;
            data.bootcamp = bootcampid;
            //res.send(data);

            //const bootcamp = await BootcampModel.create(data);
            const course = await new CourseModel(data);
            await course.save();
            if(course){
                res.status(200).json({
                    status: true,
                    message: 'Course created successfully.',
                    data: bootcamp
                })
            } else {
                res.status(403).json({
                    status: false,
                    message: 'Unable to create Course.',
                })
            }

        } else {
            res.status(404).json({
                status: false,
                message: 'No bootcamp found',
            })
        }        

    }catch(error){
        res.status(404).json({
            status: false,
            message: error.message,
        })
    }
}

export const updateCourse = async (req, res) => {
    try {
        const {id } = req.params;

        const {isImageUPdated} = req.body;

        const courseData = await CourseModel.findById(id);
        const data = req.body;
        if(!courseData){
            return res.status(400).json({
                status:false,
                message: 'No course found.'
            })
        }

        if(req.user.id === courseData.user.toString()){

        }else{
            return res.status(401).json({
                status:false,
                message: 'You are not authorized to access this resource.'
            })
        }        

        const updatedCourse = await CourseModel.findOneAndUpdate({_id:id}, {$set: data}, {new:true});
        if(updatedCourse){
            return res.status(200).json({
                status: true,
                data: updatedCourse,
                message: 'Course updated successfully.'
            })
        }
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

export const deleteCourse = async (req, res) => {
    try {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                status: false,
                message: 'No course founds.'
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
                    status: true,
                    data: bootcamp,
                    message: 'Course deleted successfully.'
                })
            } else {
                return res.status(401).json({
                    status: false,
                    message: 'No authorize user to delete this review.'
                })
            }

        } else {
            return res.status(400).json({
                status: false,
                message: 'No course found.'
            })
        }

    } catch (error) {
        return res.status(400).json({
                status: false,
                message: error.message
            })
    }
    
}