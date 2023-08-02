const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const _ = require('lodash');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(bodyParser.json())
const uri = "mongodb+srv://ChaviKothari:Chavikot2711@cluster0.wl9ouh9.mongodb.net/?retryWrites=true&w=majority";
// mongoose
try {
  mongoose.connect(uri);
} catch (error) {
  console.log(error);
}
// mongoose.connect("mongodb://127.0.0.1:27017/WhispersOFHeart")
const ratingsSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  likes:{
    type:Number,
    required:true
  },
  dislikes:{
    type:Number,
    required:true
  }
});
const rating = mongoose.model("rating",ratingsSchema);
const blogSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  date:Number,
  month:String,
  author:{
    type:String,
    required:true
  },
  text:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true,
    minlength:8,
    message:"minimum 8 characters required"
  }
})
const Blog = mongoose.model("Blog",blogSchema);
app.get("/",function(req,res){
  Blog.find().then(function(data){
      res.render("home",{posts:data});
  })
})

app.get("/compose",function(req,res){
  Blog.find().then(function(data){
    res.render("compose",{posts:data});
  })
})

app.get("/views/:id",function(req,res){
  const requestedTitle = _.capitalize(req.params.id);
  Blog.findOne({title:requestedTitle}).then(function(data){
    res.render("edit",{title:data.title,author:data.author,text:data.text})
    console.log(data);
  })
})

app.post("/updates",function(req,res){
  const d = new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June","July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const option = req.body.options;
  const postpassword = req.body.password;
  const posttitle = (req.body.postTitle).trim();
  const postauthor = req.body.postAuthor
  const posttext = req.body.Content
  Blog.findOne({title:posttitle}).then(function(data){
    if(option==="Edit" && data.password === postpassword){
      Blog.findOneAndUpdate({_id:data._id},{
        date:parseInt(d.slice(d.indexOf('/')+1,d.lastIndexOf('/'))),
        month:monthNames[parseInt(d.slice(0,d.indexOf('/')))],
        author:postauthor,
        text:posttext
      }).then(console.log("edit done"))
    }else if(option ==="Delete" && data.password === postpassword){
      Blog.deleteOne({_id:data._id}).then(console.log("deleted"))
    }else{console.log("Invalid")}
  })
   res.redirect("/")
})

app.post("/compose",function(req,res){
  const d = new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June","July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const postTitle = (_.capitalize(req.body.postTitle)).trim();
  Blog.findOne({title:postTitle}).then(function(data){
    if(!data){
      const post = new Blog({
        title:postTitle,
        date:parseInt(d.slice(d.indexOf('/')+1,d.lastIndexOf('/'))),
        month:monthNames[parseInt(d.slice(0,d.indexOf('/')))],
        author: req.body.postAuthor,
        text: req.body.Content,
        password:req.body.password
      });
      post.save();
    }else{
      console.log("already used title");
    }
  }).then(function(){
    rating.findOne({title:postTitle}).then(function(data){
      if(!data){
        const post = new rating({
          title:postTitle,
          likes:0,
          dislikes:0
        });
        post.save();
      }else{
        console.log("already used title")
      }
    })
  }).then(res.redirect("/"))
});
app.get("/posts/:postid",function(req,res){
  var nextTitle="";
  var previousTitle="";
  Blog.findOne({title:req.params.postid}).then(function(data){
    rating.findOne({title:req.params.postid}).then(function(element){
      Blog.find({_id:{$gt: data._id}},{title:1,_id:1}).sort({_id:1}).limit(1).then(function(next){
        Blog.find({_id:{$lt: data._id}},{title:1,_id:1}).sort({_id:-1}).limit(1).then(function(prev){
        if(next.length === 0){nextTitle="NotPresent";}
        else{nextTitle = next[0].title;}
        if(prev.length === 0){previousTitle="NotPresent";}
        else{previousTitle=prev[0].title}
        res.render("post",{title:data.title,author:data.author,postContent:data.text,date:data.date,month:data.month,likecount:element.likes,dislikecount:element.dislikes,nextTitle:nextTitle,previousTitle:previousTitle})
        })
      })
    })
  })
})

app.get("/rating/:options/:postid",function(req,res){
  const method = req.params.options;
  rating.findOne({title:req.params.postid}).then(function(data){
     if(method==='likes'){
       const count =data.likes+1;
        rating.findOneAndUpdate({title:req.params.postid},{
          likes:count
        }).then(console.log('liked'))
    }else if(method === 'dislikes'){
      const count =data.dislikes+1;
      rating.findOneAndUpdate({title:req.params.postid},{
        dislikes:count
      }).then(console.log('disliked'))
    }else{
      console.log(data)
     }
   })
   res.redirect("/posts/"+req.params.postid);
})

app.listen(process.env.PORT || 3000,function(){
  console.log("Server started on port 3000");
});
