/*
Two ways se hota hai db connection ki utility

here we are going to create a async handler file and usme sirf ek func bnayege iss name se and usko export kar denge 

hame basicallye ke wrapper banana hai , jisse jab bhi isse call karke ek fun de to uske keliye db cinnection karde .
const asyncHandler = () => {} . normal

but here as we taking a func as a parameter and usse dursre func me use karna chahte hai ,
so uske liye write like this , as hame usse ek dusre func me pass karna hai to bas kya kari wha fir ek  call back lkhdo and usme use karlo 

const asyncHandler = (func) => {() => {}}
i.e uss func ke body me hamare asyncHandler me ek aur func pass karna .


-> iss trah bhi kar sakte hai bina curly braces ke 
const asyncHandler = (func) => () => {}

1) Using try catch :


const asyncHandler = () => {}



    const asyncHandler = (func)=> async (req,res,next) => {
        try{
        // yha awair karo and jo func liya hai params se usko execute karo .
            await func(req,res,next)
        }catch(error){
            res.status(error.code || 500).json({
                success: false,
                message: error.message
            })
        }
    }
so here we have use try catch block and as jo hame error mile if to hamnne usska status ke res send kiya and uske saath saath json me hamne do aur chheze bheji ki success : flag jise front enf ke liye easy rahe if success to age proceed and message : if error aa rha hai to kya msg uska show
ye dono json ke form me bhejte hai res.status ke saath .

-> try me as yha hame simply ek wrapper func bnaya and usme await lga ke func ko fir se return kardiye

--------------------------------------------


2) Using Promises syntax : 

So yha , hamne promise ke trah return kiya hai and , yha hamne fir hi func liye and usko ham yha try catch ki jgah promise ki trah use kar rahe hain
so yha try ki jgah -> Promise.resolve() yha hamne sirf dusra func call kar dete hai 
&
catch -> ke liye catch ya reject use and yha error me if error aaye to usse next params se ham bhej sakte hai dusre middleware se 

const asyncHandler = (requestHandler) => {
    (req,res,next) => {
        Promise
        .resolve((requestHandler(req,res,next))).catch((err) => next(err))
    }
}

export {asyncHandler}

// ye async handler khud ek func as a arg accept karta hai . and return bhi karta hai ek func ko

So here asyncHandler hamara ek higher order func hota hai
*/
const asyncHandler = (requestHandler) => {
    // yha return karna mandatory as tye func lega and uspe promise ke through error handle karke usse return kar dega
   return (req,res,next) => {
        Promise
        .resolve((requestHandler(req,res,next))).catch((err) => next(err))
    }
}

export {asyncHandler}