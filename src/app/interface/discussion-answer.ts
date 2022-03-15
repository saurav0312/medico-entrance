export interface DiscussionAnswer {
    answer: string;
    answeredBy: string;
    answeredByUsername: string;
    answeredOn: Date;
    answerUpVotesCount: number;
    answerDownVotesCount: number;
    upVotedBy: string[];
    downVotedBy: string[];
    isUpVotedByCurrentLoggedInUser: boolean;
    isDownVotedByCurrentLoggedInUser: boolean;
}

