import * as React from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { Group } from '../../model/group';
import { List, ListItem } from 'material-ui/List';
import { browserHistory } from 'react-router';
import * as groupSvc from '../../services/group';
import { RoutePaths } from '../../routes';
import { GroupInfoConsumer } from './groupProvider';
import { grey700, white, cyan300, teal300 } from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { GroupDialog } from '../dialog/groupDialog';
import FlatButton from 'material-ui/FlatButton';

interface GroupListProps extends React.Props<GroupList> {
    data: Group[];
    title: string;
    subTitle?: string;
    expandable?: boolean;
    actions?: React.ReactElement<any>[],
    headerBackground?: any;
    showFollower?: boolean;
    viewMore?: boolean;
    groupType?: string;
}

export class GroupList extends GroupInfoConsumer<GroupListProps, void> {
    protected getItemText(g: Group): string | React.ReactElement<any> {
        return g.name;
    }

    protected getRightIconButton(g: Group) {
        const isFavGroup = this.groupProvider.favoriteGroups.filter(x => x.id == g.id).length > 0;
        const isFollowGroup = this.groupProvider.followingGroups.filter(x => x.id == g.id).length > 0;
        const deletable = g.userGroups.length === 1 && g.ownerId === this.serverInfoAPI.serverInfo.userProfile.id;
        const isOwner = g.ownerId === this.serverInfoAPI.serverInfo.userProfile.id;
        const iconButtonElement = (
            <IconButton touch={true}>
                {isFavGroup ? <FontIcon className="material-icons" color={teal300}>favorite</FontIcon> : <MoreVertIcon color={grey700}/>}
            </IconButton>);
        const rightIconMenu = (
            <IconMenu iconButtonElement={iconButtonElement}>
                {isFavGroup ? <MenuItem onTouchTap={(evt) => { evt.preventDefault(); this.groupProvider.removeGroupFromFavorite(g) } }>{this.i18n.t("group:menu.remove_favorite")}</MenuItem> : null}
                {!isFavGroup && isFollowGroup ? <MenuItem onTouchTap={(evt) => { evt.preventDefault(); this.groupProvider.setGroupFavorite(g) } }>{this.i18n.t("group:menu.set_favorite")}</MenuItem> : null}
                {!isOwner ? (!isFollowGroup ? <MenuItem onTouchTap={(evt) => { evt.preventDefault(); this.groupProvider.followGroup(g) } }>{this.i18n.t("group:menu.follow")}</MenuItem>
                    : <MenuItem onTouchTap={(evt) => { evt.preventDefault(); this.groupProvider.unfollowGroup(g) } }>{this.i18n.t("group:menu.unfollow")}</MenuItem>) : null}
                {isOwner ? <MenuItem onTouchTap={(evt) => { evt.preventDefault(); this.editGroup(g); } }>{this.i18n.t("group:menu.edit")}</MenuItem> : null}
                {deletable ? <MenuItem onTouchTap={(evt) => { evt.preventDefault(); this.deleteGroup(g); } }>{this.i18n.t("group:menu.delete_group")}</MenuItem> : null}
            </IconMenu>
        );
        return rightIconMenu;
    }

    async deleteGroup(group: Group) {
        let r = await this.systemAPI.confirm(this.i18n.t("group:label.group_deletion"), this.i18n.t("group:message.delete_group_confirm"));
        if (r) {
            await groupSvc.deleteGroup(this.httpClient, group);
            this.groupProvider.deleteGroup(group);
        }
    }

    async editGroup(group: Group) {
        group = await this.systemAPI.dialog<Group>(group.name, <GroupDialog group={group}/>);
        if (group != null) {
            this.groupProvider.editGroup(group);
        }
    }

    gotoGroup(id: number) {
        browserHistory.push(RoutePaths.groupHome(id));
    }

    protected getSecondaryText(g: Group) {
        return this.props.showFollower ? this.i18n.t("group:follower_with_count", { count: g.userGroups.length }) : null;
    }

    render() {
        const itemStyle: React.CSSProperties = {
            paddingTop: "15px"
        };
        const headerStyle: React.CSSProperties = {
            padding: "0 16px 0 0",
            background: this.props.headerBackground
        };

        const headerTextStyle: React.CSSProperties = {
            paddingRight: 52,
            marginLeft: 16,
            display: "block",
            lineHeight: "48px",
            borderBottom: this.props.headerBackground ? "" : `1px solid ${grey700}`
        };

        const headerTitleStyle: React.CSSProperties = {
            color: this.props.headerBackground ? white : grey700
        };

        return <Card initiallyExpanded={true}>
            <CardHeader title={this.props.title.toUpperCase()} style={headerStyle} textStyle={headerTextStyle} titleStyle={headerTitleStyle}
                subtitle={this.props.subTitle}
                actAsExpander={this.props.expandable}
                showExpandableButton={this.props.expandable}>
            </CardHeader>
            <div className="elroom-card-text">
                <CardText expandable={this.props.expandable}>
                    <List>
                        {this.props.data.map(g => {
                            return <ListItem className="elroom-list-item" primaryText={this.getItemText(g)} onTouchTap={() => this.gotoGroup(g.id)} innerDivStyle={itemStyle}
                                secondaryText={this.getSecondaryText(g)}
                                rightIconButton={this.getRightIconButton(g)}
                                leftAvatar={<Avatar src={`${groupSvc.get_getThumb_URL(g.id)}?v=${g.rowVersion}`} style={this.theme.customAvatarStyle} />} size={32} />;
                        })}
                    </List>
                    <CardActions>
                        {this.props.viewMore ?
                            <FlatButton
                                labelPosition="after"
                                label={this.i18n.t("common:label.view_more")}
                                icon={<FontIcon className="material-icons">autorenew</FontIcon>}
                                onTouchTap={(evt) => { evt.preventDefault(); this.groupProvider.loadGroupData(this.props.groupType, this.props.data.length) } }>
                            </FlatButton> : null}
                        {this.props.actions}
                    </CardActions>
                </CardText>
            </div>
        </Card >;
    }
}