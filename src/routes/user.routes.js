import {Router} from 'express'
import { registerUser } from '../controllers/user.controller.js'
import {upload} from '../middlewares/multer.middleware.js'

const router = Router()
/*

middleware : app.use("/users",userRouter) 
: so isse ye hoga ki jaise hi ham users pe jayenge , waise hi kya hoga ye middleware hamara userRouter ko call kar dega and iss router ko power de dega ki tum jo func waigaira call karna hai karlo .

-> so yha pe kya ho rha hai ki jaise hi hamne app.js me route define kiya ki middleware use karke to 
 app.use("/users",userRouter)  ye jo users hai ye hmare prefix ki trah kaam kare jitne bhi routes ham iss router me likhnege 

>so abb agr ham neeche 
Router.route("/register").post(registerUser):

likha hai to yha jab users ke register wale pe jaye to ye cobntroller me jo registerUser hai usko use kar lijiye .

url : http://localhost:8000//users/register
so if hame login ka route bnana hai to usse hame middleware ko baar baar nhi likhna wha express me sirf usse ek baar karlo use and now jo method , login pe ban jayga .

So note : app.use("/users",userRouter)  iss middleware ke baad jitne bhi method likhe jayenge wo sab yhi pe honge .iss route file me 
*/

// yha abb ham ye bta rahe hai ki jab users/register pe jaye to hamare post http method se register user controller ke action ko call kardo 

router.route("/register").post(
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
    registerUser
)
// Router.route("/login").post(login)

export default router

/*
Standard practice : that if ham agr api define kar rahe  hai to  url use me iss trah matdo wha btana padega ki ham api,ye v1 verson hai iska ..
app.use("/users",userRouter) .

use like this :
app.use("/api/v1/users",userRouter)

url become : http://localhost:8000/api/v1/users/register
*/





