const userModel = require("../models/user.model");
const noteModel = require("../models/note.model");
const { buildPrompt } = require("../utils/promptBuilder");
const { generateGeminiResult } = require("../services/gemini.service");

const generateNotes = async (req, res) => {
    try {
        const {topic ,standard ,purpose , examType ,marks ,depth ,format ,includeCharts  ,includeDiagram} = req.body;

        if(!topic ){
            return res.status(400).json({ error: "Topic is required." });
        }
        if(!purpose){
            return res.status(400).json({ error: "Purpose is required." });
        }
        if(!depth){
            return res.status(400).json({ error: "Depth is required." });
        }
        if(!format){
            return res.status(400).json({ error: "Format is required." });
        } 
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        if (user.credits <= 10) {
            user.isCreaditsAvailable = false;
            await user.save();
            return res.status(403).json({ message: "Insufficient credits. Please purchase more credits to forge notes." });
        }

        const prompt = buildPrompt({ topic, standard, purpose, examType, marks, depth, format, includeCharts, includeDiagram });

        const noteResult = await generateGeminiResult(prompt);

        // Extract bookRecommendations and youtubeLinks from the result
        const bookRecommendations = noteResult?.bookRecommendations || [];
        const youtubeLinks = noteResult?.youtubeLinks || [];

        const newNote = new noteModel({
            user: user._id,
            topic,
            standard,
            purpose,
            examType,
            marks,
            depth,
            format,
            includeCharts,
            includeDiagram,
            content: JSON.stringify(noteResult),
            bookRecommendations,
            youtubeLinks
        });

        await newNote.save();

        user.credits -= 10;
        if (user.credits <= 0) {
            user.isCreaditsAvailable = false;
        }
        if(!Array.isArray(user.notes)){
            user.notes = [];
        }
        user.notes.push(newNote._id);

        await user.save();

        return res.status(201).json({ 
            message: "Notes generated successfully.", 
            data : noteResult,
            noteId: newNote._id,
            creditLeft: user.credits
        });
        
    }
    catch (error) {
        console.error("Error in generateNotes controller:", error);
        res.status(500).json({ error: "Failed to generate notes. Please try again later." });
    }
}

module.exports = { generateNotes };