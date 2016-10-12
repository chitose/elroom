
// This file is auto-generated, don't modify it manually or your changes will be lost.
import { ReactionType } from './enums';


export interface Reaction {
  postId: number;
  commentId: number;
  ownerId: number;
  type: ReactionType;
  id: number;
creationDate?: Date;
modificationDate?: Date;
rowVersion?: number[];
}
