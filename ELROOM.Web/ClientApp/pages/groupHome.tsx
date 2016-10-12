import * as React from 'react';
import { BaseComponent, BaseContextTypes } from '../components';
import { RouteComponentProps } from 'react-router';
import { DocumentTitle } from '../controls';
import { Group } from '../model/group';
import * as groupSvc from '../services/group';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { GroupInfoConsumer } from './component/groupProvider';
import { CurrentGroupAPI } from './currentGroupProviderInterface';
import { GroupUserList } from './component/groupUserList';
import { PostDialog } from './dialog/postDialog';
import { Post as PostInfo } from '../model/post';
import { GroupPostList } from './component/groupPostList';
import { teal300, grey600, grey400 } from 'material-ui/styles/colors';
import { GroupList } from './component/groupList';

//import { GroupPostList } from './component/groupPostList';
interface GroupHomeProps extends RouteComponentProps<{ groupId: number }, {}> {

}

interface GroupHomeState {
  group: Group;
  posts: PostInfo[];
}

export class GroupHome extends GroupInfoConsumer<GroupHomeProps, GroupHomeState> implements CurrentGroupAPI {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      group: null,
      posts: []
    };
  }

  async componentWillMount() {
    this.state.group = await groupSvc.loadGroup(this.httpClient, this.props.params.groupId) as Group;
    this.state.posts = this.state.group.posts.reverse();
    this.setState(this.state);
  }

  componentDidUpdate(prevProps, prevState: GroupHomeState, prevContext: any) {
    if (prevState.group.id !== this.groupId) {
      this.componentWillMount();
    }
  }

  get groupId(): number {
    return parseInt(String(this.props.params.groupId), 10);
  }

  get group(): Group {
    return this.state.group;
  }

  static childContextTypes = {
    currentGroupAPI: React.PropTypes.object
  }

  getChildContext() {
    return {
      currentGroupAPI: this
    }
  }

  async createNewPost() {
    var np: PostInfo = {
      id: 0,
      title: "",
      content: "",
      groupId: this.groupId,
      ownerId: this.serverInfoAPI.serverInfo.userProfile.id,
      pollStart: null,
      pollEnd: null,
      pollOptions: [],
      userPosts: [],
      reactions: [],
      hasPoll: false
    };
    let pst = await this.systemAPI.dialog(this.i18n.t("post:label.new_post"), <PostDialog post={np}/>) as PostInfo;
    this.state.posts.unshift(pst);
    this.setState(this.state);
  }

  isPrivateGroup() {
    return this.state.group ? this.state.group.private : true;
  }

  render() {
    if (!this.state.group) {
      return null;
    }
    let groupContainerStyle: React.CSSProperties = {
        backgroundColor: grey400
    };
    if (this.state.group.hasImage) {
        groupContainerStyle.backgroundImage = `url('${groupSvc.get_getFullImage_URL(this.state.group.id)}?r=${this.state.group.rowVersion}')`;
    }
    return <DocumentTitle title={this.state.group ? this.state.group.name : ""}>
      <div className="group">
        <div className="row elroom-body-box">
          <div className="col-xs-12 col-md-3 elroom-seperator">
            <GroupUserList/>
          </div>
          <div className="col-xs-12 col-md-6 elroom-seperator">
            <div className="group-container" style={groupContainerStyle}>
              <h1 className="group group-header">{this.state.group ? this.state.group.name : ""}</h1>
              <div className="group group-privacy" style={{ color: "#ffffff" }} ><FontIcon className="material-icons" color={"#ffffff"}>{this.isPrivateGroup() ? "lock" : "public"}</FontIcon> {this.isPrivateGroup() ? this.i18n.t("group:label.private") : this.i18n.t("group:label.public")} Group</div>
              <div className="group group-description">
                {this.state.group.description.split('\n').map(line => {
                  return <div className="group-desc-line">{line}</div>;
                })}
              </div>
              <div className="group group-action">
                <RaisedButton onTouchTap={(evt) => { evt.preventDefault(); this.createNewPost(); } } label={this.i18n.t("group:button.new_post")} icon={<FontIcon className="material-icons">add</FontIcon>} backgroundColor={teal300} labelColor={'#fff'}/>
              </div>
            </div>
            <GroupPostList posts={this.state.posts} onPostChanged={() => this.componentWillMount()}/>
          </div>
          <div className="col-xs-12 col-md-3 elroom-seperator">
            <GroupList data={this.groupProvider.publicGroups} groupType="public" viewMore={this.groupProvider.morePublicGroups} title="Public groups" showFollower={true} expandable={true} headerBackground={teal300}/>
            <div className="vert-sep"></div>
            <GroupList data={this.groupProvider.followingGroups} groupType="following" title="Joined groups" viewMore={this.groupProvider.moreFollowingGroups} showFollower={true} expandable={true} headerBackground={teal300}/>
          </div>
        </div>
      </div>
    </DocumentTitle>;
  }
}