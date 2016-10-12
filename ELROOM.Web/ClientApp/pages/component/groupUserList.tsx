import * as React from 'react';
import { GroupConsumerComponent } from '../currentGroupProviderInterface';
import * as groupSvc from '../../services/group';
import { AppUser } from '../../model/appUser';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { grey700, white, teal300 } from 'material-ui/styles/colors';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import RaisedButton from 'material-ui/RaisedButton';
import * as auth from '../../services/auth';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { Form, FormAutocompleteField } from '../../controls';
import AutoComplete from 'material-ui/AutoComplete';

interface GroupUserListState {
  users: AppUser[];
  otherUsers: AppUser[];
  selectedUserId: number;
  ownerId: number;
  isOwner: boolean;
  searchText: string;
  groupId: number;
}
export class GroupUserList extends GroupConsumerComponent<any, GroupUserListState> {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      users: [],
      otherUsers: [],
      selectedUserId: -1,
      isOwner: false,
      ownerId: -1,
      searchText: "",
      groupId: 0
    };
  }

  protected getRightIconButton(user: AppUser) {
    const iconButtonElement = (
      <IconButton touch={true}>
        {<ActionDelete color={grey700}/>}
      </IconButton>);
    const rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onTouchTap={(evt) => { evt.preventDefault(); this.removeUserFromGroup(user); } }>{"Remove"}</MenuItem>
      </IconMenu>
    );
    return this.state.isOwner && this.state.ownerId !== user.id ? rightIconMenu : "";
  }

  protected getUserResources() {
    const users = (this.state.otherUsers.map(u => {
      return {
        text: u.displayName,
        value: u.id
      };
    }));
    return users;
  }

  protected getInviteBox() {
    return this.state.isOwner ?
      <div className="elroom-invite-member">
        <CardActions>
          <AutoComplete
            hintText="Enter name or visa"
            filter={AutoComplete.fuzzyFilter}
            dataSource={this.getUserResources()}
            searchText={this.state.searchText}
            fullWidth={true}
            maxSearchResults={5}
            onNewRequest={this.onNewRequestHandler.bind(this)}
            />
          <RaisedButton
            label="Invite members"
            icon={<ContentAdd />}
            fullWidth={true}
            backgroundColor={teal300}
            labelColor={'#fff'}
            onTouchTap={(evt) => { evt.preventDefault(); this.inviteUser(this.state.selectedUserId); } }
            />
        </CardActions> </div> : "";
  }

  async componentWillMount() {
    let users = await groupSvc.getGroupUser(this.httpClient, this.currentGroup.groupId) as AppUser[];
    let others = await groupSvc.getOtherUsers(this.httpClient, this.currentGroup.groupId) as AppUser[];
    this.state.users = users;
    this.state.otherUsers = others
    this.state.ownerId = this.currentGroup.group.ownerId;
    this.state.isOwner = this.currentGroup.group.ownerId === this.serverInfoAPI.serverInfo.userProfile.id;
    this.state.groupId = this.currentGroup.groupId;
    this.setState(this.state);
  }

  componentDidUpdate(prevProps, prevState: GroupUserListState, prevContext: any) {
    if (prevState.groupId !== this.currentGroup.groupId) {
      this.componentWillMount();
    }
  }


  async removeUserFromGroup(user: AppUser) {
    let r = await this.systemAPI.confirm(this.i18n.t("group:label.group_deletion"), this.i18n.t("group:message.delete_group_confirm"));
    if (r) {
      let users = await groupSvc.deleteGroupUser(this.httpClient, user.id, this.currentGroup.group) as AppUser[];
      this.state.users = users;
      this.setState(this.state);
    }
  }

  async inviteUser(userId: number) {
    if (this.state.selectedUserId !== -1) {
        this.state.searchText = "";
        this.state.otherUsers = this.state.otherUsers.filter(u => u.id != userId);
        this.setState(this.state);
        groupSvc.inviteUser(this.httpClient, userId, this.currentGroup.groupId);
    }
  }

  onNewRequestHandler(textString: any, index: number) {
    if (index >= 0) {
      this.state.selectedUserId = textString.value;
      this.setState(this.state);
    }
  }

  render() {
    const itemStyle: React.CSSProperties = {
      paddingTop: "15px"
    };
    const headerStyle: React.CSSProperties = {
      padding: "0 16px 0 0",
      background: teal300
    };

    const headerTextStyle: React.CSSProperties = {
      paddingRight: 52,
      marginLeft: 16,
      display: "block",
      lineHeight: "48px",
      borderBottom: `1px solid ${teal300}`
    };

    const headerTitleStyle: React.CSSProperties = {
      color: white
    };

    return <Card initiallyExpanded={true}>
      <CardHeader title={`MEMBERS (${this.state.users.length} members)`} style={headerStyle} textStyle={headerTextStyle} titleStyle={headerTitleStyle}
        actAsExpander={true}
        showExpandableButton={true}>
      </CardHeader>
      {this.getInviteBox()}
      <CardText expandable={true}>
        <List>
          {this.state.users.map(u => {
            return <ListItem primaryText={u.displayName} innerDivStyle={itemStyle}
              leftAvatar={<Avatar src={`${auth.get_getAvatar_URL(u.id)}?r=${u.rowVersion}`} style={this.theme.customAvatarStyle} />}
              rightIconButton={this.getRightIconButton(u)}/>;
          })}
        </List>
      </CardText>
    </Card >;
  }
}