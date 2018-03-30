var main = require("../controllers/main");
var admin = require("../controllers/admin");
var express = require("express");
var multer = require("multer");
var path = require("path");
var services = require("../controllers/services");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/');
  },
  filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
  }
});
var upload = multer({ storage: storage });
var multiUpload = upload.fields([{name:"coverPhoto", maxCount: 1}, {name:"gallery"}]);
var checkFiles = function(req,res,next){
  if(req.files['coverPhoto']){
    next()
  }else{
    res.redirect('/admin/create')
  }
}
var checkFile = function(req,res,next){
  if(req.file){
    next()
  }else{
    res.redirect('/services/create')
  }
}
var checkUser = function(req,res,next){
  var loginPath = "/login";
  if(req.session.userId){
    next()
  }else{
    res.redirect(loginPath)
  }
}
module.exports = function(app){
    var router = express.Router();
    app.use("/", router);
    router.get("/", checkUser, main.home);
    router.get("/blog", checkUser, main.blog);
    router.get("/login", main.renderLogin);
    router.post("/login", main.login);
    router.get("/posts/:postname", checkUser, main.show);
    router.get("/info/:page", checkUser, main.about);
    router.get("/admin", checkUser, admin.home);
    router.get("/admin/create", checkUser, admin.renderCreate);
    router.post("/admin/create", checkUser, multiUpload, checkFiles, admin.create);
    router.post("/admin/update:postname/:attr", checkUser, multiUpload, admin.update);
    router.post("/admin/deletePost/:postname", checkUser, admin.delete);
    router.post("/admin/about:page", checkUser, admin.about);
    router.post("/logout", admin.logout);
    router.post("/admin/deleteAbout:aboutId/:page", checkUser, admin.deleteAbout);
    router.post("/adminn/updateAbout:aboutId/:page", checkUser, admin.updateAbout);
    router.get("/contact", admin.rContact);
    router.post("/contact", admin.contact);
    router.get("/services", checkUser, services.all);
    router.get("/service/:name", checkUser, services.read);
    router.get("/services/create", checkUser, services.rCreate);
    router.post("/services/create", checkUser, upload.single('coverPhoto'), checkFile, services.create);
    router.post("/services/update:name", checkUser, services.update);
    router.post("/services/delete:name", checkUser, services.delete)
}