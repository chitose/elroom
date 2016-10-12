import * as React from 'react';
import { FollowingPosts } from './followingPosts';
import * as postSvc from '../../services/post';
import { PostsReponseData } from '../../model/postsReponseData';

export class HostPosts extends FollowingPosts {
  protected async loadData() {
    return await postSvc.getHostPosts(this.httpClient, this.state.offset, this.PAGE_SIZE) as PostsReponseData;
  }
}