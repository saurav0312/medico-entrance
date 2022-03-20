import { DownVotedBy } from "./down-voted-by";
import { UpVotedBy } from "./up-voted-by";

export interface DiscussionAnswer {
    id?: string;
    answer: string;
    answeredBy: string;
    answeredByUsername: string;
    answeredOn: Date;
    answerUpVotesCount: number;
    answerDownVotesCount: number;
    upVotedBy: UpVotedBy[];
    downVotedBy: DownVotedBy[];
    isUpVotedByCurrentLoggedInUser: boolean;
    isDownVotedByCurrentLoggedInUser: boolean;
}

