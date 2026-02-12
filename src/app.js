
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express();

// for setuping up configuration for CORS

// app.use(cors()); mostly issi trah se ham cors method ko define karte hai but ham iske jo potions milte hai usko bhi set kar sakte hai like 
/*
here we can add our object as a arg so yha 

# here we are using our cors origin as universal as khi se hi aaye to bhi theek hai and but in production ham , koi specific url ka dete hai like vercel se aaye tbhi accept like that . 
CORS_ORIGIN=* 


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    // ye origin batati hai ki hame kha se api acess karne  ki acess jo jai usse allow karna hai 


    credentials:true,

}))

*/



app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true,

}))

/*
As jab hamare client side se request aati hai to kayi baar usme se data bhi aata hai , to wo data hamara json , form or diff type se aa skta hai to ham advance me settings configure kar lete hai ki hamara data kaise aaye , kis form me , and kitni limit .

// ye  keh rha hai ki ham json ko except karenge and but uski size limmit 16bkb me ho max usse jada size ki nhi .
// so phle hamara ye direct use nhi kar pate the uss smay hame body parser use karna padta hai
app.use(express.json({
    limit:"16kb",
}))

ye json except ke liye hame aaj kal direct express se mil jata hai 

*/ 
app.use(express.json({
    limit:"16kb",
}))


/*
Configure of url data as well : 
as hamara data kayi baar url se bhi aata hai and alg alg site me alg type ka data like khi symbol enoceded , khi direct like ye sab so usse bhi cofigure karna padega 

here as express directly provide us urlencoded method jha hame exteneded milta hai jisme ham ek obj me aur obj de sakten hai and limit bhi,

ham ifm chahe agr limit har jgah constanr use ho rhi hai ek constant limit use karle har jgah and use ek env me store karle and jha chahe use karlo

*/

app.use(express.urlencoded({
    extended:true,
    limit:"16kb",
}))


/*
-> So yha mostly ham kya karte hai ki , jaise hamare client se koi data image, data , pdf aati hai to usse ham apne hi server me rkhna chahte hai to uske liye ham apne src me public filder banate hau usse iss trah sse batana padta hai , as if sever third party like aws , se connection loss ho to data temp yha store hom and show ho jaye .
*/
app.use(express.static("public"))

/*
Cookie configuration : ye use hota hai ki jisse jo mere client ki cookies hai unko mai use kar pau and usspe curd oper kar paye and server securely cookie ko acss kar paye .

basically isse ham secure cookie bna sakte hai , and isse sirf server hi use kar paye only .

app.use(cookieParser())
mostly issme itene ki hi jarurate poadti hai option ki nhi 

*/
app.use(cookieParser())


// so jitne middleware hai usse ham phle hi define karte hai 

// Now time for defining routes 
//Routes 
// so ham yhi pe isko import karte hai route ko jha pe use not at top

// Routes import
import userRouter from './routes/user.routes.js'



// Routes declartion
/*
so earlier we use like app.get as haqm yhi pe route bhi likh rahe the and yhi pe controllwr bhi call back me but abb ham sab seperate kar diya hai , so uske liye hame yha middleware use karna padega so uske liye use app.use()

middleware : app.use("/users",userRouter) 
: so isse ye hoga ki jaise hi ham users pe jayenge , waise hi kya hoga ye middleware hamara userRouter ko call kar dega and iss router ko power de dega ki tum jo func waigaira call karna hai karlo .
*/
// app.use("/users",userRouter)
// use this standard jab api bna rahe hai to 
app.use("/api/v1/users",userRouter)


export {app};

/*Generally when we are using express so ham mainly to cheezo me focus karte hai api reference me , Request and response pe ,

so here Request : Focus on ki kab kab kaise data aa rha  hai  hmare pass and ussse kaise handle karnege , 

So here in req we can get various thing like req.params, req.ip , /.. so on


Mainly we are going to use 2 :

1) req.params as jda tar data hamare url me se aata hai so , ussi me se data lene/fetch ke liye 

2) req.body -> Yha bhi hamara data alg alg tareeka se aa skta ha like form , json so usse bhi ham configure karenge , yha pe 

3) req.cookies -> ham kayi baar data hamari cookies se bhi lete hai , so note for this we have to install cookie-parser pkg and middleware setup it.


=> For handling cookie we need -> two things [cookie-parser , cors ]




----

Note whenever we are going to use middlewares , so we are generally going  to use app.use() , as get , post ye sab yha nhi use , 

-> and app.use() ham tab use karte hai jab hame koi configuration setting karni hoti hai , ya jab middleware set karna ho tab .

Response : me ki ham uss data ko kaise process karenge and wapis kaise send karenge cliet side pe .


--------------------


So these configuration for middleware and configuration setup pahle app.use use karo and then app.get sab
*/




