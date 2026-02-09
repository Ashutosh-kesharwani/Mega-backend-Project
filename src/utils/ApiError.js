/*

: Standardized Way of handling Api Error : 
-> jab api error aaye to ham usse iss trah se handle karenge .

Here what we are going to do is we going to standardize error ko bhi yha ham as we know that ki Node.js me Error class jo hoti hai ham usse yha inheritance ki madad se extends karke jo msg jaise methods hai usko override kar dete hai .
class ApiError extends Error{

// so yha hamne ek constructor liya hai hamne bola ki jab error aaye to hame ye sab bhejo hi , ki statusCode kya hai ,message [if meg na aye to def dedo] , errors [if mul error bhejnne hai to issntrah arry lelo ] , stack empty pahle |

2) Now constructer ki body me ham , jo hamne iss Apierror ko call karte waqt params me diya hai usko use karke update kar denge |

    constructor(
        statusCode,
        message = "Something went wrong",
        errors= [],
        stack= ""
    ){
    // override methods yha pe hame uske liye super method use karte ha
    //yha hamne jo cheeze constructer ke params me nhi li hai wo sab uss Error class me pahle se present hai and ham yha message method jo hai usse override kar rahe hai  
  
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.message = message
    this.success= false;
    this.errors = this.errors

>    Api error me kya hota hai ki if agr error aa rha hai to usse ye stack trace mil jaye , and if stack mila hai to usse hamare stack se set kardo if nhi error aaya hai to 
    iss trah Error  Error.captureStackTrace(this,this.constructor) iss trah bhej do 

    Mostly used in production
  
    if (stack) {
        this.stack = stack
    }else{
        // yha hame refe pass karna hota hai i.e kis error context me baat kar rahe ho
        Error.captureStackTrace(this,this.constructor)
    }


    }
}

*/

class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong",
        errors= [],
        stack= ""
    ){

    super(message)
    this.statusCode = statusCode
    this.data = null
    this.message = message
    this.success= false;
    this.errors = errors
    if (stack) {
        this.stack = stack
    }else{
        Error.captureStackTrace(this,this.constructor)
    }
    }
}

export {ApiError}