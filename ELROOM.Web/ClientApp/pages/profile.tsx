import * as React from 'react';
import Paper from 'material-ui/Paper';
import * as auth from '../services/auth';
import { Form, FormTextField, Constraints, FormFileUploadField, FormToggleField } from '../controls';
import { RouteComponentProps } from 'react-router';
import { BusinessExceptionResponse, ProfileConsumerComponent } from '../components';
import { ProfileInfo } from '../model/profileInfo';

interface ProfileOptions {
  receiveNotification?: boolean;
}

export class ProfileDialog extends ProfileConsumerComponent<any, ProfileInfo> {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = this.serverInfoAPI.serverInfo.userProfile;
  }

  get profileOptions(): ProfileOptions {
    return JSON.parse(this.state.options || "{}") as ProfileOptions;
  }

  async save(model: ProfileInfo) {
    model.options = JSON.stringify({ receiveNotification: model["allowPush"] });
    delete model["allowPush"];
    const resp = await this.profileAPI.updateProfile(model);
    if (!(resp as BusinessExceptionResponse).businessException) {
      this.systemAPI.closeDialog(resp, true);
    }
    return resp;
  }

  public render() {
    return <Form submitLabel={this.i18n.t("common:button.save_change")} unsaveConfirm={true}
      onChange={(model: ProfileInfo) => { this.setState(model) } }
      onCancel={() => this.systemAPI.closeDialog(null)}
      onValidSubmit={this.save.bind(this)}>
      <FormTextField name="userName" value={this.state.userName} disabled={true} fullWidth={true} floatingLabelText={this.i18n.t("security:label.username")}/><br/>
      <FormTextField name="firstName" autoFocus={true} value={this.state.firstName} validators={[Constraints.isRequired()]} fullWidth={true} floatingLabelText={this.i18n.t("security:label.first_name")}/><br/>
      <FormTextField name="lastName" value={this.state.lastName} validators={[Constraints.isRequired()]} fullWidth={true} floatingLabelText={this.i18n.t("security:label.last_name")}/><br/>
      <FormFileUploadField existingImageUrl={`${auth.get_getFullImage_URL(this.state.id)}?r=${this.state.rowVersion}`} name="avatar" value={this.state.avatar} returnBase64={true}/>
      <FormToggleField name="allowPush" value={this.profileOptions.receiveNotification} label={this.i18n.t("security:label.allow_push_notification")} />      
    </Form>
  }
}