import BootcampModel from '../models/bootcamps.model.js';
import cloudinary from '../config/cloudinary.conig.js';
import mongoose from 'mongoose';

export const getBootcamp = async(req, res) => {
    try {
        const bootcamp = await BootcampModel.find().sort({name: 1});
        if (bootcamp.length > 0){
            res.status(200).json({
                status: true,
                data: bootcamp,
                message: 'Bootcamp get successfully.'
            })
        }else{
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

export const addBootcamp = async (req, res) => {
    try{
        console.log(req.body, req.user);
        console.log(req.file);
        let uploadFile = await cloudinary.v2.uploader.upload(req.file.path);
        console.log(uploadFile);
        const data = req.body;
        data.photo = uploadFile.secure_url;
        data.user = req.user.id;
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

    }catch(error){
        res.status(404).json({
            status: false,
            message: error.message,
        })
    }
}

export const deleteBootcamp = async (req, res) => {
    try {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                status: false,
                message: 'No bootcamp founds.'
            })
        }

        const bootcamp = await BootcampModel.findOne({_id:id});
        console.log(bootcamp.user.toString() , req.user.id);
        if(bootcamp){
            if(bootcamp.user.toString() === req.user.id){
                //delete code for teh bootcamp start

                //delete code for the bootcamp end
                return res.status(400).json({
                    status: true,
                    data: bootcamp,
                    message: 'Bootcamp deleted successfully.'
                })
            } else {
                return res.status(400).json({
                    status: false,
                    message: 'No authorize user to delete this bootcamp.'
                })
            }

        } else {
            return res.status(400).json({
                status: false,
                message: 'No bootcamp founds.'
            })
        }

    } catch (error) {
        return res.status(400).json({
                status: false,
                message: error.message
            })
    }
}