import * as React from 'react';
import Avatar from 'material-ui/Avatar';
import { BaseComponent } from '../../components';
import moment from 'moment';

interface OwnerInfoProps extends React.Props<OwnerInfo> {
    name: string;
    date: Date;
    avatar: string;
    showAsFriendlyDate?: boolean;
}

export class OwnerInfo extends BaseComponent<OwnerInfoProps, void> {
    render() {
        var dateStr = this.props.showAsFriendlyDate ? moment(this.props.date).fromNow() : moment(this.props.date).format("LL");
        return <div className='owner-info-container'>
            <div className='owner-info avatar'>
                <Avatar src={this.props.avatar} style={this.theme.customAvatarStyle}/>
            </div>
            <div className='owner-info info'>
                <span className='owner-info name' style={this.theme.ownerNameStyle}>{this.props.name}</span>
                <div className='owner-info date'>{dateStr}</div>
            </div>
            <div className="elroom-clearboth"></div>
        </div>

    }
}