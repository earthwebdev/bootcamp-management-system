import CourseModel from '../models/courses.model.js';
import BootcampModel from '../models/bootcamps.model.js';
import mongoose from 'mongoose';
export const getCourses = async (req, res) => {
    try {
        const { bootcampid } = req.params;
        //console.log(bootcampid)
        if (!mongoose.Types.ObjectId.isValid(bootcampid)) {
            res.status(400).json({
              status: false,
              message: "No valid bootcamp found.",
            });
          }
        const bootcamp = await BootcampModel.findOne({ _id: bootcampid });
        if(bootcamp){
            const courses = await CourseModel.find().sort({title: 1})
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
        }
        
    } catch (error) {
        res.status(404).json({
            status: false,
            message: error.message,
        })
    }
}
export const addCourse = async (req, res) => {
    try{
        const { bootcampid } = req.params;
        console.log(bootcampid);
        if (!mongoose.Types.ObjectId.isValid(bootcampid)) {
            res.status(400).json({
              status: false,
              message: "No valid bootcamp found.",
            });
          }
        //const bootcamp = await BootcampModel.findOne({_id: bootcampid});
        const bootcamp = await BootcampModel.findOne({ _id: bootcampid });
        console.log(bootcamp);
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
                res.status(404).json({
                    status: false,
                    message: 'Unable to create Course.',
                })
            }

        } else {
            res.status(404).json({
                status: false,
                message: 'Bootcamp not found',
            })
        }        

    }catch(error){
        res.status(404).json({
            status: false,
            message: error.message,
        })
    }
}