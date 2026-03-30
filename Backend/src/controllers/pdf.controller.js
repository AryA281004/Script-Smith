const PDFDocument = require("pdfkit");
const path = require("path");

/* =====================================================
   CONSTANTS & CONFIGURATION
===================================================== */

// Font paths - cached for performance
const FONTS = Object.freeze({
  regular: path.join(__dirname, "../Font/Noto_Sans/static/NotoSans-Regular.ttf"),
  bold: path.join(__dirname, "../Font/Noto_Sans/static/NotoSans-Bold.ttf"),
});

// Color palette - immutable for consistency
const COLORS = Object.freeze({
  header: "#0f172a",
  accent: "#2563eb",
  text: "#111827",
  divider: "#e5e7eb",
  codebg: "#f3f4f6",
  gray: "#6b7280",
  card: "#f8fafc",
  highlight: "#dbeafe",
  success: "#10b981",
  warning: "#f59e0b",
});

// Layout constants
const LAYOUT = Object.freeze({
  pageHeight: 842, // A4 height
  margin: 50,
  minSpaceBottom: 70,
  cardRadius: 6,
  dividerWeight: 1,
});

// Pre-compiled regex patterns for performance
const REGEX = {
  controlChars: /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
  invalidChars: /[\uFFFD]/g,
  objectString: /\[object Object\]/g,
  multipleSpaces: /  +/g,
  heading: /^(#{1,6})\s+(.*)/,
  listItem: /^[-*]\s+(.*)/,
  codeBlock: /^```(\w*)/,
  boldText: /\*\*(.*?)\*\*/g,
  italicText: /\*(.*?)\*/g,
  inlineCode: /`(.*?)`/g,
};

/* =====================================================
   PERFORMANCE UTILITIES
===================================================== */

/**
 * Memoization cache for expensive operations
 */
const cache = new Map();
const CACHE_MAX_SIZE = 1000;

/**
 * Memoize function results
 */
function memoize(fn, keyFn = (...args) => JSON.stringify(args)) {
  return function (...args) {
    const key = keyFn(...args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    
    if (cache.size >= CACHE_MAX_SIZE) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, result);
    return result;
  };
}

/* =====================================================
   TEXT SANITIZER - OPTIMIZED
===================================================== */

/**
 * Clean and sanitize text input (preserves line breaks)
 * @param {string} text - Input text to clean
 * @returns {string} Cleaned text
 */
const cleanText = memoize((text) => {
  if (!text) return "";
  if (typeof text !== "string") text = String(text);

  return text
    .replace(REGEX.controlChars, "")
    .replace(REGEX.invalidChars, "")
    .replace(REGEX.objectString, "")
    .replace(REGEX.multipleSpaces, " ")
    .trim();
});

/* =====================================================
   OBJECT NORMALIZER - OPTIMIZED
===================================================== */

/**
 * Normalize various input types to clean text
 * @param {*} item - Item to normalize
 * @returns {string} Normalized text
 */
function normalize(item) {
  if (!item) return "";
  if (typeof item === "string") return cleanText(item);

  // Priority-based property extraction
  const props = ["question", "text", "q", "title", "content", "description"];
  
  for (const prop of props) {
    if (item[prop]) return cleanText(item[prop]);
  }

  try {
    return cleanText(JSON.stringify(item));
  } catch {
    return "";
  }
}

/* =====================================================
   PAGE SPACE MANAGEMENT - ENHANCED
===================================================== */

/**
 * Ensure sufficient space on page, add new page if needed
 * @param {PDFDocument} doc - PDF document
 * @param {number} height - Required height in points
 */
function ensureSpace(doc, height = 120) {
  if (doc.y + height > doc.page.height - LAYOUT.minSpaceBottom) {
    doc.addPage();
    return true;
  }
  return false;
}

/* =====================================================
   VISUAL COMPONENTS - ENHANCED
===================================================== */

/**
 * Draw a horizontal divider line
 * @param {PDFDocument} doc - PDF document
 * @param {string} color - Line color
 */
function divider(doc, color = COLORS.divider) {
  doc.moveDown(0.5);

  const leftMargin = doc.page.margins.left;
  const rightMargin = doc.page.width - doc.page.margins.right;

  doc
    .moveTo(leftMargin, doc.y)
    .lineTo(rightMargin, doc.y)
    .strokeColor(color)
    .lineWidth(LAYOUT.dividerWeight)
    .stroke();

  doc.moveDown(0.6);
}

/**
 * Calculate content width
 * @param {PDFDocument} doc - PDF document
 * @returns {number} Available content width
 */
function getContentWidth(doc) {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right;
}

/**
 * Draw a section card header
 * @param {PDFDocument} doc - PDF document
 * @param {string} title - Section title
 * @param {string} bgColor - Background color
 * @param {string} textColor - Text color
 */
function sectionCard(doc, title, bgColor = COLORS.card, textColor = COLORS.accent) {
  ensureSpace(doc, 60);
  
  const width = getContentWidth(doc);
  const x = doc.page.margins.left;
  const y = doc.y;
  const height = 40;

  doc
    .roundedRect(x, y, width, height, LAYOUT.cardRadius)
    .fill(bgColor);

  doc
    .fillColor(textColor)
    .font("Bold")
    .fontSize(18)
    .text(title, x + 15, y + 12, { width: width - 30 });

  doc.moveDown(2.5);
}

/* =====================================================
   ADVANCED CONTENT BLOCKS
===================================================== */

/**
 * Render a code block with syntax highlighting
 * @param {PDFDocument} doc - PDF document
 * @param {string} text - Code text
 * @param {string} language - Programming language (optional)
 */
function codeBlock(doc, text, language = "") {
  if (!text) return;
  
  ensureSpace(doc, 30);
  
  const width = getContentWidth(doc);
  const x = doc.page.margins.left;
  const padding = 10;
  
  // Calculate dynamic height based on content
  const lines = text.split('\n');
  const lineHeight = 14;
  const height = Math.max(22, (lines.length * lineHeight) + padding * 2);
  
  // Check if code block fits on current page
  if (doc.y + height > doc.page.height - LAYOUT.minSpaceBottom) {
    doc.addPage();
  }
  
  const y = doc.y;

  // Draw background
  doc
    .rect(x - 5, y - 4, width + 10, height)
    .fill(COLORS.codebg);

  // Draw language label if provided
  if (language) {
    doc
      .font("Bold")
      .fontSize(8)
      .fillColor(COLORS.gray)
      .text(language.toUpperCase(), x, y, { align: 'right', width: width });
  }

  // Draw code content - preserve original formatting
  doc
    .font("Regular")
    .fontSize(9.5)
    .fillColor(COLORS.text)
    .text(text, x + padding, y + (language ? 15 : 5), {
      width: width - padding * 2,
      lineGap: 3,
    });

  doc.moveDown(1);
}

/**
 * Render a highlighted concept card
 * @param {PDFDocument} doc - PDF document
 * @param {string} title - Card title
 * @param {string} text - Card content
 * @param {string} type - Card type (info, success, warning)
 */
function conceptCard(doc, title, text, type = "info") {
  ensureSpace(doc, 100);

  const width = getContentWidth(doc);
  const x = doc.page.margins.left;
  const y = doc.y;

  // Color scheme based on type
  const colors = {
    info: { bg: "#EFF6FF", border: COLORS.accent },
    success: { bg: "#ECFDF5", border: COLORS.success },
    warning: { bg: "#FEF3C7", border: COLORS.warning },
  };

  const scheme = colors[type] || colors.info;

  // Calculate dynamic height
  const titleHeight = 18;
  const contentHeight = doc.heightOfString(text, {
    width: width - 30,
    lineGap: 3,
  });
  const totalHeight = titleHeight + contentHeight + 30;

  doc
    .roundedRect(x, y, width, totalHeight, LAYOUT.cardRadius)
    .fill(scheme.bg);

  // Left border accent
  doc
    .rect(x, y, 4, totalHeight)
    .fill(scheme.border);

  doc
    .fillColor(scheme.border)
    .font("Bold")
    .fontSize(12)
    .text(title, x + 15, y + 10, { width: width - 30 });

  doc
    .fillColor(COLORS.text)
    .font("Regular")
    .fontSize(11)
    .text(text, x + 15, y + 28, {
      width: width - 30,
      lineGap: 3,
    });

  doc.moveDown(totalHeight / 12 + 0.5);
}

/* =====================================================
   ADVANCED MARKDOWN RENDERER
===================================================== */

/**
 * Process inline markdown formatting
 * @param {string} text - Text with inline markdown
 * @returns {string} Cleaned text (formatting handled separately)
 */
function processInlineMarkdown(text) {
  // Remove markdown syntax for PDF rendering
  return text
    .replace(REGEX.boldText, "$1")
    .replace(REGEX.italicText, "$1")
    .replace(REGEX.inlineCode, "$1");
}

/**
 * Render markdown content with advanced formatting
 * @param {PDFDocument} doc - PDF document
 * @param {string} content - Markdown content
 */
function renderMarkdown(doc, content) {
  if (!content) return;

  const lines = content.split(/\r?\n/);
  let paragraph = [];
  let inCode = false;
  let codeLanguage = "";
  let codeLines = [];

  function flushParagraph() {
    if (!paragraph.length) return;

    ensureSpace(doc, 60);

    const text = cleanText(paragraph.join(" "));
    const processedText = processInlineMarkdown(text);

    doc
      .font("Regular")
      .fontSize(11.5)
      .fillColor(COLORS.text)
      .text(processedText, {
        lineGap: 6,
        align: 'left',
      });

    doc.moveDown(0.8);
    paragraph = [];
  }

  function flushCodeBlock() {
    if (!codeLines.length) return;
    
    codeBlock(doc, codeLines.join('\n'), codeLanguage);
    codeLines = [];
    codeLanguage = "";
  }

  for (let raw of lines) {
    let line = raw.trim();

    // Code block detection
    const codeMatch = line.match(REGEX.codeBlock);
    if (codeMatch) {
      flushParagraph();
      
      if (!inCode) {
        codeLanguage = codeMatch[1] || "";
        inCode = true;
      } else {
        flushCodeBlock();
        inCode = false;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(raw); // Keep original formatting in code
      continue;
    }

    // Heading detection
    const headingMatch = line.match(REGEX.heading);
    if (headingMatch) {
      flushParagraph();
      ensureSpace(doc, 60);

      const level = headingMatch[1].length;
      const headingText = cleanText(headingMatch[2]);
      const fontSize = Math.max(14, 28 - level * 2);

      doc
        .font("Bold")
        .fontSize(fontSize)
        .fillColor(COLORS.header)
        .text(headingText);

      if (level <= 2) {
        divider(doc);
      } else {
        doc.moveDown(0.5);
      }

      continue;
    }

    // List item detection
    const listMatch = line.match(REGEX.listItem);
    if (listMatch) {
      flushParagraph();
      ensureSpace(doc, 25);

      const listText = cleanText(listMatch[1]);
      const processedText = processInlineMarkdown(listText);

      doc
        .font("Regular")
        .fontSize(11.5)
        .fillColor(COLORS.text)
        .text(`• ${processedText}`, {
          indent: 20,
          lineGap: 4,
        });

      doc.moveDown(0.4);
      continue;
    }

    // Empty line - paragraph break
    if (line === "") {
      flushParagraph();
      continue;
    }

    // Accumulate paragraph text
    paragraph.push(line);
  }

  // Flush any remaining content
  flushParagraph();
  flushCodeBlock();
}

/* =====================================================
   COVER PAGE - ENHANCED
===================================================== */

/**
 * Create an attractive cover page
 * @param {PDFDocument} doc - PDF document
 * @param {string} title - Document title
 * @param {Object} metadata - Additional metadata
 */
function coverPage(doc, title, metadata = {}) {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  
  // Header gradient rectangle
  doc.rect(0, 0, pageWidth, 240).fill(COLORS.header);

  // Accent stripe
  doc.rect(0, 240, pageWidth, 5).fill(COLORS.accent);

  // Title
  doc
    .font("Bold")
    .fontSize(42)
    .fillColor("white")
    .text(title, 0, 80, { 
      align: "center",
      width: pageWidth,
    });

  // Subtitle
  doc
    .font("Regular")
    .fontSize(16)
    .fillColor("#CBD5F5")
    .text("AI Generated Study Notes", 0, 140, {
      align: "center",
      width: pageWidth,
    });

  // Metadata section
  if (metadata.author || metadata.date || metadata.topic) {
    doc
      .fontSize(11)
      .fillColor(COLORS.gray)
      .text(metadata.author || "ScriptSmith AI", 0, pageHeight - 120, {
        align: "center",
        width: pageWidth,
      });

    if (metadata.date) {
      doc
        .fontSize(10)
        .text(`Generated: ${metadata.date}`, 0, pageHeight - 100, {
          align: "center",
          width: pageWidth,
        });
    }
  }

  // Decorative element
  doc
    .circle(pageWidth / 2, pageHeight / 2, 80)
    .lineWidth(2)
    .strokeOpacity(0.1)
    .stroke(COLORS.accent);

  doc.addPage();
}

/* =====================================================
   TABLE OF CONTENTS - ENHANCED
===================================================== */

/**
 * Generate table of contents from markdown headings
 * @param {PDFDocument} doc - PDF document
 * @param {string} content - Markdown content
 */
function tableOfContents(doc, content) {
  sectionCard(doc, "📑 Table of Contents");

  const toc = [];
  const lines = content.split("\n");

  lines.forEach((line) => {
    const match = line.match(REGEX.heading);
    if (match) {
      const level = match[1].length;
      const text = cleanText(match[2]);
      
      if (level <= 2) { // Only include h1 and h2 for cleaner TOC
        toc.push({ level, text });
      }
    }
  });

  if (toc.length) {
    toc.forEach((item, i) => {
      const indent = (item.level - 1) * 20;
      const bullet = item.level === 1 ? "▸" : "  •";
      
      doc
        .font(item.level === 1 ? "Bold" : "Regular")
        .fontSize(item.level === 1 ? 13 : 12)
        .fillColor(COLORS.text)
        .text(`${bullet} ${item.text}`, {
          indent: indent,
          lineGap: 4,
        });
      
      doc.moveDown(0.3);
    });
  } else {
    doc
      .font("Regular")
      .fontSize(12)
      .fillColor(COLORS.gray)
      .text("• Overview");
  }

  doc.moveDown(2);
}

/* =====================================================
   REVISION POINTS - ENHANCED
===================================================== */

/**
 * Render revision points in an organized manner
 * @param {PDFDocument} doc - PDF document
 * @param {Array} points - Revision points
 */
function revisionSection(doc, points) {
  if (!points || !points.length) return;

  sectionCard(doc, "🎯 Key Revision Points", COLORS.highlight, COLORS.accent);

  points.forEach((point, i) => {
    ensureSpace(doc, 30);
    
    const text = normalize(point);
    if (!text) return;

    doc
      .font("Regular")
      .fontSize(11.5)
      .fillColor(COLORS.text);

    // Numbered point
    doc.text(`${i + 1}. ${text}`, {
      indent: 15,
      lineGap: 5,
    });

    doc.moveDown(0.5);
  });

  doc.moveDown(0.5);
}

/* =====================================================
   QUESTIONS SECTION - ENHANCED
===================================================== */

/**
 * Render short answer questions
 * @param {PDFDocument} doc - PDF document
 * @param {Array} questions - Short questions
 */
function renderShortQuestions(doc, questions) {
  if (!questions || !questions.length) return;

  sectionCard(doc, "❓ Short Answer Questions", COLORS.card, COLORS.accent);

  questions.forEach((q, i) => {
    ensureSpace(doc, 80);  // Question + answer box height
    
    const text = normalize(q);
    if (!text) return;

    doc
      .font("Bold")
      .fontSize(12)
      .fillColor(COLORS.header)
      .text(`Q${i + 1}.`, { continued: true })
      .font("Regular")
      .fontSize(11.5)
      .fillColor(COLORS.text)
      .text(` ${text}`, {
        lineGap: 5,
      });

    doc.moveDown(0.5);

    // Answer section with box
    doc
      .font("Bold")
      .fontSize(10)
      .fillColor(COLORS.accent)
      .text("Answer:", { indent: 20 });

    const answerHeight = 40;
    const x = doc.page.margins.left + 20;
    const y = doc.y + 5;  // Small gap after "Answer:"
    const width = getContentWidth(doc) - 40;
    
    doc
      .rect(x, y, width, answerHeight)
      .stroke(COLORS.divider);
    
    // Move down by answer box height + padding (using points/lineHeight conversion)
    doc.moveDown((answerHeight + 15) / doc.currentLineHeight());
  });
}

/**
 * Render long answer questions
 * @param {PDFDocument} doc - PDF document
 * @param {Array} questions - Long questions
 */
function renderLongQuestions(doc, questions) {
  if (!questions || !questions.length) return;

  sectionCard(doc, "📝 Long Answer Questions", COLORS.card, COLORS.accent);

  questions.forEach((q, i) => {
    ensureSpace(doc, 130);  // Badge + question + answer box height
    
    const text = normalize(q);
    if (!text) return;

    // Question number badge
    const badgeY = doc.y;
    doc
      .roundedRect(doc.page.margins.left, badgeY, 30, 20, 3)
      .fill(COLORS.accent);

    doc
      .font("Bold")
      .fontSize(12)
      .fillColor("white")
      .text(`Q${i + 1}`, doc.page.margins.left, badgeY + 4, {
        width: 30,
        align: "center",
      });

    // Question text
    doc
      .font("Regular")
      .fontSize(12)
      .fillColor(COLORS.text)
      .text(text, doc.page.margins.left + 40, badgeY + 2, {
        lineGap: 5,
      });

    doc.moveDown(1);

    // Answer section with larger box
    doc
      .font("Bold")
      .fontSize(10)
      .fillColor(COLORS.accent)
      .text("Answer:", { indent: 20 });
    
    const answerHeight = 80;
    const x = doc.page.margins.left + 20;
    const y = doc.y + 5;  // Small gap after "Answer:"
    const width = getContentWidth(doc) - 40;
    
    doc
      .rect(x, y, width, answerHeight)
      .stroke(COLORS.divider);
    
    // Move down by answer box height + padding (using points/lineHeight conversion)
    doc.moveDown((answerHeight + 20) / doc.currentLineHeight());
  });
}

/* =====================================================
   FOOTERS & WATERMARKS - ENHANCED
===================================================== */

/**
 * Add page numbers and footers to all pages
 * @param {PDFDocument} doc - PDF document
 * @param {string} title - Document title
 */
function addFooters(doc, title) {
  const pages = doc.bufferedPageRange();
  const shortTitle = (title.length > 30 ? title.substring(0, 27) + "..." : title);

  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);

    const footerY = doc.page.height - 40;

    // Left: Document title (skip cover page)  
    if (i > 0) {
      doc.font("Regular").fontSize(8).fillColor(COLORS.gray);
      doc.text(shortTitle, doc.page.margins.left, footerY, { lineBreak: false });
    }

    // Center: Page number
    doc.font("Regular").fontSize(9).fillColor(COLORS.text);
    const pageNum = `${i + 1} / ${pages.count}`;
    const pageNumWidth = doc.widthOfString(pageNum);
    doc.text(pageNum, (doc.page.width - pageNumWidth) / 2, footerY, { lineBreak: false });

    // Right: Watermark
    doc.font("Regular").fontSize(8).fillColor(COLORS.gray);
    const watermark = "ScriptSmith AI";
    const watermarkWidth = doc.widthOfString(watermark);
    doc.text(watermark, doc.page.width - doc.page.margins.right - watermarkWidth, footerY, { lineBreak: false });
  }
}

/* =====================================================
   PERFORMANCE MONITORING
===================================================== */

/**
 * Log performance metrics
 * @param {string} operation - Operation name
 * @param {number} startTime - Start timestamp
 */
function logPerformance(operation, startTime) {
  return;
}

/* =====================================================
   MAIN CONTROLLER - ULTRA OPTIMIZED
===================================================== */

/**
 * Generate and download PDF with AI-generated content
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const pdfDownload = async (req, res) => {
  const startTime = Date.now();
  let doc = null;

  try {
    const { result } = req.body;

    // Validation
    if (!result || typeof result !== 'object') {
      return res.status(400).json({
        success: false,
        error: "Invalid request: 'result' object is required",
      });
    }

    // Extract and sanitize data
    const title = cleanText(result.topic || result.title || "AI Generated Notes");
    const content = cleanText(result.content || result.summary || "");
    
    // Handle nested results structure from frontend
    const resultsData = result.results || result;
    const revisionPoints = resultsData.revisionPoints || result.revisionPoints || result.keyPoints || [];
    const questions = resultsData.questions || {};
    const shortQuestions = questions.short || result.shortQuestions || [];
    const longQuestions = questions.long || result.longQuestions || [];

    // Validate content
    if (!content && !revisionPoints.length && !shortQuestions.length && !longQuestions.length) {
      return res.status(400).json({
        success: false,
        error: "No content available to generate PDF",
      });
    }

    // Sanitize filename - clean and readable format
    const filename = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 100)}.pdf`;

    // Create PDF document with optimizations
    doc = new PDFDocument({
      size: "A4",
      margin: LAYOUT.margin,
      bufferPages: true,
      autoFirstPage: true,
      info: {
        Title: title,
        Author: "ScriptSmith AI",
        Subject: "AI Generated Study Notes",
        Keywords: "AI, Study Notes, Education",
        Creator: "ScriptSmith",
        Producer: "PDFKit",
        CreationDate: new Date(),
      },
      compress: true, // Enable compression for smaller file size
    });

    // Register fonts
    try {
      doc.registerFont("Regular", FONTS.regular);
      doc.registerFont("Bold", FONTS.bold);
    } catch (fontError) {
      console.error("[PDF] Font registration error:", fontError);
      throw new Error("Font loading failed");
    }

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "no-cache");

    // Pipe document to response with error handling
    doc.pipe(res);

    // Error handler for stream
    doc.on('error', (err) => {
      console.error("[PDF] Stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "PDF generation failed" });
      }
    });

    /* ===== DOCUMENT GENERATION ===== */

    // 1. Cover Page
    coverPage(doc, title, {
      author: "ScriptSmith AI",
      date: new Date().toLocaleDateString(),
      topic: title,
    });
    logPerformance("Cover page", startTime);

    // 2. Table of Contents
    if (content) {
      tableOfContents(doc, content);
    }

    // 3. Main Content  
    if (content) {
      sectionCard(doc, "📚 Overview");
      renderMarkdown(doc, content);
      logPerformance("Main content", startTime);
    }

    // 4. Revision Points
    if (revisionPoints && revisionPoints.length > 0) {
      revisionSection(doc, revisionPoints);
      logPerformance("Revision points", startTime);
    }

    // 5. Short Questions
    if (shortQuestions && shortQuestions.length > 0) {
      renderShortQuestions(doc, shortQuestions);
      logPerformance("Short questions", startTime);
    }

    // 6. Long Questions
    if (longQuestions && longQuestions.length > 0) {
      renderLongQuestions(doc, longQuestions);
      logPerformance("Long questions", startTime);
    }

    // 7. Footers (apply to all pages)
    addFooters(doc, title);

    // Finalize PDF
    doc.end();

    logPerformance("Total PDF generation", startTime);

  } catch (error) {
    console.error("[PDF] Generation error:", error);

    // Cleanup
    if (doc) {
      try {
        doc.end();
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    // Send error response if headers not sent
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: "PDF generation failed",
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    } else {
      res.end();
    }
  }
};

/* =====================================================
   EXPORTS
===================================================== */


module.exports = { 
  pdfDownload,
  // Export utilities for testing
  cleanText,
  normalize,
  memoize,
};

