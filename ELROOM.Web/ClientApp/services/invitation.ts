
// Auto generated by typewriter from c# code. Update coresponding c# code to re-generate this file.
import {HttpClientAPI} from '../components/httpClientProvider';

import {Invitations} from '../model/invitations';
import {AppUser} from '../model/appUser';
import {UserGroup} from '../model/userGroup';
import {Group} from '../model/group';
import {Post} from '../model/post';
import {Reaction} from '../model/reaction';
import {UserPost} from '../model/userPost';
import {PollOption} from '../model/pollOption';
import {PollVote} from '../model/pollVote';
import { ReactionType } from '../model/enums';

export function get_acceptInvitation_URL(id: number) {
  return `/api/invitation/acceptInvitation?id=${id}`;
}export function get_rejectInvitation_URL(id: number) {
  return `/api/invitation/rejectInvitation?id=${id}`;
}

export const getInvitationsForCurrentUser_URL = '/api/invitation/getInvitationsForCurrentUser';
export function getInvitationsForCurrentUser(api: HttpClientAPI) {
  return api.http<Invitations[]>('/api/invitation/getInvitationsForCurrentUser', { method: 'get'  });
}export function acceptInvitation(api: HttpClientAPI,id: number) {
  return api.http<Invitations[]>(`/api/invitation/acceptInvitation?id=${id}`, { method: 'get'  });
}
export function rejectInvitation(api: HttpClientAPI,id: number) {
  return api.http<Invitations[]>(`/api/invitation/rejectInvitation?id=${id}`, { method: 'get'  });
}
