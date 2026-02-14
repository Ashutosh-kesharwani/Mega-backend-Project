import {asyncHandler} from '../utils/asyncHandler.js'
import  {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import {uploadFileOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'

import jwt from 'jsonwebtoken';



/*

// ye ek hamare helper fun bnaya tha jha ye khta hai ki hjo req , aaye usse handke karne liye as bhut jgah req aaygi so uska ek wrapper bna diya and yhi usse ham promise ke through handle kar le rahe hai , jisse har req ke lite new promise and try catch na bnana pade async-await me .

// acts as warpper for all req bas jisse hame promise and try cathc sab ke liye na likhna pade


// this is a method , action that we create which register our user

const registerUser = asyncHandler(async (req,res) => {
    // hame sirf yha pe res diya ki hamara status code 200 lelo i.e Ok user register ho gya and json me ek message send kar diye :ok
    res.status(200).json({
        message:"ok work fine"
    })
}) 
    

// at last named export all actions built in controller 


export all the actions generated in this controller , and iss trah named export karlo
export {
    registerUser,
} 


/*
BUILDING FULL FLEDGED CONTROLLER

Steps follow for register user :

1)Get user detail from frontend  [yha hamne koi frontend nhi use kar rahe form waigaira so yha pe ham api postman ke through jo hame userSchema banaya hai uske according ham le rahe hai user details ko register wali uske liye userSchema dekho]

1.5) File Handling use here multer as middleware 

2) Validation lgao i.e saare validation fulfill or not jo schema time diya tha .[ye validation even though frontend me lagte hai but backend me use karna bhi achi practice , sp if frontend se kisi wjah se miss ho gaye to backend se na ho .
atleast 1 validation -> empty to nhi hai 
]

3) check if user is already exist or not . [tareeka as email se sabse easy but username se check karna hai to usse bhi kar sakte hai , in instagram me . username se ] yha dono se 

4) check for images ,check if avatar hai ki nhi 

5) upload them to cloudinary [as if images shi se li hai ], yha ek baar aur dekh lo ki avatar diya hai ya nhi .
-> as yha do check , multer me bhi check kiya [yha avatar wali image daali ki nhi ], and cloudinary me bhi check lga diya , ki wha shi avatar wai aayi ki nhi images 


----

Now upto this point we get all the info needed from register se , so abb hame yha pe user object bnanana padega , jisse mongoDb me store ke time isse object ko store kar sake 
[As mongoDb hmara noSql db hai to yha pe jadatar time values hamari object ke form me hi store hoti hai ]

6)create user object -> & create entry in db. [dbcall se usko db me daalo]
-> yha hota kya hai ki as it it jo object create hua hai vo hame mil jata hai , so usme se hame frontend me api ke trhorugh bhjene se phle password and refresh token hta do

7) remove password and refresh token field

7.5) check user create hua ki nhi successfully , as res aaya ya nhi , null to nhi aaya . and all

8) Send response updated to frontend [return response if nhi hua to error bhej do]


----------------------------------------------------------------------------------------------------
*/

/*
EXECUTING THE STEP BY STEP FOR ABOVE ALGORITHM: 

1)Get user detail from frontend , iske liye use 
req.body -=> so if req hamare form ya json form me aayi hai to uski value yha se mil jaygi ,
but if url se 
req.url() -> use this 

params bhi tareeka hai frontend se data bhejne ke liye . as react me jaise 

use here req.body() and usme se jo value chahiye usser destructure karlo , as req data bhi hmaara json form me hi aata hai


as currently hamare pass frontend nhi hai to uska data bhejne ke liye we are going to use postman , so yha pe tab me se ham params , body , diff diff type data bhej sakte hai .

-> yha ham use body -> jsime raw -> json use kar sakte hai .
-> forn data bhi use karenge baad me 

so open postman - desktop .

and body->raw->json 
me iss trah data dedo 
{
    "fullName" : "Ashutosh Kesharwani",
    "username" : "ashu07",
    "email" : "ashu@gmail.com",
    "password" : 1234
    }
and click send , so hame

    const {fullName, username, email , password} = req.body

    console.table([fullName, username, email , password]);
    
    iske through show hone lga debu se 

    but ye close nhi hoga as hamne yha koi res nhi bheja
and last

iss trah se response send 
return res.send(`<h1>${email} hai meri `);
abb post me res show hoga wo chlta nhi rahega ,

-----------------------------------------------------


1.5) As yha pe hamne file handling ka kuch nhi bnaya so uske liye hamne multer.middleware.js file bnayi thi

so uske liye phle hamne jo multer me upload name ka method bnaya usko import in route as whi se saari cheeze run , action , middleware 

as middleware ka matlab hai ki jane se pehle mujhse mil ke jana so yha route me hamare registerUser action se phle  middleware lga do bas 


so route me  , so yha pe upload method multer ka bhut se option deta hai as if single file karni hai sirf upload to simple .single lga do 
2) multiple file ke liye ham Array bhi nhi lga sakte as array hamara ek hi fields me mul file leta hai .

3) so as here we need array fields diff diff col me chahiye diff diff file so

Use 
#  upload.fields() use :
>Array of Field objects describing multipart form fields to process.
>Returns middleware that processes multiple files associated with the given form fields.
>The Request object will be populated with a files object which maps each field name to an array of the associated file information objects.

@throws — MulterError('LIMIT_UNEXPECTED_FILE') if more than maxCount files are associated with fieldName for any field

router.route("/register").post(
    upload.fields()
    registerUser
)

> so yha ye multer ka .fields hamara ek array accept karta hai jha pe hame array of field dena rhta hai given form me, 

so yha mul field ke value ke liye sbka indivudal obj do

router.route("/register").post(
    // middleware
    upload.fields(
        [
            {
                name: "avatar",
                maxCount:1,
            },
            {
                name:"coverImage",
                maxCount:1,
            }
        ]
    ),
    // so middleware ke baad sirf action iss trah bhej diya 
    registerUser
)
    iss trah se dete hai and abb ham images , ya file ko upload kar payenge .

    > so yha ye hoga ki phle jab user reigter wale url me jayga to phle multer chal jayga middleware ke through and jab userr saara deta bhejte , req karega registerAction ko to vo saari cheeze kega and res bhejega

-----------------------------------------------------

2) Valdation Checking

a) individual check one by one
if (fullName === "") {
    // yha hamne jo utils me apiError class bnayi thi uska use kiya and ye statuscode and msg de diya .
    throw new ApiError(400,"Full Name is Required")
   }

----

better industry sbka ek saath 
b) 

// 2. step validation 
if(
       [fullName, username, email , password].some((field) => field?.trim() === "")
       /* // TRUE  → if at least ONE element satisfies condition
FALSE → if NONE satisfy 
so here hamne cond lgayi hai ki kya ek bhi field empty hai yha pe , as yha if ek bh field me value empty str hai to ye ye if block chal jayga as ye some method true return karega , and if sabme value hai i.e koi bhi empty nmhi hai to ye false dega some abd ye if block nhin chalega and no error get thorw here 


    ){
        throw new ApiError(400,"All fields are empty")
    }

--------------------------------------------------------------
// 3. check if user already exist or not [both by email and username ]
-> for this hame  User model import ki jarurate as , user model me hi hmare user ka sara data hoga as isi se ham hamare db se connect rahte hai

    // ye findOne me hame jo bhi bhi phli value db me iss field jo denge usse milegi vo return kardega

    // as yha hame dono se check karna hai username and email se tom use $or iska use karlo || so yha pe if hame email , ya username se koi bhi vaklue hamre user db me mile to uss row ko return kardega ye so vo true hoga if not to null dega 
   const isExistedUser= User.findOne({
        $or: [{ email },{ username }]
    })

    // if user phle se exist 
    if(isExistedUser){
        throw new ApiError(409,"User with email or username already exists")
    }
--------------------------------------------------------------
//4. check for images ,check if avatar hai ki nhi
   // as abhi tak hamare me req.body hame saara data deta hai field ka , but as hamne middleware ke through multer use kar liya hai to yaha pe multer hmare req me files ke liye acess bhi proviude kara ddeta hai , req.files ka 

    // req.files?.avatar iss trah optionally chain karna shi hai as ho skta hai acess ho ya nhi
    //? means optionally , mile ya ho skta hai nhi mile so mile to lo otherwuse nhi error mat do 
    // uska ref store kra liya kyuki abhi vo yha local me hai , cloudinary poe nhi
    //
    const avatarImgLocalPath = req.files?.avatar[0]?.path ;
    const coverImgLocalPath = req.files?.coverImage[0]?.path;
    
    // as ye local ho sakta hai ho ya nhi but hame avatar wali to chahiye
    
    if (!avatarImgLocalPath) {
        throw new ApiError(400,"Avatar file is Required")
    }
------------------------------------------------------------------------------

// 5.upload them to cloudinary
   // as isme smay to lagega hi so await lagaya and issi liye upra hamne asyncHandler ka use kiya tha aysnc ke liye
   // compulsory hai ye jab taj na ho aage mat badho
   const avatarImgCloudPath= await uploadFileOnCloudinary(avatarImgLocalPath) ;
   const  coverImgCloudPath= await uploadFileOnCloudinary(coverImgLocalPath) ;


   // 5.5 check avatar cloudinary me gya ki nhi as ye required feld hai if nhi bheja to db phatega and error dega hi 
    if (!avatarImgCloudPath) {
        throw new ApiError(400,"Avatar file is Required Not Uploaded in Cloudinary ")
    }
------------------------------------------------------------------------------

    // 6. To create a user object
    // uske liye use create method model ka 
    User.create({
        fullName,
        avatar: avatarImgCloudPath.url,
        // as ye check nhi kiya rahe ya nhi doni jgah so optiomally dekho
        coverImage:coverImgCloudPath?.url || "",
        email,
        password,
        // ye lowercase me convert kar dega as if nhi to error as db me hamne lowercase required kiya hai
        username:username.toLowerCase(),
    })
------------------------------------------------------------------------------
   
    // 7) remove password and refresh token field
    // before , yha pe phle ye karo ki if user successfully create hua hai ya nhi so as we know mongoDb hame id ka bna ke dega uske liye automatically so iss id ke through hame uss ki sari field le lege , select ke through and usmem se jo jo field htani hai ussse "" str ke form me -password karke space dege likhte jao and isse abb jo new mile userData usko store kara lo
    const createdUserData=  await User.findById(userData._id).select(
        "-password -refreshToken"
    );
  

 

------------------------------------------------------------------------------

 // 7.5) check user create hua ki nhi successfully , as res aaya ya nhi , null to nhi aaya . and all

    if(!createdUserData){
        throw new ApiError(500,"Something went wrong while registering User !")
    }

------------------------------------------------------------------------------

   // 8) Send response updated to frontend 
    //[uske liye we are going to use ApiResponse] use karenge utils ka . uss class ka 

    // return res.status(201).json(createdUserData) iss trah bhi kar sakte hai ,but hamne jo standard response ke liye use kiya hai usko use karenge 

    return res.status(201).json(
        new ApiResponse(200,createdUserData,
            "User registered Successfully "
        )
    )
------------------------------------------------------------------------------
    

*/


// yha normal async as isse ham internally yha pe sirf use kar rahe hai koi web req nhi handke so that why we dont use async handler || simplye ye func cal and usme uss user id ko pass kardo , bas ye uss user ko find karke acess and refresh token  generte kar dega .
const generateAccessAndRefreshTokens = async (userId) => {
    try{
        // user find karlo uss id se 
        const user  = await User.findById(userId);
        const accessToken =user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // as ham acess token and refresh token user ko to denge hi as a response but ham hmare refresh token ko db me bhi store , simple user user obj se key acess and assign generated wla

        user.refreshToken = refreshToken;

        // for saving in database as yha pe jab ham ye save method karnge to mongoDb me aur entry jo hai vo kickIn hone lagegi issliye yha ke save me {validateBeforeSave:false} ye pramas do , save se phle validation mat lgao
        await    user.save({validateBeforeSave:false})


        return {accessToken , refreshToken};

    }catch(error){
        throw new ApiError(500,"Something went wrong while generating refresh and acess token");
    }
}




// Register Controller
const registerUser= asyncHandler(async (req,res)=>{
    //1 . Take user data from frontend 
    const {fullName, username, email , password} = req.body
    
    // debug 
    // console.table([fullName, username, email , password]);
    //1.5 multer wla middleware route me 
    
    // 2. step validation 
    if(
        [fullName, username, email , password].some((field) => field?.trim() === "")
        
    ){
        throw new ApiError(400,"All fields are empty")
    }
    
    // 3. check if user already exist or not [both by email and username ]
    
    const isExistedUser=await User.findOne({
        $or: [{ email },{ username }]
    })
    
    // if user phle se exist 
    if(isExistedUser){
        throw new ApiError(409,"User with email or username already exists")
    }
    
    // --------------------
    
    //4. check for images ,check if avatar hai ki nhi
    console.log("FILES -> ", req.files);
   
    const avatarImgLocalPath = req.files?.avatar[0]?.path ;
    // const coverImgLocalPath = req.files?.coverImage[0]?.path; as ye cover image optionalyy hai do ya na do so if we try to check it with ? optionally to kyi baar error dega as avater me bhi yhi use but uska ham just neeche check kar liye so ni problem , but coverimage ka iss trah nhi 

    // coverImage set local path this type
    /*
    so here hamne phle dekha ki req me file aa rhi hai ki nhi 
    2) hamne ye dekha ki kya coverIMage hamara array hai ki nhi 
    3) as if array to agr uski length 0 nhi iska means hamne value bheji hai usme so means usme path hoga hi so abb path ki value lo uski and local path me daalo .

    This way we dont get any error .
    */
    let coverImgLocalPath ;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImgLocalPath = req.files.coverImage[0].path;
    }
        
    if (!avatarImgLocalPath) {
        throw new ApiError(400,"Avatar file is Required")
    }

    // console.log(req.files); imp for deepdive 
    

    // 5.upload them to cloudinary
 
   const avatarImgCloudPath= await uploadFileOnCloudinary(avatarImgLocalPath) ;
   const  coverImgCloudPath= await uploadFileOnCloudinary(coverImgLocalPath) ;

   // advantage of cloudinary is that if yha pe cover image nhi milta to ye error nhi dega empty str bas dega .


   // 5.5 check avatar cloudinary me gya ki nhi as 
    if (!avatarImgCloudPath) {
        throw new ApiError(400,"Avatar file is Required Not Uploaded in Cloudinary ")
    }

    // 6. To create a user object
    const userData= await User.create({
        fullName,
        avatar: avatarImgCloudPath.url,
        coverImage:coverImgCloudPath?.url || "",
        email,
        password,
        username:username.toLowerCase(),
    })
  
   
    // 7) remove password and refresh token field
    
    const createdUserData=  await User.findById(userData._id).select(
        "-password -refreshToken"
    );
   // 7.5) check user create hua ki nhi 

    if(!createdUserData){
        throw new ApiError(500,"Something went wrong while registering User !")
    }

    // console.log("CREATED USER -> ", userData);  debugging to see if all values get correct


    // 8) Send response updated to frontend 
    // but we can confirm from the response as well , 
    return res.status(201).json(
        new ApiResponse(200,createdUserData,
            "User registered Successfully "
        )
    )

   
  
});


// Login Controller
/*
LOGIN TODO STEP :
1) Take user data fron frontend [postman currently]
2) match the login email, username , password with the user present in db already
3) password check if match to theek else error ,
4) if all is correct then generate acess and refresh token. 
5) to send these token we sent it in cookies format [secure cookie ]
6) response bhej do . ki login successfully 
*/
const loginUser = asyncHandler(async (req,res)=>{
    const {email,username , password} = req.body;
    // console.log(email);
    // ye use ki user jab tak dono email and username na de tab tak aage na badho 
    if (!username && !email) {
        throw new ApiError(400,"username and  email  is required")
    }
    /* 
    you can use this logi if chahte ho ki dono me se ek bhi de user to bhi login ho jaye 
    note js me || operator ke caes me negation hmesa sbhi cond ke whole me lgta hai like below 
    like this
    if (!(username || email)) {
        throw new ApiError(400,"username or email  is required")
    } */
   // jisse chahe email / ya username dono me se koi se bhi mil jaye to wo data bhejdo
    const user = await User.findOne({
  $or: [{ username }, { email }]
});


    // if user in dono pe nhi mila to user not exist invalid hai 
    if (!user) {
        throw new ApiError(404,"User does not exist");
    }

    /*
    User se ham jo acess karenge vo hmare mongoDb ka jo mongoose ODM hai uske method ko acess ke liye use hoga like findOne , etc .

    But if hame jo hmne methods bnaye hai db me model me uske , uske liye use "user" ko .
    as ye method hmara uss user ke litye kaam karega jisse hamne mongoose ke method se query chlane ke baad liya hai .

    */
    const isPasswordValid = await user.isPasswordCorrect(password);
    
     if (!isPasswordValid) {
        throw new ApiError(401,"Invalid User Credentials");
    }

    // if user password shi hai to hamara acess and refresh token generate karao.

    /*
    As these methods can be used multiple places so isko ek utility ki trah bna lo
    */
   /// now call above mtthod to generate them

   const {accessToken , refreshToken} =await generateAccessAndRefreshTokens(user._id);


   // Now to send cookies me ye data 
   /*
   as jo yha pe user ka refe hai db me vo purana wla hai jha pe refresh token abhi empty so 
   2 options 
   1) ya to fir ek db query chla do and new user bna lo aur 

   2)ya to uss user ko update kardo

   check ki expensie rahega ko nhi db ko call karna .
    */

   const loggedInUser= await User.findById(user._id).select("-password -refreshToken");

   // Now to send cookies
   /*
   we have to configure our cokied first '
   here  httpOnly : true,
    secure:true, 
    means ki ye cookie sirf server se modifiable , frontend se nhi . to make it secure .

    now hamara frontend wla dekh to skta hai but not modify .

    so here we have acess of .cookie method as we have use installed cookie-parser pkg.
    now we can send multiple cookie simultaneously , by using .cookie().cookie() --- this way .
    here as the optiond obj that we have created , usko bhi pass and value ko key value pait me de do .

    this way : 
    return res
   .status(200)
   .cookie("accessToken" , accessToken,options)
   .cookie("refreshToken",refreshToken,options)

   */

   const options = {
    httpOnly : true,
    secure:true,
   }
   // we have send the cookie
   return res
   .status(200)
   .cookie("accessToken" , accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new ApiResponse(
        200, // statusCode
        {
            user:loggedInUser,
            accessToken,
            refreshToken
        },// yhi vo api response class me this.data hai ,
        "User logged In Successfully" // message .
    )
   )
   /* time to send json response
   now here as hamnne cookie me to send kardiya to yha res me kyu bhjena as , yha ham wo case handle karna chah rahe hai jhape , wo user khud apne local storage me accessToken , refreshToken use karna chah rha ho .
   */
});

// logOut method 
/*
As user ko logOut i.e jab vo logout pe click kare to uske user ke 
cookie clear
2) also jo refreshtoken store hai db me user ke usse  bhi clear

so here the problem is as jo ye logOut me samgh gaye kya karna hai but hmare pass user hi nhi pta usko find kaise kare , as id se bhi nnhi kar sakte kyuki usse ham acceot bhi nahi kar rahe hai , so yha pe bhi ham 
-> Use middleware concept : [as ye khta hai ki jane ke phle mujhse mil ke jana .] -> we are going to generate khud ka middleware .

here to get user we are going to user authetication middleware present in src middleware directory .


*/

const logoutUser = asyncHandler(async (req,res)=>{
    // as due to middleware we added before our this action in route to abb hamare pass req.user aa gya as hamne yhi daala tha abb acess aa gya .!!

//    console.log(req.user);
   /*
   this method work twpo things find and update as findOne se karte to phle user lo and phir usme se htao values and then , fir validate false karo ye sab . but ham yha pe ye method jisme phle bhjeo kya find karna hai and then kya set update karna hai uske liye we are going to use $set operator .
   */

   await User.findByIdAndUpdate(
        req.user._id,
        //update kya karna hai
        {
            $set: {
                refreshToken: undefined
            }
        },
        // as yha set kardo ki hame new value jo hai usse set bhi kardena so yha refreshToke hmara undefined set ho jayga logout pe .
        // new:true ye new updated milegi return me not old value
        {
            new:true
        }

      
   )

     const options={
        httpOnly:true,
        secure:true,
        }
    // now to clear cookie 
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User logged out Successfully")
    )
   
})


/*
Step :Note sab se phle kisi bhi action ko likhne se phle do logic building .

Like here , 
1) As jab hamara user kisi endPoint ko hit karega to wha se refresh token acess ke liye ham cookie se data ustha lenge . || and mobile app me token iss trah se nhi balik body se lete hau req ki 
*/
const refreshAccessToken = asyncHandler(async (req,res)=>{
    // ye frontend se aayga .
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401,"Unauthorized Request") ; // as iss liye ye msg kyuki hmara refreshtoken glat hai , 
    }

    // verify jwt iss trah ke kaam ko hame generally try catch me rakhi as maan lo koi error aa jaye to ,
   
    try {
        // jrurio nhi ki har baar payload data bhi mile , like in acess diya to vo mila . as hamne refershToken bnate waqt sirf id li this to abb decoded me hame sirf id mili hai , so uske through ham user easily find kar skte hai
        const decodedRefreshToken= jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
       const user= await User.findById(decodedRefreshToken?._id)
    
       if (!user) {
            throw new ApiError(401,"Invalid Request Token");
       }
    
       // yha hamara refreshTokne ab  yha tak phuche to vo valid hi rahega 
    
       if(incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401,"Refresh token is expired or used");
       }
    
       // as yha tak aagye abb vo match karliye so new acess token generate kardo
       const options={
        httpOnly:true,
        secure:true,
       }
      const {accessToken,newRefreshToken} =await  generateAccessAndRefreshTokens(user._id);
    

       return res
       .status(200)
       .cookie("accessToken",accessToken)
       .cookie("refreshToken",newRefreshToken)
       .json(
        new ApiResponse(
            200,
            {accessToken,refreshToken: newRefreshToken},
            "Access token refreshed Successfully"
        )
       )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
    }
})


/*
changeCurrentPassword : Action:
> this action allow us to change the password of the user.

Steps :
1) 
*/
const changeCurrentPassword = asyncHandler( async (req,res)=>{
    const {oldPassword,newPassword,confirmPassword}= req.body;

    console.table(oldPassword,newPassword,confirmPassword);
    
    if (!(newPassword === confirmPassword)) {
        throw new ApiError(401,"new Password and confirm password must match!");
    }
    const user = await User.findById(req.user?._id);

    const isPassCorrect=await user.isPasswordCorrect(oldPassword);

    if (!isPassCorrect) {
        throw new ApiError(400,"Invalid Old password ")
    }
    // yha tak aane ka matlab ki old password shi hai abb new password set karna hai 


   
    // yha tak old bhi shi hai and new bhi shi match with confirm to new password set kardo 
    user.password = newPassword;
    await user.save({validateBeforeSave:false})


    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "Password Change Successfully"

    ))
})


/*
Get Current User
*/

const getCurrentUser= asyncHandler(async (req,res)=>{
    return res
    .status(200)
    .json(200,
        req.user,
        "Current user fetched Successfully"
    );
})

/*
Updated Account User details :
1) phle middleware at route verify user allow hai ki nhi update ke liye we use middleware verifyjwt.
wrna kisi dusrev ko todhi na allow ki value change kar paye
> yha ham user ko allow karenge ki vo kya kya cheeze update kar paayga.

Note!! :file update i.e image , video , etc update ka hamesa alg controller rakho imp .
as if ussi me karenge to hmara pura user fir se update hoga db me jisse congestion badha hai , so optimized production approach is that ki ham file ko update ki liye alg hi controller likhte hai .
*/

const updateUserAccountDetails = asyncHandler(async (req,res)=>{
   // suppose yha pe fullname and email de rahe hai 
   const {fullName,email} = req.body 
   // if dono me se ek bhi nhi hai 
   if(!fullName && !email){
    throw new ApiError(400,"All field are required");
   }

   const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email, // same as email:email ES6 new syntax jab key and value both are same .
      }
    },
    {new:true}
).select("-password")
// yha hamne direct hi updatedUser me new value add ke waqt hi vo dono field hta di , ek db call bach gyi.
    return res
    .status(200)
    .json(new ApiResponse(200,
        updatedUser,
        "Account Details Updated Successfully "
    ))

})

/*
File Updated [Avatar Image]
1) phle middleware at route verify user allow hai ki nhi update ke liye we use middleware verifyjwt.
wrna kisi dusrev ko todhi na allow ki value change kar paye
*/

const  updateUserAvatar = asyncHandler(async (req,res)=>{

    // yha ek hi file likha as wha pe jha files who do cheeze set kar rahe the avatar , coverImage dono | yha pe sirf avatar change ka action isliye file likho 
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing ")
    }
    const avatarCloudPath = await uploadFileOnCloudinary(avatarLocalPath)

    if (!avatarCloudPath.url) {
        throw new ApiError(400,"Error while uploading on Avatar ")
    }

   const updatedUser= await User.findByIdAndUpdate(
        req.user?._id,
        {   // set isliye use kyuki jab sirf kuch limited value hi db me change , if all to direct user obj pass kardo
            $set:{
                avatar: avatarCloudPath.url
            }
        },
        {
            new:true
        }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedUser,
            "Avatar Image updated successfully"
        )
    )
})

/*
File Updated  [CoverImage]
1) phle middleware at route verify user allow hai ki nhi update ke liye we use middleware verifyjwt.
wrna kisi dusrev ko todhi na allow ki value change kar paye
*/

const  updateUserCoverImage = asyncHandler(async (req,res)=>{

    // yha ek hi file likha as wha pe jha files who do cheeze set kar rahe the avatar , coverImage dono | yha pe sirf avatar change ka action isliye file likho 
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400,"CoverImage file is missing ")
    }
    const coverImageCloudPath = await uploadFileOnCloudinary(coverImageLocalPath)

    if (!coverImageCloudPath.url) {
        throw new ApiError(400,"Error while uploading on CoverImage ")
    }

    const updatedUser =await User.findByIdAndUpdate(
        req.user?._id,
        {   // set isliye use kyuki jab sirf kuch limited value hi db me change , if all to direct user obj pass kardo
            $set:{
                coverImage: coverImageCloudPath.url
            }
        },
        {
            new:true
        }
    ).select("-password")


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedUser,
            "Cover Image updated successfully"
        )
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,

}



/*
UNDERSTAND DEEP DIVE :
with consolelog 
Cloudinary , ka res 
req.body 
req.files 
*/