
import { TestReportQuestion } from "./testReportQuestion";

export interface Tests { 
    testId: string;
    testQuestions: Array<TestReportQuestion>;
    testTakenDate: Date;
    testName: string | undefined;
    testTakenBy: string | undefined;
    testType: string | undefined;
  }