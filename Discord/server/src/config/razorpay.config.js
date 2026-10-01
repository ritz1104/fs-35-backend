import Razorpay from "razorpay";

const  razorpay =  new Razorpay({
    key_id:process.env.RAZOR_PAY_API_KEY,
    key_secret:process.env.RAZOR_PAY_SECRET_KEY
})

export default razorpay
