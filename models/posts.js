var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connection.on("open", function(){
    console.log("mongoose connected!");
});
var postSchema = new Schema({
    name: {type: String},
    postname: {type: String,  unique: true},
    content: {type: String},
    image: {type: String},
    images: [{name: String}],
    blog: {type: String},
    type: {type: String},
    year: {type: String},
    location: {type:String}
});
var Post = mongoose.model("Post", postSchema);
module.exports = Post;