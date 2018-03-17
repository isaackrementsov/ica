var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connection.on("open", function(){
    console.log("mongoose connected!");
});
var aboutSchema = new Schema({
    page: {type: String},
    content: {type: String},
    title: {type: String}
});
var About = mongoose.model("About", aboutSchema);
module.exports = About;