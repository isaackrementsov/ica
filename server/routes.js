var main = require("../controllers/main");
var admin = require("../controllers/admin");
var express = require("express");
var multer = require("multer");
var path = require("path");
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
module.exports = function(app){
    console.log("Router has been reached");
    var router = express.Router();
    app.use("/", router);
    router.get("/", main.home);
    router.get("/login", main.renderLogin);
    router.post("/login", main.login);
    router.get("/posts/:postname", main.show);
    router.get("/info/:page", main.about);
    router.get("/admin", admin.home);
    router.get("/admin/create", admin.renderCreate);
    router.post("/admin/create:blog", multiUpload, admin.create);
    router.post("/admin/update:postname/:attr", multiUpload, admin.update);
    router.post("/admin/deletePost/:postname", admin.delete);
    router.post("/admin/about:page", admin.about);
    router.post("/logout", admin.logout);
    router.post("/admin/deleteAbout:aboutId/:page", admin.deleteAbout);
    router.post("/adminn/updateAbout:aboutId/:page", admin.updateAbout)
}