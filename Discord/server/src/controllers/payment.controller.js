import razorpay from "../config/razorpay.config.js"

export const createOrder = async (req,res,next)=>{

    try {
        const amount = 29900

    const order =  await razorpay.orders.create({
        amount,
        currency:"INR",
        receipt:`nitro_${req.user.id}_${Date.now}`
    })

    console.log(order)
    } catch (error) {
        next(error.message)
    }

} 