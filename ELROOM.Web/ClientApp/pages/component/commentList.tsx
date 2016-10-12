import * as React from 'react';
import { BaseComponent } from '../../components';
import { Comment } from '../../model/comment';
import { OwnerInfo } from './ownerInfo';
import Avatar from 'material-ui/Avatar';
import * as postSvc from '../../services/post';
import * as authSvc from '../../services/auth';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';
interface CommentListProps {
    comments: Comment[];
    showMore: boolean;
    loadMore: { (): void };
}

export class CommentList extends BaseComponent<CommentListProps, void> {
    render() {
        return <div className="comment-list" style={this.props.comments.length == 0 ? { display: "none" } : {}}>
            {!this.props.showMore ? null : <FlatButton primary={true}
                labelPosition="after"
                label={this.i18n.t("post:button.load_more_comment")}
                icon={<FontIcon className="material-icons">autorenew</FontIcon>}
                onTouchTap={(evt) => { evt.preventDefault(); this.props.loadMore() } }></FlatButton>}
            {this.props.comments.map(c => {
                return <div className="comment-item">
                    <div className="comment-owner">
                        <Avatar src={`${authSvc.get_getAvatar_URL(c.ownerId)}?r=${c.owner.rowVersion}`} style={this.theme.customAvatarStyle}/>
                    </div>
                    <div className="comment-body">
                        <div className='comment-heading'>
                            <span className='comment-owner' style={this.theme.ownerNameStyle}>{c.owner.displayName}</span>
                            <span className="comment-text">{c.content}</span>
                        </div>
                        <div className='comment-image'>
                            {c.hasImage ? < img className="comment-image" src={`${postSvc.get_getCommentImage_URL(c.id)}?r=${c.rowVersion}`}/> : null}
                            {!c.sticker ? null : <img src={`/${c.sticker}`}/>}
                        </div>
                        <div className="comment-date date">
                            {moment(c.modificationDate).fromNow()}
                        </div>
                    </div>
                    <div className="elroom-clearboth"></div>
                </div>;
            })}
        </div>;
    }
}