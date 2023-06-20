import BootcampModel from '../models/bootcamps.model.js';
import cloudinary from '../config/cloudinary.conig.js';
import mongoose from 'mongoose';

export const getBootcamp = async(req, res) => {
    try {
        //advanced filtering
        //{key: {$gt: value}} 
        //{key: {$lt: value}}
        //{key: {$ne: value}}
        //{key: {$eq: value}}
        //{key: {$gte: value}}
        //{key: {$lte: value}}
        //{name: /bootcamp/i} (like wala ho)
        const reqQuery = {...req.query};
        //field to remove
        const removeFields = ['select', 'sort', 'limit', 'page'];
        removeFields.forEach( param => delete reqQuery[param]);
        console.log('reqQuery',reqQuery);
       
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|eq|ne|in)\b/, match => `$${match}`);
        //console.log(query);
        console.log(req.query, queryStr);
        let query;
        query = JSON.parse(queryStr);
        console.log(query);return;
        let appendFilterQuery = BootcampModel.find(query);

        if(req.query.select){
            const fields = req.query.select.split(",").join(" ");
            //console.log('fields', fields);

            appendFilterQuery.select(fields);
        }

        if(req.query.sort){
            const fields = req.query.sort.split(",").join(" ");
            //console.log('fields', fields);

            appendFilterQuery.select(fields);
        } else {
            appendFilterQuery.select('-createdAt');
        }

        //pagination
        console.log(typeof req.query.page);
        const page = parseInt(req.query.page) || 1; //Number
        const limit = parseInt(req.query.limit) || 10; //Number
        const skipData = (page - 1) * limit;
        appendFilterQuery = appendFilterQuery.skip(skipData).limit(limit);

        const total = await appendFilterQuery.countDocuments();

        const bootcamp = await appendFilterQuery;
        if (bootcamp.length > 0){
            res.status(200).json({
                status: true,
                data: bootcamp,
                total: total,
                message: 'Bootcamp get successfully.'
            })
        }else{
            res.status(404).json({
                status: false,
                message: 'No bootcamps found',
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