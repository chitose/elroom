
// This file is auto-generated, don't modify it manually or your changes will be lost.

import { AppUser } from './appUser';
import { Group } from './group';


export interface Invitations {
  userId: number;
  groupId: number;
  id: number;
user?: AppUser;
group?: Group;
groupName?: string;
groupRowVersion?: number[];
creationDate?: Date;
modificationDate?: Date;
rowVersion?: number[];
}
