const Gemini_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent"
const JSON5 = require('json5');

// Try to extract a valid JSON object from a string by finding the first
// opening brace and matching it to its corresponding closing brace.
const extractJsonObject = (text) => {
    const start = text.indexOf('{');
    if (start === -1) return null;
    let depth = 0;
    for (let i = start; i < text.length; i++) {
        const ch = text[i];
        if (ch === '{') depth++;
        else if (ch === '}') depth--;
        if (depth === 0) return text.slice(start, i + 1);
    }
    return null;
}

// Attempt to sanitize common JSON formatting issues produced by LLMs:
// - smart quotes → normal quotes
// - trailing commas before } or ]
// - simple unquoted keys (best-effort)
const sanitizeJsonString = (s) => {
    if (!s || typeof s !== 'string') return s;
    let out = s;

    // Normalize smart quotes
    out = out.replace(/[\u2018\u2019\u201A\u201B]/g, "'")
                     .replace(/[\u201C\u201D\u201E\u201F]/g, '"');

    // Remove common leading/trailing text markers
    out = out.replace(/^\s*Result:\s*/i, '');

    // Remove code fences
    out = out.replace(/```[a-zA-Z]*\n?/g, '')
                     .replace(/\n```/g, '');

    // Replace single-quoted JSON values with double quotes (naive)
    out = out.replace(/'([^']*)'/g, '"$1"');

    // Quote unquoted object keys: { key:  -> {"key":
    out = out.replace(/([\{,\s])([A-Za-z0-9_@\$\-]+)\s*:/g, '$1"$2":');

    // Remove trailing commas before } or ]
    out = out.replace(/,\s*(\}|\])/g, '$1');

    return out.trim();
}

const generateGeminiResult = async (prompt) => {
    // Flexible JSON parsing: try strict JSON, then JSON5 (supports single quotes, unquoted keys, trailing commas)
    const tryParseFlexible = (str) => {
        if (!str || typeof str !== 'string') throw new Error('No string to parse');
        try {
            return JSON.parse(str);
        } catch (e1) {
            try {
                return JSON5.parse(str);
            } catch (e2) {
                const err = new Error('Flexible parse failed');
                err.primary = e1;
                err.secondary = e2;
                throw err;
            }
        }
    };

    // retry logic for transient Gemini errors (e.g., 503)
    const maxRetries = 2;
    let attempt = 0;
    let response;

    while (attempt <= maxRetries) {
        try {
            response = await fetch(`${Gemini_URL}?key=${process.env.GEMINI_API_KEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            });

            if (response.ok) break;

            // if service unavailable, retry with backoff
            const status = response.status;
            const text = await response.text();
            if ((status === 503 || status === 429) && attempt < maxRetries) {
                const waitMs = 1000 * Math.pow(2, attempt); // 1s, 2s
                await new Promise(r => setTimeout(r, waitMs));
                attempt++;
                continue;
            }

            throw new Error(`Gemini API error: ${status} - ${text}`);
        } catch (err) {
            if (attempt < maxRetries) {
                const waitMs = 1000 * Math.pow(2, attempt);
                await new Promise(r => setTimeout(r, waitMs));
                attempt++;
                continue;
            }
            console.error('Final fetch error:', err);
            throw err;
        }
    }

    if (!response) throw new Error('No response from Gemini API');

    // parse body as json (the response may include rich structure)
    const data = await response.json();

    // Support a couple of response shapes that Gemini may return.
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        || data.output?.[0]?.content?.[0]?.text
        || '';

    if (!text) {
        throw new Error("Gemini API error: No text content in response");
    }

    const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    // First try parsing the whole cleaned text using flexible parser
    try {
        return tryParseFlexible(cleanedText);
    } catch (err) {
        // attempt to extract a JSON object snippet and parse that
        const jsonSnippet = extractJsonObject(cleanedText);
        if (jsonSnippet) {
            try {
                return tryParseFlexible(jsonSnippet);
            } catch (err2) {
                console.error('Failed to parse extracted JSON snippet:', err2);
                // try sanitizing and parse again with flexible parser
                try {
                    const sanitized = sanitizeJsonString(jsonSnippet);
                    return tryParseFlexible(sanitized);
                } catch (err3) {
                    console.error('Failed to parse sanitized JSON snippet:', err3);
                    console.error('Sanitized snippet (first 2000 chars):', sanitizeJsonString(jsonSnippet).slice(0, 2000));
                }
            }
        }

        return cleanedText;
    }
}

module.exports = { generateGeminiResult }