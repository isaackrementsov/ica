var Service = require("../models/services");
var fs = require("fs");
module.exports = {
    all: function(req,res){
        Service.find({}, function(err,docs){
            res.render("services", {services:docs, session:req.session})
        })        
    },
    read: function(req,res){
        Service.findOne({'name':req.params.name}, function(err,doc){
            res.render("service", {service:doc, session:req.session})
        })
    },
    rCreate: function(req,res){
        res.render("createService", {session:req.session})
    },
    create: function(req,res){
        Service.create({name:req.body.name, description:req.body.description, image:req.file.filename}, function(err){
            if(err){
                req.session.err = "Please use a unique name";
                res.redirect("/services/create")
            }
        });
        res.redirect("/services")
    },
    update: function(req,res){
        Service.update({'name':req.params.name}, {'description':req.body.description}, function(){});
        res.redirect("/service/" + req.params.name)
    },
    delete: function(req,res){
        Service.findOne({'name':req.params.name}, function(err,doc){
            fs.unlink("./public/img/" + doc.image)
        }).exec(function(err){
            Service.remove({'name':req.params.name}, function(err){
                res.redirect("/services")
            })
        })
    }
}