export interface TestReportQuestion{
    question: string;
    selectedOption: any;
    options: Array<any>;
    correctAnswer: any;
    subjectTags?: Array<any>;
    topicTags?: Array<any>;
    totalTimeSpent?: number;
}