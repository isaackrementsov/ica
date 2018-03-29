var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connection.on("open", function(){
    console.log("mongoose connected!");
});
var serviceSchema = new Schema({
    name: {type: String, unique: true},
    description: {type:String},
    image: {type:String}
});
var Service = mongoose.model("Service", serviceSchema);
module.exports = Service;