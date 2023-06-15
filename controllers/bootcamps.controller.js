import Bootcamp from '../models/bootcamps.model.js'
export const getBootcamp = (req, res) => {
    try {
        const bootcamp = Bootcamp.find().sort({name: 1});
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