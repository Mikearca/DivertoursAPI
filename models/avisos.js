const mongoose = require('mongoose');

const aviSchema = new mongoose.Schema({
    avi_name: {
        type: String,
        required: true
    },
    avi_description: {
        type: String,
        required: true
    }
});

aviSchema.methods.showData = function() {
    return {
        _id: this._id,
        avi_name: this.avi_name,
        avi_description: this.avi_description,
    };
};

const Avi = mongoose.model('Avi', aviSchema);

module.exports = Avi;
