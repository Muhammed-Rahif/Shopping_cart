const { response } = require('express');
var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers')
const userhelpers=require('../helpers/user-helpers')
const verifyLogin=((req,res,next)=>{
  var login=req.session.loggedIn
  if(login){
    next
  }
  else{
    res.redirect('/login')
  }
})
router.get('/', function (req, res, next) {
  let user=req.session.user
  
  productHelpers.getAllProducts((products)=>{
    
    
    res.render('user/view-product', { products,user});

  })
 

});

router.get('/login',function(req,res){
  let loggedIn=req.session.loggedIn
  if(loggedIn){
    res.redirect('/')
  }else{
    let Err=req.session.loginErr
    
    res.render('user/login',{Err})
    
    req.session.loginErr=false
    

  }
  
})
router.get('/signup',function(req,res){
  res.render('user/signup')
})
router.post('/signup',function(req,res){
  userhelpers.doSignup(req.body).then((respond)=>{
    req.session.loggedIn=true
    req.session.user=respond
    res.redirect('/')
  }).catch((err)=>{
    console.log(err)
  })
  
})

router.post('/login',function(req,res){
  
  userhelpers.doLogin(req.body).then((response)=>{
     if(response.status){
       req.session.loggedIn=true
       req.session.user=response.user
      res.redirect('/')

     }else{
       req.session.loginErr="Invalid Username Or Password"
       res.redirect('/login')
    
     }
      
   
  }).catch((err)=>{
    console.log(err);
    
})


  
})
router.get('/logout',function(req,res){
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart',verifyLogin,async function(req,res){
   
    
    let userCart=await productHelpers.getCartProducts(req.session.user._id)
     console.log(userCart);
     
     res.render('user/cart')
})

router.get('/add-to-cart/:id',(req,res)=>{

   verifyLogin(req,res)
   userhelpers.addToCart(req.session.user._id,req.params.id).then(()=>{
    res.redirect('/')

  }).catch((err)=>{
    console.log(err)
  })


})




module.exports = router;
