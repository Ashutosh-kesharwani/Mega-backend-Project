/*

To do so :
as when user loggedIn to uske liye hamne dekkha ki uska acessToken and refreshToken shi hai ya nhi , as uske according to ham usse allow karenge logIn me ' so uske saath ham yha pe , uss req me me body ki trah new object add kar denge req.user name  se jisme hmare user ki saari info rahegi . 

-> jisse ham jab user ko logout karna ho to uss smay hame pta chal jaye ki kisko logout karna hai .
*/


import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import {User} from '../models/user.models.js'

// yha pe jab hamara res ka koi use nhi to usss  case me production level me kya hota hai iski jgah ham _ lga dete hai asyncHandler(async (req,res[yha pe],next) -> asyncHandler(async (req,_,next)
export const verifyJWT = asyncHandler(async (req,_,next) => {
    
    /* 
    1) to get token ka acess use cookie as abhi hamne cookie send ki this user login me , so usko acess ke liye use .cookies jisse saari mil jaye and jab mil jaye to .acessToken jab ye wali chahiye 
    2) ho skta hai cookies ke pass ye acessToken ko acess ka allow ho ya na , as hamne mobile application bna rahe hai to usme nhi rahega wha ham jadatar headers ke through bhejte hai token kuch iss trah 
    3)Authorization : Bearer <token> so iss case ki wjah se ? lgaya hai and || karke if mobile se header. yha mobile header se Authorization key se jo value mili usme replace kardo Bearer token ko and usse "" empty str se relaxe jisse hame token mil gya and pc me hamare direct cookie se .
     */
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if (!token) {
            throw new ApiError(401,"Unauthorized request");
        }
        // now hamne token me acess various cheeze di thi like id , name , email etc . so usse verify krna padega shi hai ki nhui and hame ye decode value bhi de dega , uske loye use .verify method jisme token do jisse verify and usska secret key , jikse pass ye hoga whi karpayega , now verify pe hame decoded value mil jaygi.
         /*
    iss method ka use karne ka karan ye hai ki as hmaraa token jo user ke pass phuchta hai wo encoded form me rhta hai to usse hmare db [jha actual token hai] usse verify ke liye phle decode that user incoming token , uske liye ye method 

    so ye verify method kya karta hai ki user ke dwara diye gaye token ko leke decode karta hai , bhle hi token shi ho ya na , bas decode karta hai jisse ham usse veriofy kar sake aage jake 
    */
        const decodedTokenInfo= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user=await User.findById(decodedTokenInfo?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }
    
        req.user= user;
        // return user; // response hi send kardo as async automatically promise return karta hi hai and jha async wha no next use. yha nhi htaya as ye next hmara middleware route me wrna dikkar dega.
        next();
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token")
    }

})