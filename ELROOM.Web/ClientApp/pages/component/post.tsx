import * as React from 'react';
import Avatar from 'material-ui/Avatar';
import { GroupInfoConsumer } from './groupProvider';
import { Post as PostInfo } from '../../model/post';
import { PollVote } from '../../model/pollVote';
import { PostPollBox } from './postPollBox';
import { OwnerInfo } from './ownerInfo';
import * as authSvc from '../../services/auth';
import * as postSvc from '../../services/post';
import { PostReaction } from './postReaction';
import { CommentBox } from './commentBox';
import { CommentList } from './commentList';
import { Comment } from '../../model/comment';
import { CommentsResponse } from '../../model/commentsResponse';
import FlatButton from 'material-ui/FlatButton';
import { PostDialog } from '../dialog/postDialog';
import { deepOrange900, grey400, grey500 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
const PAGE_SIZE = 5;

interface PostState {
  post: PostInfo;
  comments: Comment[];
  offset: number;
  totalCount: number;
}

interface PostProps extends React.Props<Post> {
  post: PostInfo;
  onPostDeleted: { (): void };
}

export class Post extends GroupInfoConsumer<PostProps, PostState> {
  constructor(props: PostProps, ctx) {
    super(props, ctx);
    this.state = {
      post: props.post,
      comments: [],
      offset: 0,
      totalCount: 0
    };
  }

  get post(): PostInfo {
    return this.state.post;
  }

  componentWillMount() {
    this.refreshComment();
  }

  static childContextTypes = {
    currentPostAPI: React.PropTypes.object
  };

  async refreshComment() {
    let resp = await postSvc.getComments(this.httpClient, this.state.post.id, 0, this.state.offset + PAGE_SIZE) as CommentsResponse;
    this.state.comments = resp.comments;
    this.state.totalCount = resp.totalCount;
    this.setState(this.state);
  }

  loadMoreComments() {
    this.state.offset += PAGE_SIZE;
    this.refreshComment();
  }

  getChildContext() {
    return {
      currentPostAPI: this
    };
  }

  async editPost() {
    let np = await this.systemAPI.dialog(this.i18n.t("post:label.edit_post"), <PostDialog post={this.state.post} />);
    this.state.post = np as PostInfo;
    this.setState(this.state);
  }

  async deletePost(post: PostInfo) {
    let r = await this.systemAPI.confirm(this.i18n.t("post:label.delete_post"), this.i18n.t("post:message.delete_post_confirm"));
    if (r) {
      await postSvc.deletePost(this.httpClient, post);
      this.props.onPostDeleted();
    }
  }

  render() {
    const commentable = this.props.post && this.groupProvider.followingGroups.some(x => x.id === this.props.post.groupId);
    return <div className='post-container'>
      <div className='post content-box'>
        {this.props.post.ownerId === this.serverInfoAPI.serverInfo.userProfile.id ? <div className="edit-post">          
          <IconButton touch={true} onTouchTap={(evt) => { evt.preventDefault(); this.editPost(); } }>
            <FontIcon className="material-icons md-18" color={grey400}>mode_edit</FontIcon>
          </IconButton>
        </div> : null}
        <OwnerInfo name={this.props.post.owner.displayName}
          date={this.props.post.modificationDate}
          avatar={`${authSvc.get_getAvatar_URL(this.props.post.ownerId)}?r=${this.props.post.owner.rowVersion}`} />
        <div className="post title" style={{ color: deepOrange900 }}>
          {this.props.post.title}
        </div>
        <div className="post content">
          {this.props.post.content.split('\n').map(line => {
            return <div className="post-line">{line}</div>;
          })}
        </div>
        {!this.props.post.hasImage ? null : < div className= "post image" >
          <img src={`${postSvc.get_getFullImage_URL(this.props.post.id)}?r=${this.state.post.rowVersion}`}/>
        </div>}
        <PostPollBox post={this.props.post}/>
        <PostReaction post={this.props.post}/>
      </div>
      <CommentList comments={this.state.comments} showMore={(this.state.offset + PAGE_SIZE) < this.state.totalCount} loadMore={this.loadMoreComments.bind(this)}/>
      {!commentable ? null : <CommentBox hintText={this.i18n.t("post:label.comment_hint")} postId={this.props.post.id} onCommented={this.refreshComment.bind(this)}/>}
    </div >
  }
}