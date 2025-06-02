import axios from 'axios';

type AnalysisResult = {
  score: number;
  toxic: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
  alertParent: boolean;
  scoreChange: number;
  reason?: string;
};

// מילים חריגות (תוכל להרחיב בהמשך)
const dangerousKeywords = [
  'בא לי למות',
  'שונא את עצמי',
  'אני בודד',
  'אתה מת',
  'אף אחד לא אוהב אותי',
  'אני חותך',
];

// Perspective API KEY שלך
const PERSPECTIVE_API_KEY = 'AIzaSyC6J_S6lU9PO0rx3yYfCEUjqRRBNnaRycQ';
const PERSPECTIVE_URL = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${PERSPECTIVE_API_KEY}`;

type PerspectiveResponse = {
  attributeScores: {
    TOXICITY: {
      summaryScore: {
        value: number;
      };
    };
  };
};

export async function analyzeMessage(message: string): Promise<AnalysisResult> {
  const lower = message.toLowerCase();

  // בדיקת מילים מסוכנות
  const foundDangerous = dangerousKeywords.find(word => lower.includes(word));

  // בדיקת טוקסיות
  let toxicScore = 0;
  try {
    const response = await axios.post<PerspectiveResponse>(PERSPECTIVE_URL, {
      comment: { text: message },
      language: 'he', // שים רק שפה אחת
      requestedAttributes: { TOXICITY: {} },
    });

    toxicScore = response.data.attributeScores.TOXICITY.summaryScore.value;
  } catch (error: any) {
    console.error('Perspective API failed:', error.response?.data || error.message);
  }

  // בדיקת רגש בסיסית (פשוטה בינתיים)
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (lower.includes('תודה') || lower.includes('כל הכבוד') || lower.includes('אהבתי')) {
    sentiment = 'positive';
  } else if (lower.includes('שונא') || lower.includes('דביל') || lower.includes('מטומטם')) {
    sentiment = 'negative';
  }

  // קבלת החלטות
  const toxic = toxicScore > 0.75;
  const alertParent = toxic || !!foundDangerous;
  let scoreChange = 0;

  if (alertParent) {
    scoreChange = -2;
  } else if (sentiment === 'positive') {
    scoreChange = +1;
  }

  // הגדרת score כאן, לדוגמה: ניקוד כללי מחושב לפי toxicScore * 100 פחות שינויים
  const score = Math.round(toxicScore * 100) + scoreChange;

  return {
    toxic,
    score,
    sentiment,
    alertParent,
    scoreChange,
    reason: foundDangerous || (toxic ? 'טוקסיות גבוהה' : undefined),
  };
}
