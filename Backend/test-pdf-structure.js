const { pdfDownload } = require('./src/controllers/pdf.controller');
const fs = require('fs');
const { Writable } = require('stream');

// Mock request/response matching frontend structure
const mockReq = {
  body: {
    result: {
      topic: "Python Programming",
      content: `# Introduction to Python
Python is a high-level, interpreted programming language.

## Key Features
- Easy to learn syntax
- Dynamically typed
- Large standard library

\`\`\`python
def hello_world():
    print("Hello, World!")
\`\`\`

## Data Types
Python supports various data types including integers, floats, strings, and more.`,
      results: {
        revisionPoints: [
          "Python is an interpreted language",
          "Uses indentation for code blocks",
          "Supports multiple programming paradigms",
          "Has a rich ecosystem of libraries"
        ],
        questions: {
          short: [
            "What is Python?",
            "Name three data types in Python",
            "What is a function in Python?",
            "Explain Python's indentation rules"
          ],
          long: [
            "Explain the difference between lists and tuples in Python with examples",
            "Describe object-oriented programming concepts in Python",
            "What are decorators and how are they used?"
          ]
        }
      }
    }
  }
};

const chunks = [];
const writeStream = fs.createWriteStream('test-structure.pdf');

const mockRes = writeStream;
mockRes.setHeader = () => {};
mockRes.headersSent = false;
mockRes.status = (code) => mockRes;
mockRes.json = (data) => console.error('Error:', data);
pdfDownload(mockReq, mockRes);
