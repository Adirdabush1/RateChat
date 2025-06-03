import axios from 'axios';

type AnalysisResult = {
  score: number;
  toxic: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
  alertParent: boolean;
  scoreChange: number;
  reason?: string;
};

const dangerousKeywords = [
  'בא לי למות',
  'שונא את עצמי',
  'אני בודד',
  'אתה מת',
  'אף אחד לא אוהב אותי',
  'אני חותך',
];

const PERSPECTIVE_API_KEY = '122';
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

  const foundDangerous = dangerousKeywords.find(word => lower.includes(word));

  let toxicScore = 0;
  try {
    const response = await axios.post<PerspectiveResponse>(PERSPECTIVE_URL, {
      comment: { text: message },
      language: 'he', 
      requestedAttributes: { TOXICITY: {} },
    });

    toxicScore = response.data.attributeScores.TOXICITY.summaryScore.value;
  } catch (error: any) {
    console.error('Perspective API failed:', error.response?.data || error.message);
  }

  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (lower.includes('תודה') || lower.includes('כל הכבוד') || lower.includes('אהבתי')) {
    sentiment = 'positive';
  } else if (lower.includes('שונא') || lower.includes('דביל') || lower.includes('מטומטם')) {
    sentiment = 'negative';
  }

  const toxic = toxicScore > 0.75;
  const alertParent = toxic || !!foundDangerous;
  let scoreChange = 0;

  if (alertParent) {
    scoreChange = -2;
  } else if (sentiment === 'positive') {
    scoreChange = +1;
  }

  
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
