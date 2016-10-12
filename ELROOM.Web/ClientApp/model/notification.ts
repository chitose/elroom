
// This file is auto-generated, don't modify it manually or your changes will be lost.

import { AppUser } from './appUser';
import { Post } from './post';


export interface Notification {
  authorId: number;
  postId: number;
  content: string;
  id: number;
  creationDate: Date;
  modificationDate: Date;
  rowVersion: number[];
author?: AppUser;
post?: Post;
}
