var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelpers.getAllProducts((products)=>{
    console.log(products);
    res.render('admin/view-products', { admin: true, products });

  })
  
 
});
router.get('/add-product', function (req, res) {
  res.render('admin/add-product', { admin: true })
})
router.post('/add-product', (req, res) => {

  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.Image
    image.mv('./public/product-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.redirect('/admin/')

      } else {
        console.log(err);
      }

    })



  })

})

router.get('/delete-product/:id',function(req,res){
  let proId=req.params.id
  productHelpers.deleteProducts(proId).then((response)=>{
    res.redirect('/admin')
  })


})

router.get('/edit-product/:id',async(req,res)=>{
  
  
  let products=await productHelpers.getProductDetails(req.params.id)

  
   
  res.render('admin/edit-product',{products})
  



})

router.post('/edit-product/:id',(req,res)=>{
  productHelpers.updateProduct(req.body,req.params.id).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image = req.files.Image
      image.mv('./public/product-images/' + req.params.id + '.jpg')
    }
  })
})

module.exports = router;
