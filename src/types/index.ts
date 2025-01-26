export type User = {
  id: string;
  email: string;
  name: string;
  role: 'organizer' | 'participant' | 'judge';
};

export type Room = {
  id: string;
  key: string;
  name: string;
  createdAt: string;
  createdBy: string;
  isActive: boolean;
  settings: {
    languages: string[];
    timeLimit: number;
    maxParticipants: number;
  };
};

export type Problem = {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  initialCode: string;
  solution: string;
  testCases: {
    input: string;
    output: string;
  }[];
  plantedErrors: {
    line: number;
    description: string;
  }[];
};

export type Submission = {
  id: string;
  participantId: string;
  problemId: string;
  code: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  errorsFound: {
    line: number;
    description: string;
  }[];
  performanceMetrics: {
    timeSpent: number;
    memoryUsed: number;
    score: number;
  };
};