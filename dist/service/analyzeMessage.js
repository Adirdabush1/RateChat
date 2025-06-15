"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeMessageEnglish = analyzeMessageEnglish;
const axios_1 = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const PERSPECTIVE_API_KEY = process.env.PERSPECTIVE_API_KEY;
function getToxicityScore(attributes) {
    if (!attributes)
        return 0;
    return attributes.TOXICITY?.summaryScore?.value ?? 0;
}
function determineSentiment(score) {
    if (score > 0.6)
        return 'negative';
    if (score < 0.4)
        return 'positive';
    return 'neutral';
}
async function analyzeMessageEnglish(message) {
    try {
        const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${PERSPECTIVE_API_KEY}`;
        const data = {
            comment: { text: message },
            languages: ['en'],
            requestedAttributes: {
                TOXICITY: {},
                INSULT: {},
                PROFANITY: {},
                SEXUALLY_EXPLICIT: {},
                THREAT: {},
            },
            doNotStore: true,
        };
        const res = await axios_1.default.post(url, data);
        const attributes = res.data.attributeScores;
        const toxicityScore = getToxicityScore(attributes);
        const alertThreshold = 0.7;
        const toxic = toxicityScore >= alertThreshold;
        let reason = '';
        if (toxic) {
            const reasons = [];
            for (const attr of ['TOXICITY', 'INSULT', 'PROFANITY', 'SEXUALLY_EXPLICIT', 'THREAT']) {
                if (attributes[attr]?.summaryScore?.value >= alertThreshold) {
                    reasons.push(attr.toLowerCase());
                }
            }
            reason = 'Message contains: ' + reasons.join(', ');
        }
        return {
            toxic,
            reason,
            alertParent: toxic,
            score: toxicityScore,
            scoreChange: toxic ? -10 : 1,
            sentiment: determineSentiment(toxicityScore),
        };
    }
    catch (error) {
        console.error('Perspective API Error:', error.message || error);
        return {
            toxic: false,
            reason: '',
            alertParent: false,
            sentiment: 'neutral',
        };
    }
}
//# sourceMappingURL=analyzeMessage.js.map