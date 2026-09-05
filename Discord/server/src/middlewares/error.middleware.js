export const errorMiddleware = (err,req,res,next)=>{

    const statusCode = err.statusCode || (err.name === "ValidationError" ? 400 : err.code === 11000 ? 409 : 500)
    const errors = err.name === "ValidationError"
        ? Object.values(err.errors).map(({ path, message }) => ({ path, message }))
        : err.errors || []

    return res.status(statusCode).json({
        success:false,
        message:err.message || "Internal server error",
        errors
    })
}