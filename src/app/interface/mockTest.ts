import { Question } from "./question";

export interface MockTest {
  id?: string | undefined;
  testName : string; 
  testTakenBy : string;
  totalTime : number;
  totalNumberOfQuestions? : number;
  testType: string;
  questions: Question[];
  isBought?: boolean;
  testPrice?: number;
  teacherUserId?: string | undefined;
  testUploadDate: Date;
}