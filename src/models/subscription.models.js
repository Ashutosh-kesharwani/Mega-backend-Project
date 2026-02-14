import mongoose,{Schema} from 'mongoose'

const subscriptionSchema = new Schema({

    // user who are subscribing the channels .
    subscriber: {
        type: Schema.Types.ObjectId,
        ref:"User",
    },
    // user whose channel is this [main user iss channel ka ]
    channel: {
        type: Schema.Types.ObjectId,
        ref:"User",
    },
    
},{timestamps:true});

export const Subscription= mongoose.model("Subscription",subscriptionSchema);