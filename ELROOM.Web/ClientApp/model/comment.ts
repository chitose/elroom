
// This file is auto-generated, don't modify it manually or your changes will be lost.

import { AppUser } from './appUser';


export interface Comment {
  ownerId: number;
  postId: number;
  sticker: string;
  content: string;
  uploadImage: string;
  id: number;
image?: number[];
hasImage?: boolean;
owner?: AppUser;
creationDate?: Date;
modificationDate?: Date;
rowVersion?: number[];
}
