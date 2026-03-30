const mongoose = require('mongoose');

const CREDIT_MAP = {
    50: 100,
    100: 300,
    150: 550
};

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        enum: Object.keys(CREDIT_MAP).map(k => Number(k))
    },
    currency: {
        type: String,
        default: 'INR'
    },
   status: {
        type: String,
        enum: ['created','pending','succeeded','failed','cancelled'],
        default: 'created'
    },
   

}, { timestamps: true });

// Ensure credits correspond to the selected amount plan
paymentSchema.pre('validate', function(next) {
    try {
        if (this.isNew || this.isModified('amount')) {
            const mapped = CREDIT_MAP[this.amount];
            if (mapped) {
                this.credits = mapped;
            }
        }
    } catch (e) {
        return next(e);
    }
    next();
});

const paymentModel = mongoose.model('Payment', paymentSchema);

module.exports = {
    paymentModel,
    CREDIT_MAP
};