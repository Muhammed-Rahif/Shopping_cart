const db=require('../config/connection')
const collection=require('../config/constants')
const objectId=require('mongodb').ObjectID
module.exports={


    addProduct:(product,callback)=>{
        
        
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
            
            callback(data.ops[0]._id)

        })

    },
    getAllProducts: async(callback)=>{
        let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
        callback(products)
    
    },
    deleteProducts:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:objectId(proId)}).then((response)=>{
                console.log(response);
                resolve(response)
            })

    })

    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(product,proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(proId)},{$set:{
                Name:product.Name,
                Category:product.Category,
                Price:product.Price,
                Description:product.Description
            }
        }).then((response)=>{
            resolve()
        })
        })
    },
    getCartProducts: (userId) => {

        return new Promise(async (resolve) => {
            console.log(userId)
            let cart = await db.get().collection(collection.CART_COLLECTION)
                .aggregate([{$match: {user: ObjectID(userId)}},
                    {
                        $lookup:{
                            from:collection.PRODUCT_COLLECTION,
                            let:{product:'$products'},
                            pipeline:[{
                                $match:{$expr:{$in:['$_id','$$product']}}
                            }],
                            as:'productDetails'
                        }
                    },{$project:{productDetails:1,_id:0}}]).toArray()
            console.log(cart)
            if(cart[0]) resolve(cart[0].productDetails)
            else resolve(null)
        })
    }




    
}