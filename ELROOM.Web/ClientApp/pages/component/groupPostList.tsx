import * as React from 'react';
import { GroupConsumerComponent } from '../currentGroupProviderInterface';
import * as groupSvc from '../../services/group';
import { Post } from '../../model/Post';
import { Post as PostCard } from './post';

interface GroupPostListProps extends React.Props<GroupPostList> {
  posts: Post[];
  onPostChanged: { (): void };
}
export class GroupPostList extends GroupConsumerComponent<GroupPostListProps, void> {
  render() {
    return <div>{
      this.props.posts.map(p => {
        return <PostCard post={p} onPostDeleted={() => this.props.onPostChanged()}/>
      })
    }</div>
  }
}