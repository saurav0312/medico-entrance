export interface NewDiscussionQuestion {
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
    isUpVotedByCurrentLoggedInUser: boolean;
    isDownVotedByCurrentLoggedInUser: boolean;
}
