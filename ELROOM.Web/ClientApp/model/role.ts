
// This file is auto-generated, don't modify it manually or your changes will be lost.

import { AppUser } from './appUser';
import { RoleRight } from './roleRight';


export interface Role {
  remarks: string;
  creationDate: Date;
  modificationDate: Date;
  rowVersion: number[];
  id: number;
  name: string;
  rights: RoleRight[];
users?: AppUser[];
}
