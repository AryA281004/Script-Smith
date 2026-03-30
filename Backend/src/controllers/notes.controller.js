const noteModel = require("../models/note.model");
const userModel = require("../models/user.model");

const getSingleNote = async (req, res) => {
  try{
    const note =await noteModel.findOne({ _id: req.params.id, user: req.userId }).select('-__v');
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ note }); 
  }catch(error){
      console.error("Error fetching note:", error);
      res.status(500).json({ message: "Internal server error" });

    }
  }
  

const getAllNotesOfUser = async (req, res) => {
  try {
    
    const notes = await noteModel.find({ user : req.userId }).select('-__v').sort({ createdAt: -1 });
   
    if (!notes) {
      return res.status(404).json({ message: "Notes not found" });
    }

    res.status(200).json({ notes });
  }
    catch (error) {
    console.error("Error fetching user notes:", error);
    res.status(500).json({ message: "Internal server error" });
    }
};

const deleteNote = async (req, res) => {
  try {

    const note = await noteModel.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found. It might already be deleted"
      });
    }

    // remove note reference from user
    await userModel.findByIdAndUpdate(
      req.userId,
      { $pull: { notes: req.params.id } }
    );

    res.status(200).json({
      message: "Note deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

const getTotalNotesNumber = async (req, res) => {
  try {
    const totalNotes = await noteModel.countDocuments({ user: req.userId });
    res.status(200).json({ totalNotes });
  } catch (error) {
    console.error("Error fetching total notes number:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  getSingleNote,
  getAllNotesOfUser,
  deleteNote,
  getTotalNotesNumber
};