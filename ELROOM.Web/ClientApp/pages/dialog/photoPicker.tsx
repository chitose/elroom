import * as React from 'react';
import Paper from 'material-ui/Paper';
import { Form, FormTextField, Constraints, FormFileUploadField, FormToggleField } from '../../controls';
import { BusinessExceptionResponse, BaseComponent } from '../../components';
import * as postSvc from '../../services/post';

interface PhotoPickerState {
    image: string;
}
export class PhotoPicker extends BaseComponent<any, PhotoPickerState> {
    constructor(props, ctx) {
        super(props, ctx);
        this.state = { image: "" };
    }

    save(model: PhotoPickerState) {
        this.systemAPI.closeDialog(model.image, true);
    }

    render() {
        return <Form submitLabel={this.i18n.t("post:button.choose_image")} unsaveConfirm={true}
            onChange={(model: PhotoPickerState) => { this.setState(model) } }
            onCancel={() => this.systemAPI.closeDialog(null)}
            onValidSubmit={this.save.bind(this)}>
            <FormFileUploadField maxSize={1024 * 1024 * 2} name="image" returnBase64={true}/>
        </Form>;
    }
}