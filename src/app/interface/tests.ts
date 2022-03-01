
import { TestReportQuestion } from "./testReportQuestion";

export interface Tests { 
    testId: string;
    testQuestions: Array<TestReportQuestion>;
    testTakenDate: Date | undefined;
    testName: string ;
    testTakenBy: string;
    testType: string;
    testCategory: string;
    subjectName: string;
    topicName: string;
  }