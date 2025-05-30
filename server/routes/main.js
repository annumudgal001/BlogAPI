const express = require('express');
const router =express.Router();
const post = require('../models/post.js');




router.get("",async (req,res)=>{
    const locals={
        title: 'Node JS Blog',
        description: 'simple blog with node express mongo db'
    }

    try {
        let perpage=10;
        let page=req.query.page||1;
        const data=await post.aggregate([
            {$sort:{createdAt:-1}}
        ])
        .skip(perpage*page-perpage)
        .limit(perpage)
        .exec();


        const count=await post.countDocuments();
        const nextpage=parseInt(page)+1;
        const hasnextpage=nextpage<=Math.ceil(count/perpage)

        res.render('index.ejs',{
            locals,
            data,
            current:page,
            nextpage:hasnextpage?nextpage:null,
            currentroute:'/'
        })
    } catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).send("Server Error");
    }
})


router.get("/post/:id",async (req,res)=>{
    

    try {

        let slug=req.params.id;

        const data=await post.findById({_id:slug});
        const locals={
            title: data.title,
            description: 'simple blog with node express mongo db'
        }

        res.render('post.ejs',{locals,data,currentroute:'/post/:id'})
    } catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).send("Server Error");
    }
})


router.post("/search",async (req,res)=>{
    

    try {
        const locals={
            title: 'Search',
            description: 'simple blog with node express mongo db'
        }

        let searchterm=req.body.searchterm;
        const searchnospecialcharacters=searchterm.replace(/[^a-zA-Z0-9]/g,"");


        const data=await post.find({
            $or:[ 
                {title:{$regex:new RegExp(searchnospecialcharacters,"i")}},
                {body:{$regex:new RegExp(searchnospecialcharacters,"i")}}
            ]
        });

        res.render('searchresult.ejs',{locals,data,currentroute:'/search'})

    } catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).send("Server Error");
    }
})



router.get("/about",(req,res)=>{
    res.render('about.ejs',{currentroute:'/search'})
})


module.exports=router;