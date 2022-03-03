import { DiscussionAnswer } from "./discussion-answer";

export interface DiscussionQuestion {
    id?: string;
    question: string;
    questionSubject: string;
    questionTags: string[];
    questionAskedBy: string;
    questionAskedByUsername: string;
    questionAskedByImage: string | undefined;
    questionAskedDate: Date;
    questionUpVotesCount: number;
    questionDownVotesCount: number;
    allAnswers: Array<DiscussionAnswer>;
}
