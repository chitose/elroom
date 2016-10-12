import * as React from 'react';
import { Post } from '../model/post';
import { BaseContextTypes, BaseComponent } from '../components';

export interface CurrentPostAPI {
    post: Post;
    postId: number;
}

export const PostConsumerTypes = Object.assign({}, BaseContextTypes, {
    currentPostAPI: React.PropTypes.object
});

export class PostConsumerComponent<P, S> extends BaseComponent<P, S> {
    static contextTypes = PostConsumerTypes;

    get currentPost(): CurrentPostAPI {
      return this.context["currentPostAPI"] as CurrentPostAPI;
    }
}