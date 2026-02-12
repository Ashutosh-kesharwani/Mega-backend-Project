// import mongoose,{Schema} from 'mongoose'
// import jwt from 'jsonwebtoken'
// import bcrypt from 'bcrypt'


// const userSchema = new Schema({
//     username:{
//         type:String,
//         required:true,
//         lowercase:true,
//         unique:true,
//        /* trim:true, used for removing leading and trailing spaces . 
//         but if we want to remove middle , leading and trailing all use set attrr and pass callback into it 
//         */
//        set: (value) => value.trim().replace(/\s+/g, " "),
//         index:true, /*
//         Searching Enable On Any Field : use index:true on that field
//         Reason:
//         So mostly in mongoDb kisi bhi field i.e cols ko kisi bhi model me if searchable banana hai bhut hi opimized tareeke se to uska index:true kardo jisse ye internally database ki searching me aane lag jaye .
//         Note : here it is good to use index field but not for large number of field i.e cols as it willl reduce the performace very much in that case jaise username me kar diya, to email me nhi as yha email based seacrhing kar payenge .
//         */

    
//     },
//     email:{
//         type:String,
//         required:true,
//         lowercase:true,
//         unique:true,
//         set: (value) => value.trim().replace(/\s+/g, " "),

//     },
//     fullName:{
//         type:String,
//         required:true,
//         set: (value) => value.trim().replace(/\s+/g, " "),
//         index:true,
//     },
//     avatar:{
//         type:String,/* Cloudinary url : use 
//          here we are going to just send url [from third party not going to store the whole image of profile-pic]
//         this way for all images, videos, file we are going to use this approach
//         */
//        required:true,

//     },
//     coverImage:{
//         type:String, // cloudinary url

//     },
//     password:{
//         type:String,
//         required:[true,'Password is required'],// as here we can write validation i,e if user  not enter password at all than this message is going to get show .
//         unique:true,
//     },
//     refreshToken:{
//         type:String,
//     },
//     watchHistory:[
//         {
//         type: Schema.Types.ObjectId,
//         ref:"Video",
//     }
//     ], // Array of object [as user dher saari video dhekegi to unn sabko store ke liye ]


// },{timestamps:true})


// /*
// async await : note jha jha pe aisa func bna rahe ho jha pe smay lage computation me to uske func ko asynchronous bnane ke liye use async keyowrd and jis line me smay lage like api me fetch , yha pe password hash me , compare me wha usske aage awaut lga do .
// */


// NOTE !!! :   kbhi bhi async ke saath next mat use karo imp , iske saath no use 

/*
🎯 Official Interview Language (English)

When a middleware function is declared as async, it implicitly returns a Promise.

Mongoose (and Express-like systems) automatically waits for that promise to resolve or reject to determine when the middleware has completed execution.

Therefore, calling next() is unnecessary.

If both async and next() are used together, the framework receives two completion signals, which leads to ambiguity and runtime errors such as:

TypeError: next is not a function

🎯 Why modern code prefers async?

Because:

✔ cleaner
✔ readable
✔ automatic error handling
✔ no manual callback control
*/
// userSchema.pre('save', async function (){
//     //reason for using this as here we have used pre method so if user hamara koi dusri value ko update karne aaya   to fir bhi ye passwordk bcrypt kar dega jisse dikkat hogi ham chahate hai i.e new password , bane ya update ho purran atbhi modifcation chale so uske liye hame this me isModiffied name ka milta hai hamne uspe neg chla diya ki agr password me modify nhi hua i.e whi purana wla hai to return karjao and as middleware hai to next pass karna padega .
//     if(!this.isModified("password")) return 
    
//     // if modification the =n bcrypt karo

//     // ab ye bcrypt me hame hash method milta hai  jisme ham passswpopd ya value dete hai jisse hash me convert karna hai and kitne round tak to yha def 10 .
//     // so here ye behind the scene bhut kaam karta hai to as db me hmara password encrypted form me save ho gya hai , to usse chekc ya use ke liye ham use kuch methods 

//     this.password = await bcrypt.hash(this.password,10)

//     // fir next call kar diya 
//     
// })

// /*
// Uske  liye we use and design custom methods , as abb jab bhi ham USer model lenge to uske schema me dhek ke ye check kar sakte hai ki hmara passwod shi bheja hai ki nhi .user ne 

// For designing custom methods :  in mongoose 
// we get methods keyword use that 


// */

// userSchema.methods.isPasswordCorrect= async function (password) {
//     // bcrypt lib password hash karne ke saath saath check me bhi use aati hai .
//  // so here this compare method want two value first [ password jo use ne bheja plain string me and dusri jo encrypted value jiska acess hame this se miljayga schema ke as abb encrypted value save hui hai to vo mil jaygi ]
//  // this compare method return boolean value true and false if shi to true else false .

//  // as yha pe bhi computation power me samay lagega to yha bhi await lga do
//    return await bcrypt.compare(password,this.password)
// }

// // yha async ki jarurat utnin nhi hai as ye bhut fats mostly ho hi jata hai m but us kar sakte ho 

// // both are jwt token
// userSchema.methods.generateAccessToken = function(){   // at end ye method direct return karta hai value so uss generated token ko direct return kardo .
//     return jwt.sign(
//         { // payload i.e jo data bhej rahe hai 
//         // here jo key me name hai _id : vo hmaere payload ki key hau and this wla jha pe bhi use wha iss case me vo database se aane vali value rahega .
//         _id:this._id,
//         email:this.email,
//         username:this.username,
//         fullName:this.fullName,
//     },
//     // ye token acess ya koi aur yha acess token generate so vo key daalo private wali 
//     process.env.ACCESS_TOKEN_SECRET,
//     // expires time so ye obj ke form me jata hai and iss trahj se expiresIn key ka use hota hain .
//     {
//         expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//     },
// )
// }
// userSchema.methods.generateRefreshToken = function(){  

//     // here mostly diff b/w acess and referesh is that referesh me pnly generally id payload hi pass karte hai not whole info where as acess me ham jada cheeze dete hai.
//      return jwt.sign({
//         _id:this._id,
//      },
//      process.env.REFRESH_TOKEN_SECRET,
//      {
//        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
//      }
    
//     )
// }

// export const User = mongoose.model("User",userSchema)
import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)