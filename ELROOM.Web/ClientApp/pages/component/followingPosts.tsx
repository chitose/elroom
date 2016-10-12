import * as React from 'react';
import { BaseComponent } from '../../components';
import * as groupSvc from '../../services/group';
import { Post } from '../../model/Post';
import { Post as PostCard } from './post';
import * as postSvc from '../../services/post';
import { PostsReponseData } from '../../model/postsReponseData';
import FlatButton from 'material-ui/FlatButton';

interface FollowingPostsState {
  posts: Post[];
  offset: number;
  total: number;
}

export class FollowingPosts extends BaseComponent<any, FollowingPostsState> {
  protected PAGE_SIZE = 5;
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      posts: [],
      offset: 0,
      total: 0
    };
  }

  async componentWillMount() {
    let rp = await this.loadData();
    this.state.posts = this.state.posts.concat(rp.posts);
    this.state.total = rp.totalCount;
    this.setState(this.state);
  }

  protected async loadData() {
    return await postSvc.getFollowingPosts(this.httpClient, this.state.offset, this.PAGE_SIZE) as PostsReponseData;
  }

  async loadMore() {
    this.state.offset += this.PAGE_SIZE;
    this.componentWillMount();
  }

  render() {
    return <div>
      {
        this.state.posts.map(p => {
          return <PostCard post={p} onPostDeleted={() => { this.state.offset = 0; this.componentWillMount(); } }/>
        })
      }
      {this.state.offset + this.PAGE_SIZE < this.state.total ? <FlatButton primary={true} label={this.i18n.t("common:button.show_more")} onTouchTap={this.loadMore.bind(this)} /> : null}
    </div>;
  }
}