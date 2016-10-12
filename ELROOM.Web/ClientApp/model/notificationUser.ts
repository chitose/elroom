
// This file is auto-generated, don't modify it manually or your changes will be lost.

import { AppUser } from './appUser';
import { Notification } from './notification';


export interface NotificationUser {
  notificationId: number;
  userId: number;
  isNew: boolean;
  isRead: boolean;
  id: number;
user?: AppUser;
notification?: Notification;
creationDate?: Date;
modificationDate?: Date;
rowVersion?: number[];
}
