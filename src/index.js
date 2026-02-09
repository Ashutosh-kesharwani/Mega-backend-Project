import 'dotenv/config'
import connectDB from './db/index.js'
import {app} from './app.js'


const port = process.env.PORT || 8000 ;



// for env debugging , whether env loaded successfully or not 
// console.log(process.env);


/*
Now as we are using async func in while connecting db , so we know that async func return a promise , so we can consume that promise as well with .then() and .catch(). and as we know afiter data base get successfully so now our time to listen to our server for that app ka use 
*/


connectDB()
.then(()=>{

// but before listening to our server we also want to listen for error , so here we are going to on listener for and use error event 

app.on("error",(err)=>{
    console.log(`ERROR : ${err}`);
    throw err
})

// here listen as db connection ke baad , listen hi karna hota hai.
app.listen(port,()=>{
    console.log(`Server running at ${port}`);
      console.log(`Server running at http://localhost:${port}`);    
})
})
.catch((err)=>{
  console.log(`MongoDB connection failed !! ${err}`);
})






/* 

Note always try to import .env file as early as possible as issi file se ham jitne environment var hai uskla use karenge so isse generally ham hamare main enrty point me import karate hai , at top as isme ho gya to khi pe bhi use kar sakte hai as vo at end yhi entry level pe hi call hoga .
-> import dotenv from 'dotenv';
-> abb ye chalega hi nhi isse config bhi karana 
padega so [ye hmara ek obj lega jisme path bhi daalo ki kha .env file hai and now abb ye work karne lagega har jgah , ]
 dotenv.config({
  path:'./env'
})
To debug whether env file get load or not 

console.log(process.env);

🚀 console.log(process.env) — What It Does

It prints all environment variables available to your Node process.
-----------------------------------

import mongoose from 'mongoose';
import {DB_NAME} from './constants.js';

import express from  'express';
import 'dotenv/config'

const PORT = process.env.PORT || 3000;
This way also going to work IIFE is better as vo banne ke baad turant invoke ho jata hai , and usko asynchronous bnane ke liye simply usme async likhdo
like this [
;(async ()=>{})();] and most of people apply semicolon before iife as maan lo phle wale code me kisi ne semi colon nhi lagaya to safety ke liye fallback ke case me 

function connectDB(){
}

connectDB()

->Mostly jab log index.js me hamara db connect karte hai to vo kya karte hai  iss trah ka syntax follow karte hai 

so here in async call nack  use error handling as , isme error bhi aa skta hai . use try and catch

>so here always write db connection after the await , as ye time taking process hai , so isme smay bhi lag skta hai.

2) here most of people ye kaam karte hai ki jaisi hi db connect hua uske baad listeners laga dete hai 
here like app.on("event",callbackFN) , here event me ham event type rakhte hai ,like error etc.

3)app.listen() yha pe hame , ehi bta hai kki kuj se port pe listen kar rahe hai ...

4)   throw error;ye line use as when error aaye to usse throw karke hamare program se exit kar jao , so uske liye ham throw use karte hai ,
otherways are like [use : process.exit(1) -> ye hmaara node js ek process name ka keyword provide karata haijo hamare current process ka reference hota hai , to isko use karke bhi we can exit, 
and isse hame import bhi nhi karna padta hai ye node ka inbuilt hai  ]

5) we can also store our await i.e connection wali line ko kisi variable me and ham isse print kara ke bhi dhkeho kya kya info me milti hai hame isse .
like this [const connectionInstance =    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);] and hame iss instance me ek host milta hai jo btatta hai ki kha pe hmara kis url me db connect ho haa rha hai ,as produc me ya khi aur

console.log(`\n MongoDB connected !! DB Host : ${connectionInstance}`);
mainly used for checking ki ham kha pe connect ho rahe hai , production ki kisis aur state server link pe 


6) Last step as hamnr connection kar diya ti usse import kara ke uss fiunc ko ya call kardo
import connectDB from "./db";

connectDB();




-----------------------------
Code for if write in Index.js main file  :

[everything dbConnection , express for listener]

(async ()=>{
    try{

      await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)

      app.on("error",(error)=>{
        console.log(`ERROR : ${error}`);
        throw error;
      })
      app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)});



    }catch(error){
        console.log(`ERROR : ${error}`);
        throw error;
    }
})();

Problem : In this approach -> is that , as even though here we write everything in oir index.js file , byut is not a good approach to pollute our main entry level file of App.

So we always try to make our code modular and write separate task in separate folder like express part in app.js and db connection in db directory [ke index.js me ] we use files and wha pe func bna ke export kare and yha pe import kar le , fir simply index.hjs me usko, call import karke use karle .

*/


