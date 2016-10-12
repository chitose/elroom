import * as React from 'react';
import { FollowingPosts } from './followingPosts';
import * as postSvc from '../../services/post';
import { PostsReponseData } from '../../model/postsReponseData';

export class PostWithPolls extends FollowingPosts {
  protected async loadData() {
    return await postSvc.getPostWithPolls(this.httpClient, this.state.offset, this.PAGE_SIZE) as PostsReponseData;
  }
}