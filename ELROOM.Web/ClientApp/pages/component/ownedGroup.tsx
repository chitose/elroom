import * as React from 'react';
import { GroupList } from './groupList';
import { GroupInfoConsumer } from './groupProvider';
import { teal300 } from 'material-ui/styles/colors';
import { GroupDialog } from '../dialog/groupDialog';
import { Group } from '../../model/group';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';

export class OwnedGroup extends GroupInfoConsumer<any, void> {
  async newGroup() {
    let newGroup: Group = {
      ownerId: this.serverInfoAPI.serverInfo.userProfile.id,
      id: 0,
      name: "",
      description: "",
      private: false,
      userGroups: [],
      rowVersion: null,
      creationDate: new Date(),
      modificationDate: new Date(),
      posts: [],
      invitations: []
    };
    let g = await this.systemAPI.dialog(this.i18n.t("group:label.new_group"), <GroupDialog group={newGroup}/>) as Group;
    if (g != null) {
      this.groupProvider.newGroup(g);
    }
  }
  render() {
    const action = [<FlatButton icon={<FontIcon className="material-icons">add</FontIcon>} labelPosition="after" onTouchTap={(evt) => { evt.preventDefault(); this.newGroup() } } label={this.i18n.t("group:button.new_group")}></FlatButton>];
    return <GroupList data={this.groupProvider.ownedGroups}
      title={this.i18n.t("group:label.owned_group") }
      groupType="owned"
      viewMore={this.groupProvider.moreOwnedGroups}
      actions={action}
      showFollower={true}
      expandable={true} headerBackground={teal300}/>;
  }
}