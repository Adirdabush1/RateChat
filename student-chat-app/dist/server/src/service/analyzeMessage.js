"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeMessageEnglish = analyzeMessageEnglish;
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
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