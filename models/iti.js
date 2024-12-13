const mongoose = require('mongoose');

function generateRandomId() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

const itiSchema = new mongoose.Schema({
    iti_id: {
        type: String,
        unique: true, 
        default: generateRandomId, 
        maxlength: 5 
    },
    iti_name: {
        type: String,
        required: true 
    },
    description: {
        type: String,
        required: true 
    },
    start_date: {
        type: Date,
        required: true 
    },
    end_date: {
        type: Date,
        required: true 
    },
});

itiSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('iti_id')) {
        let unique = false;
        while (!unique) {
            this.iti_id = generateRandomId(); 
            const exists = await Iti.findOne({ iti_id: this.iti_id }); 
            unique = !exists; 
        }
    }
    next();
});

itiSchema.methods.showData = function() {
    return {
        iti_id: this.iti_id,
        iti_name: this.iti_name,
        description: this.description,
        start_date: this.start_date,
        end_date: this.end_date
    };
};

const Iti = mongoose.model('Iti', itiSchema);

module.exports = Iti;
