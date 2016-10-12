
// This file is auto-generated, don't modify it manually or your changes will be lost.

import { UserGroup } from './userGroup';
import { Post } from './post';
import { Invitations } from './invitations';


export interface Group {
  ownerId: number;
  name: string;
  private: boolean;
  description: string;
  userGroups: UserGroup[];
  posts: Post[];
  invitations: Invitations[];
  id: number;
image?: number[];
hasImage?: boolean;
uploadImage?: string;
creationDate?: Date;
modificationDate?: Date;
rowVersion?: number[];
}
