import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const PERSPECTIVE_API_KEY = process.env.PERSPECTIVE_API_KEY;

export type AIAnalysis = {
  toxic: boolean;
  reason: string;
  alertParent: boolean;
  score?: number;
  scoreChange?: number;
  sentiment: 'חיובי' | 'נייטרלי' | 'שלילי';
};

// טיפוס לתגובה של Perspective API (רלוונטי לחלק attributeScores)
type AttributeScores = {
  [key: string]: {
    summaryScore: {
      value: number;
    };
  };
};

type PerspectiveResponse = {
  attributeScores: AttributeScores;
};

function getToxicityScore(attributes: AttributeScores | undefined): number {
  if (!attributes) return 0;
  return attributes.TOXICITY?.summaryScore?.value ?? 0;
}

function determineSentiment(score: number): 'חיובי' | 'נייטרלי' | 'שלילי' {
  if (score > 0.6) return 'שלילי';
  if (score < 0.4) return 'חיובי';
  return 'נייטרלי';
}

export async function analyzeMessageHebrew(message: string): Promise<AIAnalysis> {
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

    const res = await axios.post<PerspectiveResponse>(url, data);

    const attributes = res.data.attributeScores;
    const toxicityScore = getToxicityScore(attributes);
    const alertThreshold = 0.7;

    const toxic = toxicityScore >= alertThreshold;
    let reason = '';

    if (toxic) {
      const reasons: string[] = [];
      for (const attr of ['TOXICITY', 'INSULT', 'PROFANITY', 'SEXUALLY_EXPLICIT', 'THREAT']) {
        if (attributes[attr]?.summaryScore?.value >= alertThreshold) {
          reasons.push(attr.toLowerCase());
        }
      }
      reason = 'הודעה מכילה: ' + reasons.join(', ');
    }

    return {
      toxic,
      reason,
      alertParent: toxic,
      score: toxicityScore,
      scoreChange: toxic ? -10 : 1,
      sentiment: determineSentiment(toxicityScore),
    };
  } catch (error: any) {
    console.error('Perspective API Error:', error.message || error);
    return {
      toxic: false,
      reason: '',
      alertParent: false,
      sentiment: 'נייטרלי',
    };
  }
}
