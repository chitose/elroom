import * as React from 'react';
import { BaseComponent } from '../../components';
import { Post as PostInfo } from '../../model/Post';
import { Reaction } from '../../model/reaction';
import { UserPost } from '../../model/userpost';
import IconButton from 'material-ui/IconButton';
import { ReactionType } from '../../model/Enums';
import FontIcon from 'material-ui/FontIcon';
import { grey200, grey300, grey500, grey600, teal100, teal200, teal300 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import * as postSvc from '../../services/post';

interface PostReactionProps extends React.Props<PostReaction> {
    post: PostInfo
}
interface PostReactionState {
    post: PostInfo;
}
export class PostReaction extends BaseComponent<PostReactionProps, PostReactionState> {
    constructor(props: PostReactionProps, ctx) {
        super(props, ctx);
        this.state = {
            post: props.post
        };
    }
    async followPost() {
        let curUserId = this.serverInfoAPI.serverInfo.userProfile.id;
        let userPost: UserPost = {
            id: 0,
            postId: this.state.post.id,
            userId: curUserId
        };
        var userGroupItem = this.state.post.userPosts.filter(u => u.userId === curUserId && u.postId === this.props.post.id);
        if (userGroupItem.length > 0) {
            userPost.id = userGroupItem[0].id;
        }         
        let us = await postSvc.followPost(this.httpClient, userPost);
        if (userGroupItem.length > 0) {
            this.state.post.userPosts = this.state.post.userPosts.filter(f => f.id !== userPost.id);
        } else {
            this.state.post.userPosts.push(us as UserPost);
        }
        this.setState(this.state);
    }
    async likePost() {
        await this.reactPost(ReactionType.Like);
    }
    async dislikePost() {
        await this.reactPost(ReactionType.Dislike);
    }
    async reactPost(type) {
        let curUserId = this.serverInfoAPI.serverInfo.userProfile.id;
        let reaction: Reaction = null;
        let reactionItems = this.state.post.reactions.filter(r => r.ownerId === curUserId && r.postId === this.props.post.id);
        if (reactionItems.length > 0) {
            reactionItems[0].type = reactionItems.length > 0 && reactionItems[0].type === type ? ReactionType.NoState : type;
            reaction = reactionItems[0];
        }
        else {
            reaction = {
                id: reactionItems.length > 0 ? reactionItems[0].id : 0,
                postId: this.state.post.id,
                ownerId: curUserId,
                commentId: null,
                type: reactionItems.length > 0 && reactionItems[0].type === type ? ReactionType.NoState : type
            }
            this.state.post.reactions.push(reaction);
        }

        let item = await postSvc.reactPost(this.httpClient, reaction);
        this.setState(this.state);
    }

    render() {
        let likeItems = this.state.post.reactions.filter(r => r.type === ReactionType.Like);
        let likeCount = likeItems.length;
        let liked = likeItems.some(r => r.ownerId === this.serverInfoAPI.serverInfo.userProfile.id);

        let dislikeItems = this.state.post.reactions.filter(r => r.type === ReactionType.Dislike);
        let dislikeCount = dislikeItems.length;
        let disliked = dislikeItems.some(r => r.ownerId === this.serverInfoAPI.serverInfo.userProfile.id);

        let followed = this.state.post.userPosts.some(f => f.userId === this.serverInfoAPI.serverInfo.userProfile.id);
        let followCount = this.state.post.userPosts.length;
        const flatButtonStyle: React.CSSProperties = {
            color: "#ffffff"
        };
        return <div className='post-reaction elroom-table'>
            <div className="post-reaction  elroom-row">
                <div className='post-reaction reactions elroom-cell'>
                    <IconButton touch={true} onTouchTap={(evt) => { evt.preventDefault(); this.likePost(); } }>
                        <FontIcon className="material-icons" color={!liked ? grey600 : teal200}>thumb_up</FontIcon>
                    </IconButton>
                    <span>{likeCount}</span>
                    <IconButton touch={true} onTouchTap={(evt) => { evt.preventDefault(); this.dislikePost(); } }>
                        <FontIcon className="material-icons btn-dislike" color={!disliked ? grey600 : teal200}>thumb_down</FontIcon>
                    </IconButton>
                    <span>{dislikeCount}</span>
                </div>
                <div className="post-reaction follow cell">
                    <span className="post-reaction follow count">{followCount}</span>
                    <FlatButton onTouchTap={(evt) => { evt.preventDefault(); this.followPost(); } }
                        label={!followed ? this.i18n.t("post:button.follow") : this.i18n.t("post:button.followed")}
                        backgroundColor={!followed ? teal300 : grey500} hoverColor={!followed ? teal200 : grey300} labelStyle={flatButtonStyle}/>
                </div>
            </div>
        </div>
    }
}