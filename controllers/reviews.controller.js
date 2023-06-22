import mongoose from "mongoose";
import ReviewModel from  '../models/reviews.model.js';

export const getReviews = async (req, res) => {
    try {
        res.status(200).json(res.filteredResults);
        
    } catch (error) {
        res.status(400).json({
            status:false,
            message: error.message,
        })
    }
}

export const createReview = async (req, res) => {
    try {
        const {bootcamp, course} =  req.body;
        req.body.user = req.user.id;
        if(!bootcamp && !course){
            res.status(400).json({
                status:false,
                message: 'Either Bootcamp or course is required.',
            }) 
        }        
        if(course){
            if(!mongoose.Types.ObjectId.isValid(course) ){
                return res.status(400).json({
                    status:false,
                    message: 'Course not found.',
                })
            }
            const crse = await CourseModel.findOne({_id:course});
            if(crse){
                const review = postReview(req.body);
                if(review){
                    return res.status(200).json({
                        status:true,
                        data: review,
                        message: 'Review added successfully for course.'
                    })

                }else{
                    return res.status(400).json({
                        status:false,
                        message: 'Courses not found.',
                    })
                }
            } else {
                return res.status(400).json({
                    status:false,
                    message: 'Courses not found.',
                }) 
            }
        }


        if(bootcamp){
            if(!mongoose.Types.ObjectId.isValid(bootcamp) ){
                return res.status(400).json({
                    status:false,
                    message: 'Course not found.',
                })
            }
            const bcamp = await BootcampModel.findOne({_id:bootcamp});
            if(bcamp){
                const review = postReview(req.body);
                if(review){
                   return res.status(200).json({
                        status:true,
                        data: review,
                        message: 'Review added successfully for bootcamp.'
                    })

                }else{
                    return res.status(400).json({
                        status:false,
                        message: 'Bootcamp not found.',
                    })
                }
            } else {
                res.status(400).json({
                    status:false,
                    message: 'Bootcamp not found.',
                }) 
            }
        }        
        
    } catch (error) {
        res.status(400).json({
            status:false,
            message: error.message,
        })
    }
}

const postReview = async (data) => {
    const reviewData = new ReviewModel(data);
    await reviewData.save();
    return reviewData;
}

export const updateReview = async (req, res) => {
    try {
        const {id} =  req.params;
        
        if(!mongoose.Types.ObjectId.isValid(id) ){
            res.status(400).json({
                status:false,
                message: 'No valid id.',
            })
        }

        const reviewData = await ReviewModel.findOne({_id: id});
        if(!reviewData){        
            res.status(400).json({
                status:false,
                message: 'No review found.',
            })
        }

        if(reviewData.user.toString() === req.user.id){
        }else{
            return res.status(401).json({
                status:false,
                message: 'You are not authorized to access this resource.'
            })
        }

        const {bootcamp, course} =  req.body;
        if(bootcamp && course){
            res.status(400).json({
                status:false,
                message: 'Bootcamp / course not valid.',
            })
        } else {
            if(mongoose.Types.ObjectId.isValid(bootcamp) || mongoose.Types.ObjectId.isValid(course) ){

            }else{
                res.status(400).json({
                    status:false,
                    message: 'Bootcamp / course nnot valid.',
                })
            }
        }


        const data = req.body;
        data.user = req.user.id;
        
        const updateData = await   ReviewModel.findOneAndUpdate({_id: id}, {$set: data},{new: true});
        res.status(200).json({
            status:true,
            data: updateData,
            message: 'Review updated successfully.',
        });
        
    } catch (error) {
        res.status(400).json({
            status:false,
            message: error.message,
        })
    }
}

export const deleteReview = async (req, res) => {
    try {
        const {id} =  req.params;
        
        if(!mongoose.Types.ObjectId.isValid(id) ){
            res.status(400).json({
                status:false,
                message: 'No valid id.',
            })
        }

        const reviewData = await ReviewModel.findOne({_id: id});
        if(!reviewData){        
            res.status(400).json({
                status:false,
                message: 'No review found.',
            })
        }

        if(reviewData.user.toString() === req.user.id){
        }else{
            return res.status(401).json({
                status:false,
                message: 'You are not authorized to access this resource.'
            })
        }
        
        const deleteData = await   ReviewModel.findOneAndDelete({_id: id});
        res.status(200).json({
            status:true,            
            message: 'Review deleted successfully.',
        });
    } catch (error) {
        res.status(400).json({
            status:false,
            message: error.message,
        })
    }
}