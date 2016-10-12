import * as React from 'react';
import { BaseComponent, BaseContextTypes } from '../components';
import { RouteComponentProps } from 'react-router';
import { DocumentTitle } from '../controls';
import * as postSvc from '../services/post';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { GroupInfoConsumer } from './component/groupProvider';
import { CurrentPostAPI } from './currentPostProviderInterface';
import { PostDialog } from './dialog/postDialog';
import { Post as PostInfo } from '../model/post';
import { teal300, grey600 } from 'material-ui/styles/colors';
import { GroupList } from './component/groupList';
import { OwnedGroup } from './component/ownedGroup';
import { InvitationList } from './component/invitationList';
import { Post as PostCard } from './component/post';
import { browserHistory } from 'react-router';
import { RoutePaths } from '../routes';

interface PostHomeProps extends RouteComponentProps<{ postId: number }, {}> {

}

interface PostHomeState {
  post: PostInfo;
}

export class PostHome extends GroupInfoConsumer<PostHomeProps, PostHomeState> implements CurrentPostAPI {
    constructor(props, ctx) {
        super(props, ctx);
        this.state = {
          post: null
        };
    }

    async componentWillMount() {
      let post = await postSvc.getPost(this.httpClient, this.props.params.postId) as PostInfo;
      this.state.post = post as PostInfo;
      this.setState(this.state);
    }

    get post(): PostInfo {
      return this.state.post;
    }

    get postId(): number {
      return parseInt(String(this.props.params.postId), 10);
    }

    static childContextTypes = {
      currentPostAPI: React.PropTypes.object
    }

    getChildContext() {
        return {
            currentPostAPI: this
        }
    }

    componentDidUpdate(prevProps, prevState: PostHomeState, prevContext: any) {
      if (prevState.post.id !== this.postId) {
        this.componentWillMount();
      }
    }

    render() {
      if (!this.state.post) {
        return null;
      }
      return <DocumentTitle title="Home">
        <div className="row">
          <div className="col-xs-12 col-md-3 elroom-seperator">
            <GroupList data={this.groupProvider.favoriteGroups} groupType="favorite" title="Favorite groups" viewMore={this.groupProvider.moreFavoriteGroups} expandable={true} headerBackground={teal300}/>
            <div className="vert-sep"></div>
            <OwnedGroup/>
            <div className="vert-sep"></div>
            <InvitationList/>
          </div>
          <div className="col-xs-12 col-md-6 elroom-seperator elroom-post-view">
            <PostCard post={this.state.post} onPostDeleted={() => { browserHistory.push(RoutePaths.root) } }/>
          </div>
          <div className="col-xs-12 col-md-3 elroom-seperator">
            <GroupList data={this.groupProvider.publicGroups} groupType="public" viewMore={this.groupProvider.morePublicGroups} title="Public groups" showFollower={true} expandable={true} headerBackground={teal300}/>
            <div className="vert-sep"></div>
            <GroupList data={this.groupProvider.followingGroups} groupType="following" title="Joined groups" viewMore={this.groupProvider.moreFollowingGroups} showFollower={true} expandable={true} headerBackground={teal300}/>
          </div>
        </div>
      </DocumentTitle>;
    }
}