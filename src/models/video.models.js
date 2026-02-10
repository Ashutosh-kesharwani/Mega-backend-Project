import mongoose,{Schema} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
const videoSchema = new Schema({
    videoFile:{
        type:String,// cloudinary se video ka url 
        required:[true,'Video is Required'],
    },
    thumbnail:{
        type:String, // cloudinary url
        required:[true,'Video is Required'],
    },
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    duration:{
        type:Number, /*here duration we are going to extract from third party [like clodinary and aws] as they contains video , and uksa duration , so ye show karega  */
        required:true,
    },
    views:{
        type:Number,
        default:0,
    },
    isPublished:{
        /* is ka mtalab video upload to sab dekh sakte hai */
        type:Boolean,
        default:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },

},{timestamps:true})


videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)