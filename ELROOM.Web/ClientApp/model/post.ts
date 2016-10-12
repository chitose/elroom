
// This file is auto-generated, don't modify it manually or your changes will be lost.

import { Reaction } from './reaction';
import { UserPost } from './userPost';
import { PollOption } from './pollOption';
import { Comment } from './comment';
import { AppUser } from './appUser';
import { Group } from './group';


export interface Post {
  title: string;
  content: string;
  groupId: number;
  ownerId: number;
  pollStart: Date;
  pollEnd: Date;
  reactions: Reaction[];
  userPosts: UserPost[];
  pollOptions: PollOption[];
  id: number;
image?: number[];
hasImage?: string;
lastCommentDate?: Date;
comments?: Comment[];
hasPoll?: boolean;
pollable?: boolean;
uploadImage?: string;
postPollOptions?: string;
owner?: AppUser;
group?: Group;
creationDate?: Date;
modificationDate?: Date;
rowVersion?: number[];
}
