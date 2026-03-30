const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topic: {
        type: String,
        required: true,
        trim: true
    },
    standard: {
        type: String,
        trim: true,
        default: ''
    },
    purpose: {
        type: String,
        enum: ['exam', 'assignment', 'revision', 'project', 'general'],
        required: true,
        default: 'exam'
    },
    examType: {
        type: String,
        enum: ['internal', 'external', ''],
        default: ''
    },
    marks: {
        type: Number,
        min: 10,
        default: null
    },
    depth: {
        type: String,
        enum: ['short', 'medium', 'detailed'],
        required: true,
        default: 'medium'
    },
    format: {
        type: String,
        enum: ['notes', 'qa', 'bullet', 'mindmap'],
        required: true,
        default: 'notes'
    },
    includeCharts: {
        type: Boolean,
        default: false
    },
    includeDiagram: {
        type: Boolean,
        default: false
    },
    content: {
        type: mongoose.Schema.Types.Mixed, 
        required : true,
        default: ''
    },
    bookRecommendations: [
        {
            title: String,
            author: String,
            description: String,
            isbn: String,
            link: String
        }
    ],
    youtubeLinks: [
        {
            title: String,
            channel: String,
            description: String,
            duration: String,
            url: String
        }
    ]

}, { timestamps: true });

const noteModel = mongoose.model('Note', noteSchema);

module.exports = noteModel;