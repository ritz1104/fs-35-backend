import Redis from 'ioredis'

const redis = new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD

})

redis.on("connect",()=>{
    console.log("redis connected successfully")
})


redis.on("error",()=>{
    console.log(error)
})

export default redis