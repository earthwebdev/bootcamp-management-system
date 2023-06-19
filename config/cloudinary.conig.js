import 'dotenv/config';
import cloudinary from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_ClOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
    secure: true
  });
  

/* cloudinary.v2.config = ( {
    cloud_name:process.env.CLOUDINARY_ClOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
}); */

export default cloudinary