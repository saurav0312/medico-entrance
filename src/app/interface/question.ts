export interface Question { 
    question: string; 
    options: Array<any>;
    correctAnswer: any;
    subjectTags?: Array<any>;
    topicTags?: Array<any>;
    selectedOption?: any;
    answered?: boolean;
    totalTimeSpent: number;
  }