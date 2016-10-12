
// This file is auto-generated, don't modify it manually or your changes will be lost.

import { AppUser } from './appUser';
import { Group } from './group';


export interface UserGroup {
  userId: number;
  groupId: number;
  favorite: boolean;
  id: number;
user?: AppUser;
group?: Group;
creationDate?: Date;
modificationDate?: Date;
rowVersion?: number[];
}
