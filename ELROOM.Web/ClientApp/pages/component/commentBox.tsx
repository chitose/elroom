import * as React from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { BaseComponent, BusinessExceptionResponse } from '../../components';
import { PhotoPicker } from '../dialog/photoPicker';
import { StickerPicker } from '../dialog/stickerPicker';
import { Comment } from '../../model/comment';
import * as postSvc from '../../services/post';
import { grey500, grey600 } from 'material-ui/styles/colors';

interface CommentBoxProps extends React.Props<CommentBox> {
  hintText?: string;
  postId: number;
  onCommented?: { (): void };
}
interface CommentBoxState {
  text: string;
  image: string;
  sticker: string;
  focused: boolean;
}
export class CommentBox extends BaseComponent<CommentBoxProps, CommentBoxState> {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      text: "",
      image: "",
      sticker: "",
      focused: false
    };
  }

  async pickPhoto() {
    this.state.image = await this.systemAPI.dialog(this.i18n.t("post:label.photo_upload"), <PhotoPicker/>) as string;
    this.setState(this.state);
  }

  async pickSticker() {
    const dialogStyle: React.CSSProperties = {
      height: 500
    };
    this.state.sticker = await this.systemAPI.dialog(this.i18n.t("post:label.pick_sticker"), <StickerPicker/>, null, dialogStyle) as string;
    this.setState(this.state);
  }

  async commentText(evt: React.KeyboardEvent) {
    let cmt: Comment = {
      id: 0,
      ownerId: this.serverInfoAPI.serverInfo.userProfile.id,
      content: this.state.text,
      uploadImage: this.state.image,
      postId: this.props.postId,
      sticker: this.state.sticker
    };

    let ucmt = await postSvc.postComment(this.httpClient, cmt);
    if (!(ucmt as BusinessExceptionResponse).businessException && this.props.onCommented) {
      this.props.onCommented();
    }
    this.state.image = "";
    this.state.sticker = "";
    this.state.text = "";
    this.setState(this.state);
  }

  render() {
    return <div className={`comment-box ${this.state.focused ? 'focused' : ''}`}>
      <div className="comment-box-inner">
        <TextField onFocus={() => { this.state.focused = true; this.setState(this.state) } } onBlur={() => { this.state.focused = false; this.setState(this.state) } } hintText={this.props.hintText} value={this.state.text} fullWidth={true} onChange={(evt) => { this.state.text = (evt.target as HTMLInputElement).value; this.setState(this.state) } } onEnterKeyDown={this.commentText.bind(this)} />
        {!this.state.image ? null : <img className="comment-image" src={this.state.image}/>}
        {!this.state.sticker ? null : <img className="comment-image" src={`/${this.state.sticker}`}/>}
        <div className="picker">
          <IconButton tooltip={this.i18n.t("post:button.upload_picture")} onTouchTap={(evt) => { evt.preventDefault(); this.pickPhoto() } }>
            <FontIcon className="material-icons" color={grey600}>camera_enhance</FontIcon>
          </IconButton>
          <IconButton tooltip={this.i18n.t("post:button.pick_sticker")} onTouchTap={(evt) => { evt.preventDefault(); this.pickSticker() } }>
            <FontIcon className="material-icons" color={grey600}>insert_emoticon</FontIcon>
          </IconButton>
        </div>
      </div>
    </div>;
  }
}