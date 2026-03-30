const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [function() { return !this.isGoogle }, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"]
    },
    password: { 
        type: String,
        required: [function() { return !this.isGoogle }, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        maxlength: [128, "Password cannot exceed 128 characters"],
        select: false // do not include password by default
    },
    credits: {
        type: Number,
        default: 100,
        min: 0
    },
    isCreaditsAvailable: {
        type: Boolean,
        default: true
    },
    // canonical flag used by payment flow
    isCreditAvailable: {
        type: Boolean,
        default: true
    },
    // Badges earned by the user (e.g., bronze/silver/gold)
    badges: {
        type: [String],
        default: []
    },
    gmailConnected: {
        type: Boolean,
        default: false,
        get: function(v) {
            return this.isGoogle || v;
        }
    },
    isGoogle: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        select: false
    },
    resetOtpExpiry: {
        type: Date,
        select: false
    },
    gmailPendingEmail: {
        type: String,
        select: false
    },
    gmailVerificationToken: {
        type: String,
        select: false
    },
    gmailVerificationExpiry: {
        type: Date,
        select: false
    },
    
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }]

}, { timestamps: true });

// Hash password before saving when modified
// Use async middleware without `next` to work with Mongoose/Kareem promise middleware
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare passwordcurl -X POST http://localhost:3000/api/settings/otp-for-forgot-password -H "Content-Type: application/json" -d '{"email":"you@example.com"}'
userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    if (typeof candidatePassword !== 'string') return false;
    // Trim the candidate to avoid accidental leading/trailing whitespace mismatches
    const candidate = candidatePassword.trim();
    try {
        return await bcrypt.compare(candidate, this.password);
    } catch (err) {
        console.error('comparePassword error:', err);
        return false;
    }
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;