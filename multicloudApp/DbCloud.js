const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DbCloudSvcsSchema = new Schema({
    dbemail: {
        type: String,
        required: true
    },
    dbpassword: {
        type: String,
        required: true
    },
    usermongoid: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("DbCloud", DbCloudSvcsSchema);
