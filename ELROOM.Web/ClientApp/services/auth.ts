
// Auto generated by typewriter from c# code. Update coresponding c# code to re-generate this file.
import {HttpClientAPI} from '../components/httpClientProvider';

import {ProfileInfo} from '../model/profileInfo';


export function get_getAvatar_URL(id: number) {
  return `/api/auth/getAvatar${id}`;
}export function get_getFullImage_URL(id: number) {
  return `/api/auth/getFullImage${id}`;
}
export function updateProfile(api: HttpClientAPI,request: ProfileInfo) {
  return api.http<ProfileInfo>(`/api/auth/updateProfile`, { method: 'post' , body: JSON.stringify(request) });
}
export function getAvatar(api: HttpClientAPI,id: number) {
  return api.http<any>(`/api/auth/getAvatar${id}`, { method: 'get'  });
}
export function getFullImage(api: HttpClientAPI,id: number) {
  return api.http<any>(`/api/auth/getFullImage${id}`, { method: 'get'  });
}
