export interface Question { 
    question: string; 
    options: Array<any>;
    correctAnswer: any;
    selectedOption?: any;
    answered?: boolean;
  }