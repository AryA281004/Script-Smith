const express = require("express");
const router = express.Router();
const { authMiddleware }= require ('../middleware/auth.middleware')
const { generateNotes } = require("../controllers/generate.controller");
const { pdfDownload } = require("../controllers/pdf.controller");
const { downloadByNoteId } = require("../controllers/download.controller");
const connectGmailMiddleware = require('../middleware/connectgmail.middleware');


router.post("/forge-note", authMiddleware ,generateNotes);
router.post("/download-pdf", authMiddleware , connectGmailMiddleware, pdfDownload);
router.get('/download-pdf/:noteId', authMiddleware, connectGmailMiddleware, downloadByNoteId);

module.exports = router;