const express = require('express');
const router =express.Router();



router.get("",(req,res)=>{
    const locals={
        title: 'Node JS Blog',
        description: 'simple blog with node express mongo db'
    }
    res.render('index.ejs',{locals})
})


module.exports=router