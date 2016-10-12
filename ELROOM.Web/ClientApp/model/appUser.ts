
// This file is auto-generated, don't modify it manually or your changes will be lost.

import { UserGroup } from './userGroup';
import { UserPost } from './userPost';
import { Invitations } from './invitations';
import { NotificationUser } from './notificationUser';
import { Role } from './role';


export interface AppUser {
  options: string;
  creationDate: Date;
  modificationDate: Date;
  rowVersion: number[];
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  roleId: number;
  role: Role;
  email: string;
  passwordHash: string;
  securityStamp: string;
  phone: string;
  lockoutEnd: Date;
  lockoutEnabled: boolean;
  accessFailedCount: number;
avatar?: number[];
displayName?: string;
userGroups?: UserGroup[];
userPosts?: UserPost[];
invitations?: Invitations[];
notificationUsers?: NotificationUser[];
}
