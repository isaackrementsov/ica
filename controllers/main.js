var User = require("../models/users");
var Post = require("../models/posts");
var About = require("../models/abouts");
var helpers = require("../helpers");
module.exports = {
    home: function(req,res){
        Post.find({blog:false}, function(err,docs){
            res.render("home", {session:req.session, docs:docs})
        })
    },
    renderLogin: function(req,res){
        if(req.session.userId){
            res.redirect("/admin");
        }else{
            res.render("login", {session:req.session})
        }
    },
    login: function(req,res){
        User.findOne({name:req.body.username, password:req.body.password}, function(err,doc){
            if(doc){
                req.session.error = false;
                req.session.userId = doc._id;
                req.session.user = doc.name;
                res.redirect("/admin")
            }else{
                req.session.error = "Incorrect Credentials";
                res.redirect("/login")
            }
        })
    },
    show: function(req,res){
        Post.findOne({postname:req.params.postname}, function(err,doc){
            res.render("showPost", {session:req.session, doc:doc})
        })
    },
    about: function(req,res){
        About.find({page:req.params.page}, function(err, docs){
            res.render("about", {session:req.session, docs:docs, page:req.params.page, helpers:helpers})
        });  
    },
    blog: function(req,res){
        Post.find({blog:true}, function(err,docs){
            res.render("blog", {session:req.session, docs:docs})
        })
    }
}