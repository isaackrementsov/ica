var User = require("../models/users");
var Post = require("../models/posts");
var About = require("../models/abouts");
var fs = require("fs");
var nodemailer = require("nodemailer");
module.exports = {
    home: function(req,res){
        if(req.session.userId){
            Post.find({}, function(err, docs){
                res.render("adminHome", {session:req.session, docs:docs})
            })
        }else{
            res.redirect("/")
        }
    },
    create: function(req,res){
        var blog = req.body.blog == "blog";
        console.log(blog)
        var image;
        if(req.files['coverPhoto']){
            image = req.files['coverPhoto'][0].filename
        }else{
            image = null
        }
        var images = [];
        if(req.files['gallery']){
            for(var i = 0; i < req.files['gallery'].length; i++){
                images.push({name:req.files['gallery'][i].filename})
            }
        }else{
            var images = null
        }
        Post.create({name:req.body.name, postname:req.body.postname.split(" ")[0], content:req.body.description, image:image, images:images, blog:blog, location:req.body.location, year:req.body.year}, function(err){
            if(err){
                req.session.err = "Please use a unique postname";
                res.redirect("/admin/create")
            }else{
                req.session.err = false
            }
            res.redirect("/admin")
        })
    },
    renderCreate: function(req,res){
        if(req.session.userId){
            res.render("create", {session:req.session})
        }else{
            res.redirect("/")            
        }
    },
    update: function(req,res){
        var images = [];
        //This method uses parameters from POST url to dynamically choose what and how to update
        Post.findOne({postname:req.params.postname}, function(err,doc){
            var attr = req.params.attr;
            if(doc && !err){
               if(req.files){
                    if(req.files['coverPhoto']){
                        fs.unlink("../Ilya website/public/img/" + attr, function(err){
                            if(err){
                                console.log(err)
                            }
                        });
                        doc.image = req.files['coverPhoto'][0].filename;
                        doc.save();
                        res.redirect("/posts/" + req.params.postname)
                    } 
                    if(req.files['gallery']){
                        if(!doc.images){
                            doc.images = []
                        }
                        for(var i = 0; i < req.files['gallery'].length; i++){
                            doc.images.push({name:req.files['gallery'][i].filename})
                        }
                        doc.save();
                        res.redirect("/posts/" + req.params.postname)
                    }
                }else if(attr.indexOf("delete") != -1){
                    doc.images = doc.images.filter(function(index){
                        return index.name != attr.split("+")[1];
                    });
                    doc.save();
                    fs.unlink("../Ilya website/public/img/" + attr.split("+")[1], function(err){
                        if(err){
                            console.log(err)
                        }
                    });
                    res.redirect("/posts/" + req.params.postname)
                }else if(req.body.value){
                    if(attr == "postname"){
                        doc.postname = req.body.value.split(" ")[0];
                        doc.save(function(err){
                            if(err){
                                console.log(err);
                                req.session.error = "Please use a unique postname";
                                res.redirect("/posts/" + req.params.postname)
                            }else{
                                req.session.error = false;
                                res.redirect("/posts/" + req.body.value.split(" ")[0])
                            }
                        })
                    }else if(attr == "name"){
                        doc.name = req.body.value;
                        doc.save();
                        res.redirect("/posts/" + req.params.postname)
                    }else if(attr == "content"){
                        doc.content = req.body.value;
                        doc.save();
                        res.redirect("/posts/" + req.params.postname)
                    }
                }
            }
        })
    },
    about: function(req,res){
        About.create({page:req.params.page, content:req.body.content, title:req.body.title}, function(err){
                res.redirect("/info/" + req.params.page)
        });
    },
    logout: function(req,res){
        req.session.destroy();
        res.redirect("/")
    },
    updateAbout: function(req,res){
        About.findOne({_id:req.params.aboutId}, function(err,doc){
            if(doc && !err && req.body.value){
                console.log(doc.content);
                doc.content = req.body.value;
                doc.save()
            }
            res.redirect("/info/" + req.params.page)
        })        
    },
    deleteAbout: function(req,res){
        About.remove({_id:req.params.aboutId}, function(err){
            res.redirect("/info/" + req.params.page)
        })
    },
    delete: function(req,res){
        Post.findOne({postname:req.params.postname}, function(err, doc){
            fs.unlink("../Ilya Website/public/img/" + doc.image, function(err){
                if(err){
                    console.log(err)
                }
            });
            if(doc.images){
                for(var i = 0; i < doc.images.length; i++){
                    fs.unlink("../Ilya Website/public/img/" + doc.images[i].name, function(err){
                        if(err){
                            console.log(err)
                        }
		            })
                }
            }
        }).exec(function(err){
            Post.remove({postname:req.params.postname}, function(err){
                res.redirect("/admin")
            })
        })
    },
    rContact: function(req,res){
        res.render("contact", {session:req.session})
    },
    contact: function(req,res){
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ilyacawork@gmail.com',
                pass: process.env.EMAILPASSWORD || 'redacted'
            }
        }); 
        var mailOptions = {
            from: req.body.email,
            to: '<ilyacawork@gmail.com>',
            subject: req.body.name + ' has contacted you from icawork',
            html: '<p>' + req.body.text + '<p>',
        }
        transporter.sendMail(mailOptions, function(err,info){
            if(err){
                console.log(err)
            }else{
                console.log(info)
            }
        });
        res.redirect("/contact")
    }
}
