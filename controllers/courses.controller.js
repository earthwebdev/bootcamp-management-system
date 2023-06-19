import courseModel from '../models/courses.model.js';
import BootcampModel from '../models/courses.model.js';
export const getCourses = async (req, res) => {
    try {
        const { bootcampId } = req.params;
        const bootcamp = BootcampModel.findOne({_id: bootcampId});
        if(bootcamp){
            const courses = await courseModel.find().sort({name: 1});
            if (courses.length > 0){
                res.status(200).json({
                    status: true,
                    data: bootcamp,
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
        const { bootcampId } = req.params;
        const bootcamp = BootcampModel.findOne({_id: bootcampId});
        if(bootcamp){
            console.log(req.body, req.user);
            const data = req.body;
            //data.photo = uploadFile.secure_url;
            data.user = req.user.id;
            data.bootcamp = bootcampId;
            //req.save(data);

            //const bootcamp = await BootcampModel.create(data);
            const bootcamp = await new BootcampModel(data);
            await bootcamp.save();
            if(bootcamp){
                res.status(200).json({
                    status: true,
                    message: 'Bootcamp created successfully.',
                    data: bootcamp
                })
            } else {
                res.status(404).json({
                    status: false,
                    message: 'Unable to create bootcamp.',
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