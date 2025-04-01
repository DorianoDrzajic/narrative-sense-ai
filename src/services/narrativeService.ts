
import { toast } from "sonner";

// Types for the narrative detection system
export interface Narrative {
  id: string;
  name: string;
  description: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  strength: number; // 0-100
  category: 'ai' | 'recession' | 'inflation' | 'growth' | 'other';
  date: string;
  relatedStocks: string[];
  sources: string[];
}

export interface NarrativeTimepoint {
  date: string;
  narratives: { [key: string]: number }; // narrative name -> strength
}

export interface NarrativeTrend {
  narrativeId: string;
  name: string;
  category: 'ai' | 'recession' | 'inflation' | 'growth' | 'other';
  dataPoints: { date: string; strength: number }[];
}

// Demo data for development purposes
const DEMO_NARRATIVES: Narrative[] = [
  {
    id: 'n1',
    name: 'AI Investment Boom',
    description: 'Increasing focus on artificial intelligence as a major investment theme across sectors.',
    sentiment: 'positive',
    strength: 85,
    category: 'ai',
    date: '2023-07-15',
    relatedStocks: ['NVDA', 'MSFT', 'GOOG', 'META'],
    sources: ['Earnings Calls', 'SEC Filings', 'News Articles']
  },
  {
    id: 'n2',
    name: 'Recession Concerns',
    description: 'Growing concerns about economic slowdown and potential recession in the coming quarters.',
    sentiment: 'negative',
    strength: 62,
    category: 'recession',
    date: '2023-08-01',
    relatedStocks: ['XLF', 'KRE', 'XLY', 'HD'],
    sources: ['Federal Reserve Statements', 'Economic Indicators', 'Market Commentary']
  },
  {
    id: 'n3',
    name: 'Inflation Pressures Easing',
    description: 'Signs that inflation may be moderating, leading to potential shifts in monetary policy.',
    sentiment: 'positive',
    strength: 71,
    category: 'inflation',
    date: '2023-09-10',
    relatedStocks: ['TLT', 'GLD', 'XLU', 'TIPS'],
    sources: ['CPI Reports', 'Federal Reserve Minutes', 'Market Data']
  },
  {
    id: 'n4',
    name: 'Supply Chain Improvements',
    description: 'Gradual resolution of global supply chain issues affecting manufacturing and retail sectors.',
    sentiment: 'positive',
    strength: 58,
    category: 'growth',
    date: '2023-10-05',
    relatedStocks: ['FDX', 'UPS', 'AMZN', 'WMT'],
    sources: ['Earnings Reports', 'Industry Analyses', 'Economic Data']
  },
  {
    id: 'n5',
    name: 'Tech Sector Layoffs',
    description: 'Increasing number of layoffs and hiring freezes across major technology companies.',
    sentiment: 'negative',
    strength: 76,
    category: 'other',
    date: '2023-11-20',
    relatedStocks: ['META', 'AMZN', 'GOOG', 'CRM'],
    sources: ['Company Announcements', 'News Articles', 'Industry Reports']
  }
];

// Generate time series data for demo purposes
const generateTimeSeriesData = (): NarrativeTimepoint[] => {
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2023-12-31');
  const timepoints: NarrativeTimepoint[] = [];
  
  // Narrative strength evolution patterns
  const patterns = {
    'AI Investment Boom': { start: 30, end: 85, peak: 90, peakMonth: 7 },
    'Recession Concerns': { start: 45, end: 62, peak: 75, peakMonth: 5 },
    'Inflation Pressures Easing': { start: 20, end: 71, peak: 71, peakMonth: 9 },
    'Supply Chain Improvements': { start: 15, end: 58, peak: 65, peakMonth: 8 },
    'Tech Sector Layoffs': { start: 10, end: 76, peak: 80, peakMonth: 11 }
  };
  
  // Generate monthly data
  for (let month = 0; month < 12; month++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(startDate.getMonth() + month);
    
    const narrativeStrengths: { [key: string]: number } = {};
    
    Object.entries(patterns).forEach(([name, pattern]) => {
      let strength;
      if (month < pattern.peakMonth) {
        // Rising phase
        strength = pattern.start + (pattern.peak - pattern.start) * (month / pattern.peakMonth);
      } else {
        // Falling or stabilizing phase
        const remainingMonths = 11 - pattern.peakMonth;
        const monthsAfterPeak = month - pattern.peakMonth;
        strength = pattern.peak + (pattern.end - pattern.peak) * (monthsAfterPeak / remainingMonths);
      }
      
      // Add some random noise
      strength = Math.max(0, Math.min(100, strength + (Math.random() * 10 - 5)));
      narrativeStrengths[name] = Math.round(strength);
    });
    
    timepoints.push({
      date: currentDate.toISOString().split('T')[0],
      narratives: narrativeStrengths
    });
  }
  
  return timepoints;
};

const TIME_SERIES_DATA = generateTimeSeriesData();

// Extract narrative trends from time series data
const extractNarrativeTrends = (): NarrativeTrend[] => {
  const narrativeMap = DEMO_NARRATIVES.reduce((acc, narrative) => {
    acc[narrative.name] = {
      narrativeId: narrative.id,
      name: narrative.name,
      category: narrative.category,
      dataPoints: []
    };
    return acc;
  }, {} as Record<string, NarrativeTrend>);
  
  TIME_SERIES_DATA.forEach(timepoint => {
    Object.entries(timepoint.narratives).forEach(([name, strength]) => {
      if (narrativeMap[name]) {
        narrativeMap[name].dataPoints.push({
          date: timepoint.date,
          strength
        });
      }
    });
  });
  
  return Object.values(narrativeMap);
};

const NARRATIVE_TRENDS = extractNarrativeTrends();

// API mock functions
export const getNarratives = async (): Promise<Narrative[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DEMO_NARRATIVES);
    }, 800);
  });
};

export const getNarrativeTrends = async (): Promise<NarrativeTrend[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(NARRATIVE_TRENDS);
    }, 800);
  });
};

export const getTimeSeriesData = async (): Promise<NarrativeTimepoint[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(TIME_SERIES_DATA);
    }, 800);
  });
};

interface AIAnalysisInput {
  text: string;
  apiKey: string;
}

interface AIAnalysisResult {
  narratives: {
    name: string;
    description: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    relevantSentences: string[];
  }[];
  summary: string;
}

export const analyzeTextWithAI = async ({ text, apiKey }: AIAnalysisInput): Promise<AIAnalysisResult> => {
  if (!text) {
    throw new Error('Text is required for analysis');
  }
  
  if (!apiKey) {
    throw new Error('API key is required for AI analysis');
  }
  
  try {
    toast.loading('Analyzing text with AI...');
    
    // In a real application, this would be a call to the Perplexity API
    // For demo purposes, we're returning mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        toast.dismiss();
        toast.success('Analysis complete');
        
        resolve({
          narratives: [
            {
              name: 'AI Investment Trend',
              description: 'The text indicates a strong focus on AI investments across multiple sectors.',
              sentiment: 'positive',
              confidence: 0.87,
              relevantSentences: [
                'Companies are increasingly allocating budget to AI initiatives.',
                'Investors are showing preference for stocks with strong AI capabilities.'
              ]
            },
            {
              name: 'Economic Uncertainty',
              description: 'There are mentions of economic uncertainty affecting long-term planning.',
              sentiment: 'negative',
              confidence: 0.71,
              relevantSentences: [
                'CFOs cite economic conditions as a major concern for upcoming quarters.',
                'Several firms are delaying capital expenditures due to uncertainty.'
              ]
            }
          ],
          summary: 'The analyzed text reveals two primary narratives: a positive sentiment toward AI investments and negative sentiment regarding economic uncertainty. The AI narrative appears dominant, suggesting continued capital flows into AI-focused equities despite broader market concerns.'
        });
      }, 2000);
    });
  } catch (error) {
    toast.dismiss();
    toast.error('Failed to analyze text');
    throw error;
  }
};
