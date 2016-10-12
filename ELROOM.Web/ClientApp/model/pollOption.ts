
// This file is auto-generated, don't modify it manually or your changes will be lost.

import { Post } from './post';
import { PollVote } from './pollVote';


export interface PollOption {
  content: string;
  postId: number;
  pollVotes: PollVote[];
  id: number;
post?: Post;
creationDate?: Date;
modificationDate?: Date;
rowVersion?: number[];
}
