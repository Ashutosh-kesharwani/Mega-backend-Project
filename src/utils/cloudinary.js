/*
File handling using third party service cloudinary : and a package multer for file upload task in backend 

mostly people ya to isse utils me rakhte as resuable func or in a service folder as a service .

Fs [File System] : When we have to manage the whole file system then we use this lib.
Here we have alos need of node.js  [inbuilt]
fs library [fs -> filesystem] : this help us in file read , write , remove all types of file handling .
as here we have to perform file handling in various steps :


So maily we need here is file path , 
two things : link and unlink path :

> File system file ko trace rkhta hai link and unlink ke through , as jab ham link karte hai to file system ko vo pta chal jata means file get added and jab ham usse unlink karte hai to vo file sytem ke liye delte hon jati hai [ abhi bhi vo server pe hi padi rahegi ]

----------------------------------------

To configure our cludinary  :
go to cloudinary docs nodejs sdk : saari cheeze wha present hai .

: as ye yhi hame btaygi ki kaun sa cloudinary use kar rahe hai , env , kiska and all 

for writing cludinary setup code using .config i,e usse configure karne ke liye 
-------------------
>cloudinary credentials

>so here we can get cloudname in our direct homepage pe  , in new cloudinary ui and to change the name go to setting , and then product environment to chnage that name and display name if you want 
CLOUDINARY_CLOUD_NAME=ashutosh-sde-007
--------------------
> Api key & Api secret we get from our home tab of cloudinary se go to api pe click and there it is present 
CLOUDINARY_API_KEY= 622631668821998
CLOUDINARY_API_SECRET= emvmDHiHvRLRJiAl2chW-tCEgN8
-------------
use here : 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

As sensitive info so store in .env
*/
import { v2 as cloudinary } from "cloudinary";
// here v2 ko namespace as alias use karte hai
import fs from "fs"

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


/*
Organized way of adding files in cloudinary :
 1) ham hame jo path milega local usse use karnege .
 2)uss path ko use karke if successfully upload ho gya to file ko unlink kar dege fs se .
 but as isme bhi db connection ki trah problem aa skti hai to use try catch ,and as time lagta hai to async tom use hoga hi 
 */

 const uploadFileOnCloudinary = async (localFilePath)=>{
  try{
    // i.e uss file ke liye local path hi nhi hai to means vo locally unlink ho chuki hain ya not exist .
    if( !localFilePath) return null;

    // upload the file on cloudinary 
    // smay lagega upload me so await 
    const responsesCloudinary = await cloudinary.uploader.upload(localFilePath,
      // options uske liye {} form me do and value mostly string 
      {
      // kya file ka type as video , audio kuch bhi ho skta hai genreal so here auto use .
      resource_type:"auto"
    })
    // Upto this point file has been successfully uploaded 
    console.log('File is uploaded Sucessfully on Cloudinary \n');
    // to deep dive ki kaise response milta hai cloudinary se  deep dive
    // console.log(`Response from cloudinary : 
    //   ${responsesCloudinary}
    //   `);


    // mostly hame sirf url chahitye 

    console.log(`cloudinary url on which file get uploaded in cloudinary : ${responsesCloudinary.url}\n`);
  return responsesCloudinary; // pura response de dedo mostly url bhi de sakte ho
  
  }catch(error){
    fs.unlinkSync(localFilePath) // as koi error ki wjah se hamari file upload nhi hui to yha ye mandatory ki server se to hta do as server me hai , uske baad hi aage proceed so ho skta hai vo mailicious file ho to htana compulsory to use unlinkSync not normal unlink method of fs 
    return null;
  }
 }


export {uploadFileOnCloudinary}