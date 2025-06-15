export type AIAnalysis = {
    toxic: boolean;
    reason: string;
    alertParent: boolean;
    score?: number;
    scoreChange?: number;
    sentiment: 'positive' | 'neutral' | 'negative';
};
export declare function analyzeMessageEnglish(message: string): Promise<AIAnalysis>;
