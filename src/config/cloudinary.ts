import { config } from './config';
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({ 
    cloud_name: config.cloud, 
    api_key:config.cloudkey, 
    api_secret:config.cloudsecret
});

   

export default cloudinary;