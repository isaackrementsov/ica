var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connection.on("open", function(){
    console.log("mongoose connected!");
});
var userSchema = new Schema({
    name: {type: String},
    password: {type: String}
});
var User = mongoose.model("User", userSchema);
module.exports = User;