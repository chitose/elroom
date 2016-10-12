import * as React from 'react';
import Paper from 'material-ui/Paper';
import { Form, FormTextField, Constraints, FormFileUploadField, FormToggleField } from '../../controls';
import { BusinessExceptionResponse, BaseComponent } from '../../components';
import { Group } from '../../model/group';
import * as groupSvc from '../../services/group';

interface GroupDialogProps {
    group: Group;
}

export class GroupDialog extends BaseComponent<GroupDialogProps, Group> {
    constructor(props: GroupDialogProps, ctx) {
        super(props, ctx);
        this.state = props.group;
    }

    async save(model: Group) {
        const resp = await groupSvc.updateGroup(this.httpClient, Object.assign(this.props.group, model));
        if (!(resp as BusinessExceptionResponse).businessException) {
            this.systemAPI.closeDialog(resp as Group, true);
        }
        return resp;
    }

    public render() {
        return <Form submitLabel={this.i18n.t("common:button.save_change")} unsaveConfirm={true}
            onChange={(model: Group) => { this.setState(model) } }
            onCancel={() => this.systemAPI.closeDialog(null)}
            onValidSubmit={this.save.bind(this)}>
            <FormTextField name="name" autoFocus={true} value={this.state.name} validators={[Constraints.isRequired()]} fullWidth={true} floatingLabelText={this.i18n.t("group:label.name")}/><br/>
            <FormTextField name="description" rows={2} value={this.state.description} multiLine={true} fullWidth={true} floatingLabelText={this.i18n.t("group:label.description")}/><br/>
            <FormToggleField name="private" value={this.state.private} label={this.i18n.t("group:label.private")} />
            <FormFileUploadField maxSize={1024 * 1024 * 2} existingImageUrl={this.state.hasImage ? `${groupSvc.get_getFullImage_URL(this.state.id)}?r=${this.state.rowVersion}` : ''} name="uploadImage" returnBase64={true}/>
        </Form>;
    }
}