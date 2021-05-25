const db=require('../config/connection')
const collection=require('../config/constants')
const bcrypt=require('bcrypt')

const objectId=require('mongodb').ObjectID

module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.password=await bcrypt.hash(userData.password,10)
        db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
            resolve(data.ops[0])
        })
    })


    },
    doLogin:(userData)=>{
        return new Promise(async (resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            
            if(user){
                bcrypt.compare(userData.Password,user.password).then((status)=>{
                    if(status){
                        console.log('Login success');
                        response.user=user
                        response.status=true
                        resolve(response)
    
                    }else{
                        console.log('Login Failed');
                        resolve({status:false})
                    }
                })
            }else{
                console.log('Login Failed,No Email Found')
                resolve({status:false})
            }
    

        })
       
    },
    addToCart:(userId,proId)=>{
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
              db.get().collection(collection.CART_COLLECTION)
              .updateOne({user:objectId(userId)},
              {
                  $push:{products:objectId(proId)}
              }).then((response)=>{
                  resolve()
              }).catch((err)=>{

              })


            }else{
                let Cart={
                    user:objectId(userId),
                    products:[objectId(proId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(Cart).then((response)=>{
                    resolve()
                })
            }
        })
    },
   
}