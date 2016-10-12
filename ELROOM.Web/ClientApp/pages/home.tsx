import * as React from 'react';
import { DocumentTitle } from '../controls';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { GroupInfoConsumer } from './component/groupProvider';
import { GroupList } from './component/groupList';
import { OwnedGroup } from './component/ownedGroup';
import { teal300, deepOrange600 } from 'material-ui/styles/colors';
import { InvitationList } from './component/invitationList';
import { FollowingPosts } from './component/followingPosts';
import { HostPosts } from './component/hostPosts';
import { PostWithPolls } from './component/postWithPolls';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';


interface HomeProps extends React.Props<Home>, ReactI18next.InjectedTranslateProps {
}

interface HomeState {
  slideIndex: number;
  hostTabVisible: boolean;
  pollTabVisible: boolean;
}

export class Home extends GroupInfoConsumer<HomeProps, HomeState> {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      slideIndex: 0,
      hostTabVisible: false,
      pollTabVisible: false
    };
  }

  handleChange(value) {
    this.state.slideIndex = value;
    if (!this.state.hostTabVisible && value === 1)
      this.state.hostTabVisible = true;
    if (!this.state.pollTabVisible && value === 2)
      this.state.pollTabVisible = true;
    this.setState(this.state);
  };

  render() {
    return <DocumentTitle title="Home">
      <div className="row elroom-body-box">
        <div className="col-xs-12 col-md-3 elroom-seperator">
                <GroupList data={this.groupProvider.favoriteGroups} groupType="favorite" title="Favorite groups" viewMore={this.groupProvider.moreFavoriteGroups} showFollower={true} expandable={true} headerBackground={teal300}/>
          <div className="vert-sep"></div>
          <OwnedGroup />
          <div className="vert-sep"></div>
          <InvitationList/>
        </div>
        <div className="col-xs-12 col-md-6 elroom-seperator">
          <Tabs onChange={this.handleChange.bind(this)}
                    value={this.state.slideIndex} inkBarStyle={{ backgroundColor: deepOrange600}}>
            <Tab label={this.i18n.t("common:label.following_posts")} value={0}>
            </Tab>
            <Tab label={this.i18n.t("common:label.host_posts")} value={1}>
            </Tab>
            <Tab label={this.i18n.t("common:label.post_with_polls")} value={2}>
            </Tab>
          </Tabs>
          <SwipeableViews 
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange.bind(this)}
            >
            <FollowingPosts/>
            {this.state.hostTabVisible ? <HostPosts /> : null}
            {this.state.pollTabVisible ? <PostWithPolls /> : null}
          </SwipeableViews>
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