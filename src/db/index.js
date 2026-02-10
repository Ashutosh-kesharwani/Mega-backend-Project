import mongoose from 'mongoose';
import {DB_NAME} from '../constants.js';

import 'dotenv/config'
/* 

ye itna common hai db connection as yhi work ham diff diff controller me karenge so usse acha ham direct ek utils me func bna le and jha jha use is utils ko direct call kar de.
const connectDB= async () =>{
   try{
    const connectionInstance =    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
   // for debugging that hamara code chal rha hai ya nhi . and also that where we connect our Db on which host .
    console.log(`\n MongoDB connected !! DB Host : ${connectionInstance.connection.host}`);
     
   }catch(error){
    console.log(`MONGODB connection FAILED : ${error}`);
    // throw error; here alternative below .
    process.exit(1);
    
   }
} */


export default connectDB;
