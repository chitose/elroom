import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Validator, ValidationResult } from './validators';
import { BaseComponent, BusinessExceptionResponse, DialogContentAPI, BaseContextTypes } from '../components';
import { FormApi, FormFieldApi, DictionaryType, FormContext } from './formcommon';
import i18n from 'i18next';
import CircularProgress from 'material-ui/CircularProgress';
import { browserHistory } from 'react-router';
import FlatButton from 'material-ui/FlatButton';

type FormSubmitEvent = {
    (model: DictionaryType<any>): Promise<BusinessExceptionResponse>;
}

type FormValidationEvent = {
    (errors: DictionaryType<any>): void;
}

export interface FormProps extends React.Props<Form> {
    submitLabel?: string;
    title?: string;
    hideSavedInfo?: boolean;
    cancelLabel?: string;
    onCancel?: React.MouseEventHandler;
    onValidSubmit?: FormSubmitEvent;
    onValidationError?: FormValidationEvent;
    onChange?: { (model: DictionaryType<any>): void };
    unsaveConfirm?: ReactRouter.PlainRoute | boolean
}

export interface FormState {
    isValid?: boolean;
    isDirty?: boolean;
    errors?: DictionaryType<any>;
    serverMessage?: string;
    submitting: boolean;
}

export class Form extends BaseComponent<FormProps, FormState> implements FormApi, React.ChildContextProvider<FormContext> {
    ignoreSaveConfirm = false;
    static childContextTypes = {
        ownerForm: React.PropTypes.any
    }

    isValid() {
        return this.state.isValid;
    }

    isDirty() {
        return this.state.isDirty;
    }

    getChildContext() {
        return {
            ownerForm: this
        };
    }

    static contextTypes = Object.assign({}, BaseContextTypes, {
        dialogOwner: React.PropTypes.object
    });

    get dialogOwner(): DialogContentAPI {
        return this.context["dialogOwner"] as DialogContentAPI;
    }

    inputs: { [key: string]: FormFieldApi };
    model: { [key: string]: any };

    constructor(props: FormProps, context: any) {
        super(props, context);
        this.state = {
            isDirty: false,
            isValid: true,
            errors: {},
            serverMessage: "",
            submitting: false
        };
    }

    componentWillMount() {
        this.inputs = {};
        this.model = {};
        const router = (this.context as { router: ReactRouter.RouterOnContext }).router;
        if (this.props.unsaveConfirm && typeof this.props.unsaveConfirm !== 'boolean') {
            router.setRouteLeaveHook(this.props.unsaveConfirm, (nextLocation: HistoryModule.Location) => {
                if (this.state.isDirty && !this.ignoreSaveConfirm) {
                    this.systemAPI.confirm("", this.i18n.t("common:message.save_change_confirm")).then((r) => {
                        if (r) {
                            this.ignoreSaveConfirm = true;
                            browserHistory.push(nextLocation);
                        }
                    });
                    return false;
                }
                return true;
            });
        }
        if (this.dialogOwner) {
            this.dialogOwner.registerForm(this);
        }
    }

    isIgnoreSaveConfirm() {
        return !this.props.unsaveConfirm;
    }

    reset() {
        this.setState({
            isValid: true,
            isDirty: false,
            errors: {},
            serverMessage: "",
            submitting: false
        });
        window.onbeforeunload = null;
    }

    componentWillUnMount() {
        if (this.dialogOwner) {
            this.dialogOwner.unregisterForm(this);
        }
        window.onbeforeunload = null;
    }

    componentDidMount() {
        if (typeof (window) !== "undefined" && this.props.unsaveConfirm) {
            window.onbeforeunload = () => {
                if (this.state.isDirty) {
                    return this.i18n.t("common:message.save_change_confirm");
                }
                return undefined;
            }
        }
    }

    render() {
        return <form onSubmit={this.submitFormHandler.bind(this)} className={this.getFormStatusClassName() + (this.state.submitting ? " form-submitting" : "")}>
            {this.props.title ? <div className="form-title"><span>{this.i18n.t(this.props.title)}</span>
                {this.state.submitting ? <div className="indicator"><CircularProgress size={0.5}/></div> : null}</div> : null}
            <div className="form-body">
                {this.props.children}
                <div className="form-footer">
                    <RaisedButton disabled={this.state.submitting || !this.state.isDirty} type="submit" label={this.props.submitLabel || this.i18n.t("common:button.submit")}/>
                    {this.props.onCancel ? <RaisedButton type="button" label={this.props.cancelLabel || this.i18n.t("common:button.cancel")} onClick={this.props.onCancel}/> : null}
                </div>
                {this.getServerValidationElement()}
            </div>
        </form>
    }

    getField(name: string): FormFieldApi {
        return this.inputs[name];
    }

    updateValueAndValidility(field: FormFieldApi) {
        this.model[field.props.name] = field.getFieldValue();
        var result = this.validateInput(field);
        let errors = this.state.errors || {};
        if (result) {
            errors[field.props.name] = result;
        } else {
            delete errors[field.props.name];
        }
        this.updateFormValidility(errors);
        if (this.props.onChange) {
            this.props.onChange(this.model);
        }
    }

    detachFromForm(field: FormFieldApi) {
        delete this.inputs[field.props.name];
        delete this.model[field.props.name];
        if (this.props.onChange) {
            this.props.onChange(this.model);
        }
    }

    attachToForm(field: FormFieldApi) {
        this.inputs[field.props.name] = field;
        this.model[field.props.name] = field.getFieldValue();
        if (this.props.onChange) {
            this.props.onChange(this.model);
        }
    }

    updateModel() {
        Object.keys(this.inputs).forEach(k => this.model[k] = this.inputs[k].state.value);
    }

    validateInput(field: FormFieldApi, initiator?: FormFieldApi, onSubmit?: boolean): DictionaryType<ValidationResult> {
        initiator = initiator || field;
        var terrors = {} as DictionaryType<ValidationResult>;
        let dep = [];
        if (field.props.validators) {
            field.props.validators.forEach(v => {
                if (v.dependencies) {
                    v.dependencies.forEach(d => {
                        if (dep.indexOf(d) < 0) {
                            dep.push(d);
                        }
                    });
                }
                let cvr = v.isValid(field.getFieldValue(), this.model);
                if (cvr) {
                    terrors = Object.assign({}, terrors, cvr);
                }
            });

            field.updateStatus(terrors, onSubmit, () => {
                dep.forEach(dfield => {
                    let targetField = this.getField(dfield);
                    if (targetField !== initiator) {
                        this.validateInput(targetField, field, onSubmit);
                    }
                });
            });
        }

        return terrors;
    }

    validate() {
        let errors: DictionaryType<any> = {} as DictionaryType<any>;
        Object.keys(this.inputs).forEach(name => {
            let vr = this.validateInput(this.inputs[name], null, true);
            if (vr && Object.keys(vr).length > 0) {
                errors[name] = vr;
            }
        });
        this.updateFormValidility(errors);
        return errors;
    }

    submitFormHandler(e: React.FormEvent) {
        e.preventDefault();
        this.submit();
    }

    submitInternal() {
        let hasError = false;
        let pendingSubmit = false;
        this.updateModel();
        let vr = this.validate();
        hasError = (vr && Object.keys(vr).length > 0);
        if (!hasError && this.props.onValidSubmit) {
            pendingSubmit = true;
            this.props.onValidSubmit(this.model).then(sr => {
                if ((sr as BusinessExceptionResponse).businessException) {
                    hasError = true;
                    this.setState(Object.assign({}, this.state, {
                        serverMessage: i18n.t(sr.message)
                    }));
                } else {
                    this.setState(Object.assign({}, this.state, {
                        serverMessage: ""
                    }));
                }
                this.setFormSubmitStatus(hasError);
            }).catch((reason) => {
                this.setFormSubmitStatus(true);
            });
        } else if (this.props.onValidationError) {
            this.props.onValidationError(vr);
        }

        if (!pendingSubmit) {
            this.setFormSubmitStatus(hasError);
        }
    }

    private setFormSubmitStatus(hasError: boolean) {
        if (!hasError) {
            Object.keys(this.inputs).forEach(name => {
                this.inputs[name].resetState();
            });
        }

        if (!hasError) {
            this.systemAPI.snack(this.i18n.t("common:message.save_ok"), 4000);
        }

        this.setState(Object.assign({}, this.state, {
            submitting: false,
            isDirty: hasError ? this.state.isDirty : false,
            isValid: hasError ? this.state.isValid : true,
        }));
    }

    submit() {
        this.setState(Object.assign({}, this.state, { submitting: true }), this.submitInternal.bind(this));
    }

    private getFormStatusClassName() {
        var res = [];
        if (this.state.isDirty) {
            res.push("form-dirty");
        }
        if (this.state.isValid) {
            res.push("form-valid");
        }
        return res.join(" ");
    }

    private getServerValidationElement() {
        if (this.state.serverMessage && this.state.serverMessage !== "") {
            return <div className="form-errors">{this.state.serverMessage}</div>
        }
        return null;
    }

    private updateFormValidility(errors: DictionaryType<any>) {
        this.setState(Object.assign({}, this.state, {
            errors: errors,
            isValid: !errors || Object.keys(errors).length === 0,
            isDirty: true
        }));
    }
}