const Jwt = require("jsonwebtoken");
const creatErrors=require("http-errors");
const signacessToken = (user_id)=>{
    return new Promise((resolve,reject)=>{
          const payload={};
          const option={
            expiresIn:"24h",
            audience:user_id
          }
          const secret =process.env.ACCESS_TOKEN_SECRET_KEY;
          Jwt.sign(payload,secret,option,(error,token)=>{
            if(error){
                console.error(error.message);
                reject(creatErrors.InternalServerError());
            }
            resolve(token);
          })
    })
}
module.exports={signacessToken}