
// Auto generated by typewriter from c# code. Update coresponding c# code to re-generate this file.
import {HttpClientAPI} from '../components/httpClientProvider';

import {Group} from '../model/group';
import {UserGroup} from '../model/userGroup';
import {AppUser} from '../model/appUser';
import {UserPost} from '../model/userPost';
import {Invitations} from '../model/invitations';
import {Post} from '../model/post';
import {Reaction} from '../model/reaction';
import {PollOption} from '../model/pollOption';
import {PollVote} from '../model/pollVote';
import {Comment} from '../model/comment';
import {GroupDataResponse} from '../model/groupDataResponse';
import { ReactionType } from '../model/enums';

export function get_loadGroup_URL(id: number) {
  return `/api/group/loadGroup${id}`;
}export function get_getFullImage_URL(id: number) {
  return `/api/group/getFullImage${id}`;
}export function get_getThumb_URL(id: number) {
  return `/api/group/getThumb${id}`;
}export function get_getGroupUser_URL(id: number) {
  return `/api/group/getGroupUsers${id}`;
}export function get_getOtherUsers_URL(id: number) {
  return `/api/group/getOthersUsers${id}`;
}export function get_getUserGroupData_URL(currentGroupType: string, currentGroupCount: number) {
  return `/api/group/getUserGroupData{currentGroupType,currentGroupCount}?currentGroupType=${currentGroupType}&currentGroupCount=${currentGroupCount}`;
}export function get_getGroupPosts_URL(groupId: number) {
  return `/api/group/getGroupPosts${groupId}`;
}
export function loadGroup(api: HttpClientAPI,id: number) {
  return api.http<Group>(`/api/group/loadGroup${id}`, { method: 'get'  });
}
export function updateGroup(api: HttpClientAPI,groupRequest: Group) {
  return api.http<Group>(`/api/group/updateGroup`, { method: 'post' , body: JSON.stringify(groupRequest) });
}
export function deleteGroup(api: HttpClientAPI,group: Group) {
  return api.http<boolean>(`/api/group/deleteGroup`, { method: 'post' , body: JSON.stringify(group) });
}
export function getFullImage(api: HttpClientAPI,id: number) {
  return api.http<any>(`/api/group/getFullImage${id}`, { method: 'get'  });
}
export function getThumb(api: HttpClientAPI,id: number) {
  return api.http<any>(`/api/group/getThumb${id}`, { method: 'get'  });
}
export function followGroup(api: HttpClientAPI,group: Group) {
  return api.http<Group>(`/api/group/followGroup`, { method: 'post' , body: JSON.stringify(group) });
}
export function unfollowGroup(api: HttpClientAPI,group: Group) {
  return api.http<Group>(`/api/group/unfollowGroup`, { method: 'post' , body: JSON.stringify(group) });
}
export function favorGroup(api: HttpClientAPI,group: Group) {
  return api.http<Group>(`/api/group/favorGroup`, { method: 'post' , body: JSON.stringify(group) });
}
export function unFavorGroup(api: HttpClientAPI,group: Group) {
  return api.http<Group>(`/api/group/unfavorGroup`, { method: 'post' , body: JSON.stringify(group) });
}
export function getGroupUser(api: HttpClientAPI,id: number) {
  return api.http<AppUser[]>(`/api/group/getGroupUsers${id}`, { method: 'get'  });
}
export function getOtherUsers(api: HttpClientAPI,id: number) {
  return api.http<AppUser[]>(`/api/group/getOthersUsers${id}`, { method: 'get'  });
}
export function getUserGroupData(api: HttpClientAPI,currentGroupType: string, currentGroupCount: number) {
  return api.http<GroupDataResponse>(`/api/group/getUserGroupData{currentGroupType,currentGroupCount}?currentGroupType=${currentGroupType}&currentGroupCount=${currentGroupCount}`, { method: 'get'  });
}
export function getGroupPosts(api: HttpClientAPI,groupId: number) {
  return api.http<Post[]>(`/api/group/getGroupPosts${groupId}`, { method: 'get'  });
}
export function deleteGroupUser(api: HttpClientAPI,userId: number, group: Group) {
  return api.http<AppUser[]>(`/api/group/deleteGroupUser?userId=${userId}`, { method: 'post' , body: JSON.stringify(group) });
}
export function inviteUser(api: HttpClientAPI,userId: number, groupId: number) {
  return api.http<void>(`/api/group/inviteUser?userId=${userId}&groupId=${groupId}`, { method: 'post'  });
}
export function addGroupUser(api: HttpClientAPI,user: AppUser, group: Group) {
  return api.http<AppUser>(`/api/group/addGroupUser`, { method: 'post' , body: JSON.stringify(user) });
}
