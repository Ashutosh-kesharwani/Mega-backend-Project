import multer from "multer"
import path from "path"

/*
Nulter me do type ki storage hai 
1) disk storage : we prefer this 

2) memory storage : yew problem if file bhut badi size ki hai to ye bhut jada space legi and memory can get full easily . so avoid 
*/

const storage = multer.diskStorage({
    // ye btata hai ki ham file ko kha store kar rahe hai .
    //req: to yha whi req hai jo user se aati hai . json data 
    // file : ye option req se nhi bhej sakte so uske liye multer use and ye beech k data multer deta hai 
    // cb callback 
    destination:function(req,file,cb){
        // cb ka first param null  and dest path : jaha pe ham saari file rakhenge 

        // path.resolve("public/temp") ye resiolve mthod bhut imp chahe file khi bhi ho ye usse ussi path me save kargea jo diya hai ,, but import path from  "path" first and then  use 
        cb(null,path.resolve("public/temp"))
    },
    // i.e ye filename change karna hai unique karna hai , nanoid use karte hai , etc 
    filename:function (req,file,cb){
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)  imp but avoid 
        // cb(null,file.fieldname + '-' + uniqueSuffix) 
        cb(null,file.originalname)// ye user ne jo org name rakha vo achi practice nhi hai as if same name ki dher saari file to overwrite ho jaygi baad me improve
    }
})

export const upload = multer({
    storage ,// storage : storage as es6 me if key value same to ek name do only value 
});

// basically iss method se ye fayda ki jo local path hame chahiye tha jo cloudinary me use karte the vo aa jayga hamare pass . ki file local server me kha pe present hai .