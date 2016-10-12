import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { browserHistory } from 'react-router';
import { ProfileConsumerComponent } from './profileProvider';
import Drawer from 'material-ui/Drawer';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import { Right } from '../model/enums';
import { DictionaryType } from '../common';
import { RoutePaths } from '../routes';
import { ProfileDialog } from '../pages/profile';
import { Link } from 'react-router';
import * as auth from '../services/auth';
import * as notificationsvc from '../services/notification';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import IconMenu from 'material-ui/IconMenu';
import { NotificationResponse } from '../model/notificationResponse';
import { BusinessExceptionResponse } from '../components';
import moment from 'moment';

interface NavMenuState {
    personalMenuOpen: boolean;
    anchorEl: any;
    notifications: NotificationResponse[];
    newNotificationCount: number;
}

interface MenuItemInfo {
    name?: string;
    title: string;
    leftIcon?: string;
    action?: React.TouchEventHandler;
    children?: MenuItemInfo[],
    right?: Right;
    routePath?: string;
}

interface NavMenuProps {
    location?: HistoryModule.Location
}

export class NavMenu extends ProfileConsumerComponent<NavMenuProps, NavMenuState> {
    private personMenus: MenuItemInfo[] = [
        {
            title: "common:personalMenu.profile", action: (evt) => {
                this.handleRequestClose(evt);
                this.systemAPI.dialog(this.i18n.t("security:page.profile"), <ProfileDialog/>);
            },
            leftIcon: "perm_identity"
        }
    ];

    constructor(props, ctx) {
        super(props, ctx);
        var menuMap = {} as DictionaryType<Boolean>;
        this.state = {
            personalMenuOpen: false,
            anchorEl: null,
            notifications: [],
            newNotificationCount: 0,
        };
    }

    handleRequestClose(event) {
        this.setState(Object.assign({}, this.state, {
            personalMenuOpen: false,
            anchorEl: null,
        }));
    }

    handleTouchTapPersonalMenu = (event: React.TouchEvent) => {
        event.preventDefault();
        this.setState(Object.assign({}, this.state, {
            personalMenuOpen: true,
            anchorEl: event.currentTarget
        }));
    };

    async componentWillMount() {
      setInterval(async () => {
        let notificationCount = await notificationsvc.getNotificationCount(this.httpClient);
        this.state.newNotificationCount = notificationCount as number;
        this.setState(this.state);
      }, 30000);

      let notifications = await notificationsvc.getNotification(this.httpClient, false, 0);
      this.state.notifications = notifications as NotificationResponse[];
      this.setState(this.state);
    }

    handleTouchTapNotificationButton = async (event: React.TouchEvent) => {
      event.preventDefault();
      let notifications = await notificationsvc.getNotification(this.httpClient, true, 0) as NotificationResponse[];
      this.state.notifications = notifications as NotificationResponse[];
      this.state.newNotificationCount = 0;
      this.setState(this.state);
    };

    handleTouchTapNotificationShowMoreButton = async (event: React.TouchEvent) => {
      event.preventDefault();
      const MAX_NOTIFICATION = 5;
      let notifications = await notificationsvc.getNotification(this.httpClient, true, this.state.notifications.length);
      this.state.notifications.push.apply(this.state.notifications, notifications as NotificationResponse[]);
      this.setState(this.state);
    };

    getNotificationStyle(isRead: boolean): React.CSSProperties {
      if (isRead) {
        return { color: "grey", maxWidth: "500px" };
      }
      return { color: "black", maxWidth: "500px" };
    }

    gotoPost(id: number) {
      notificationsvc.readNotification(this.httpClient, id);
      browserHistory.push(RoutePaths.postHome(id));
    }

    render() {
        const logoStyle: React.CSSProperties = {
            marginLeft: "12px"
        }
        return <div>
          <AppBar className="app-bar"
            showMenuIconButton={true} iconElementLeft={<Link to="/"><img src="/img/elca_logo.png"/></Link>} iconStyleLeft={logoStyle}
                onTitleTouchTap={(evt) => { evt.preventDefault(); browserHistory.push(RoutePaths.root); } }
                iconElementRight={
                        this.serverInfoAPI.serverInfo.userProfile != null ? <div className="user-menu">
                        <Badge badgeContent={this.state.newNotificationCount} primary={true} badgeStyle={{ top: -5, right: -5 }} >
                          <IconMenu className="elroom-notification"
                            iconButtonElement={<IconButton><NotificationsIcon /></IconButton>}
                            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                            targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            onTouchTap={this.handleTouchTapNotificationButton.bind(this) } touchTapCloseDelay={0}
                          >
                            <List style={{ maxWidth: "500px" }}>
                                  {this.state.notifications.map(n => {
                                    return <ListItem
                                      primaryText={n.notificationContent}
                                      secondaryText={moment(n.creationDate).fromNow() }
                                      leftAvatar={<Avatar src={`${auth.get_getAvatar_URL(n.authorUserId)}`} size={this.theme.profileMenu.avatarSize}  style={this.theme.customAvatarStyle}/>}
                                      style={this.getNotificationStyle(n.isRead) }
                                      onTouchTap={() => this.gotoPost(n.id) }>
                                    </ListItem>
                                  }) }
                            </List>
                            <FlatButton
                              labelPosition="after"
                              label={this.i18n.t("common:label.view_more") }
                              icon={<FontIcon className="material-icons">autorenew</FontIcon>}
                              onTouchTap={ this.handleTouchTapNotificationShowMoreButton.bind(this) } >
                            </FlatButton>
                          </IconMenu>
                        </Badge>
                        <List>
                            <ListItem className="profile" leftAvatar={<Avatar src={`${auth.get_getAvatar_URL(this.serverInfoAPI.serverInfo.userProfile.id)}?r=${this.serverInfoAPI.serverInfo.userProfile.rowVersion}`} size={this.theme.profileMenu.avatarSize}  style={this.theme.customAvatarStyle}/>}
                                primaryText={this.serverInfoAPI.serverInfo.userProfile.displayName}
                                style={{ color: this.theme.profileMenu.textColor }}
                                onTouchTap={this.handleTouchTapPersonalMenu.bind(this)} rightIcon={<MoreVertIcon color={this.theme.profileMenu.textColor}/>}>
                            </ListItem>
                        </List>
                        <Popover className="user-popup"
                            open={this.state.personalMenuOpen}
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                            onRequestClose={this.handleRequestClose.bind(this)}>
                            <Menu>
                                {
                                    this.personMenus.map((m, i) => {
                                        return <MenuItem leftIcon={m.leftIcon ? <FontIcon className="material-icons">{m.leftIcon}</FontIcon> : null}
                                            key={i} primaryText={this.i18n.t(m.title)} onTouchTap={m.action}/>
                                    })
                                }
                            </Menu>
                        </Popover>
                    </div> : null
                } >
            </AppBar>
        </div>;
    }
}