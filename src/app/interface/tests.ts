
import { TestReportQuestion } from "./testReportQuestion";

export interface Tests { 
    testId: string;
    testQuestions: Array<TestReportQuestion>;
    testTakenDate: Date;
  }