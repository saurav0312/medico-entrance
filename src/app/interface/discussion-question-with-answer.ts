import { DiscussionAnswer } from "./discussion-answer";
import { DownVotedBy } from "./down-voted-by";
import { NewDiscussionQuestion } from "./new-discussion-question";
import { UpVotedBy } from "./up-voted-by";

export interface DiscussionQuestionWithAnswer {
    discussionQuestion: NewDiscussionQuestion;
    allAnswers: DiscussionAnswer[];
    upVotedBy: UpVotedBy[];
    downVotedBy: DownVotedBy[];
}
