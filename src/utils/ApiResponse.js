/*
Standardize Way of Handling Api Responses Jo Aayenge 
> So we are going to use this class jab bhi ham response bhejenge khi bhi to ham iss ka use lenge 
> As node js me hame ye res class by def nhi milti so yha ham isse override nhi karte , yha ham khud ki class bnate hai ,


*/

class ApiResponse {
    constructor(
       statusCode,
       data ,
       message ="Sucess"  // as ye apiRes hai to most of time ye hamara sucess msg hi hoga ki haa hamari api res send successfully 
    ){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        // yha ham usulayy ye standard set kar rahe hai ki hamara jo stattusCode hoga usse ham yhan usually 400 se less if use jada wla to false jayga , isme 
        // statuscode ka bhi standard hota hai unki values ki range ke hisaab se 
        this.success = statusCode < 400
    }
}