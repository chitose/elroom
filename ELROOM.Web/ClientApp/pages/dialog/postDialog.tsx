import * as React from 'react';
import Paper from 'material-ui/Paper';
import { Form, FormTextField, Constraints, FormFileUploadField, FormToggleField, FormDatePicker } from '../../controls';
import { BusinessExceptionResponse, BaseComponent } from '../../components';
import { Post } from '../../model/post';
import * as postSvc from '../../services/post';

interface PostDialogProps extends React.Props<PostDialog> {
    post: Post
}

export class PostDialog extends BaseComponent<PostDialogProps, Post> {
    constructor(props: PostDialogProps, ctx) {
        super(props, ctx);
        this.state = props.post;
    }

    async save(model: Post) {
        var updatePost = Object.assign(this.props.post, model);
        if (!model.hasPoll) {
            model.pollEnd = model.pollStart = null;
            model.postPollOptions = "";
        }
        let p = await postSvc.createOrUpdatePost(this.httpClient, updatePost);
        if (!(p as BusinessExceptionResponse).businessException) {
            this.systemAPI.closeDialog(p as Post, true);
        }
        return p;
    }

    render() {
        return <div style={{ paddingBottom: "15px" }}><Form submitLabel={this.i18n.t("common:button.save_change")} unsaveConfirm={true}
            onChange={(model: Post) => { this.setState(model) } }
            onCancel={() => this.systemAPI.closeDialog(null)}
            onValidSubmit={this.save.bind(this)}>
            <FormTextField name="title" autoFocus={true} value={this.state.title} fullWidth={true} floatingLabelText={this.i18n.t("post:label.title")}/><br/>
            <FormTextField name="content" rows={2} value={this.state.content} multiLine={true} fullWidth={true} floatingLabelText={this.i18n.t("post:label.content")} validators={[Constraints.isRequired()]}/><br/>
            <FormFileUploadField maxSize={1024 * 1024 * 2} existingImageUrl={this.state.hasImage ? `${postSvc.get_getFullImage_URL(this.state.id)}?r=${this.state.rowVersion}` : ''} name="uploadImage" value={this.state.hasImage} returnBase64={true}/>
            <div style={{ paddingTop: "20px" }}>
                <FormToggleField disabled={this.state.id > 0} name="hasPoll" value={this.state.hasPoll} label={this.i18n.t("post:label.poll")} />
            </div>
            {<FormTextField disabled={this.state.id > 0} name="postPollOptions" multiLine={true} fullWidth={true} rowsMax={10} floatingLabelText={this.i18n.t("post:label.poll_choices")}/>}
            {<FormDatePicker disabled={this.state.id > 0} name="pollStart" fullWidth={true} value={this.state.pollStart} floatingLabelText={this.i18n.t("post:label.poll_start")}/>}
            {<FormDatePicker disabled={this.state.id > 0} name="pollEnd" fullWidth={true} value={this.state.pollEnd} floatingLabelText={this.i18n.t("post:label.poll_end")}/>}
        </Form>
        </div>
    }
}