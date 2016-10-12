import * as React from 'react';
import * as invitationSvc from '../../services/invitation';
import { BaseComponent } from '../../components';
import { Invitations } from '../../model/invitations';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { grey700, white, cyan300, teal300 } from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import * as groupSvc from '../../services/group';

interface InvitationListState {
    invitations: Invitations[];
}

export class InvitationList extends BaseComponent<any, InvitationListState> {
    constructor(props, ctx) {
        super(props, ctx);
        this.state = {
            invitations: []
        };
    }

    async componentWillMount() {
        let invitations = await invitationSvc.getInvitationsForCurrentUser(this.httpClient) as Invitations[];
        this.setState({ invitations: invitations });
    }

    async accepInvitation(invite: Invitations) {
        await invitationSvc.acceptInvitation(this.httpClient, invite.id);
        this.state.invitations = this.state.invitations.filter(i => i.id !== invite.id);
        this.setState(this.state);
    }

    async rejectInvitation(invite: Invitations) {
        await invitationSvc.rejectInvitation(this.httpClient, invite.id);
        this.state.invitations = this.state.invitations.filter(i => i.id !== invite.id);
        this.setState(this.state);
    }

    protected getRightIconButton(invite: Invitations) {
        const rightIconMenu = (
            <div>
                <IconButton tooltip="Accept" onTouchTap={(evt) => { evt.preventDefault(); this.accepInvitation(invite); } }>
                    <NavigationCheck />
                </IconButton>
                <IconButton tooltip="Reject" onTouchTap={(evt) => { evt.preventDefault(); this.rejectInvitation(invite); } }>
                    <NavigationClose />
                </IconButton>
            </div>
        );
        return rightIconMenu;
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

        return <div> {
            this.state.invitations.length > 0 ? <Card initiallyExpanded={true}>
                <CardHeader title={`INVITATIONS (${this.state.invitations.length} invitations)`} style={headerStyle} textStyle={headerTextStyle} titleStyle={headerTitleStyle}
                    actAsExpander={true}
                    showExpandableButton={true}>
                </CardHeader>
                <div className="elroom-card-text invitation">
                    <CardText expandable={true}>
                        <List>
                            {this.state.invitations.map(i => {
                                return <ListItem className=" elroom-list-item" primaryText={i.groupName} innerDivStyle={itemStyle}
                                    leftAvatar={<Avatar src={`${groupSvc.get_getThumb_URL(i.groupId)}?v=${i.groupRowVersion}`} style={this.theme.customAvatarStyle}/>}
                                    secondaryText=" " rightIconButton= {this.getRightIconButton(i)}/>;
                            })}
                        </List>
                    </CardText>
                </div>
            </Card > : null} </div>;
    }
}