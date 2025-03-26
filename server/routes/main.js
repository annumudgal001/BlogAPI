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
            nextpage:hasnextpage?nextpage:null
        })
    } catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).send("Server Error");
    }
})


// router.get("",async (req,res)=>{
//     const locals={
//         title: 'Node JS Blog',
//         description: 'simple blog with node express mongo db'
//     }

//     try {
//         const data=await post.find();
//         res.render('index.ejs',{locals,data})
//     } catch (error) {
//         console.error("Error fetching posts:", error.message);
//         res.status(500).send("Server Error");
//     }
// })





router.get("/post/:id",async (req,res)=>{
    

    try {

        let slug=req.params.id;

        const data=await post.findById({_id:slug});
        const locals={
            title: data.title,
            description: 'simple blog with node express mongo db'
        }

        res.render('post.ejs',{locals,data})
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

        res.render('searchresult.ejs',{locals,data})

    } catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).send("Server Error");
    }
})



router.get("/about",(req,res)=>{
    res.render('about.ejs')
})


// const insertpostdata = async () => {

//    try {
//        const result = await post.insertMany(
//            [
//                { title: "Building a Blog", body: "This is a sample post" },
//                { title: "Node.js Basics", body: "Introduction to Node.js runtime" },
//                { title: "Express Framework", body: "Creating web servers with Express" },
//                { title: "MongoDB CRUD", body: "How to perform basic database operations" },
//                { title: "REST API Design", body: "Principles of RESTful API development" },
//                { title: "Middleware Concepts", body: "Understanding Express middleware" },
//                { title: "Error Handling", body: "Best practices for error handling" },
//                { title: "Authentication", body: "Implementing user login systems" },
//                { title: "Deployment", body: "How to deploy Node.js applications" },
//                { title: "Performance Tips", body: "Optimizing your Node.js app" }
//            ]
//        );
//        console.log(`Inserted ${result.length} posts`);
//        return result;
//    } catch (error) {
//        console.error("Insert failed:", error.message);
//        throw error;
//    }
// };

// insertpostdata();


module.exports=router;