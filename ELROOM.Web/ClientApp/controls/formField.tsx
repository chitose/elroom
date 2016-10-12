import * as React from 'react';
import { FormFieldApi, FormApi, DictionaryType, FormFieldProps, FormFieldState, FormContext } from './formcommon';
import { ValidationResult } from './validators';

export abstract class FormField<P extends FormFieldProps, S extends FormFieldState, C> extends React.Component<P, S> implements FormFieldApi {
    protected childProps: P;
    protected wrappedControl: C;
    constructor(props: P, context: FormContext) {
        super(props, context);

        this.state = {} as S;
        this.state.errorText = props.errorText || "";
        this.state.error = props.error || "";
        this.state.value = this.initValue(props);
        this.state.isDirty = false;
        this.state.isValid = true;
        this.state.isTouched = false;

        this.childProps = Object.assign({}, this.props);
        ["validators", "value"].forEach(k => {
            delete this.childProps[k];
        });

        if (!context.ownerForm) {
            throw Error("Form field need to be placed inside <Form> component.");
        }
    }

    getFieldValue(): any {
        return this.state.value;
    }

    static contextTypes = {
        ownerForm: React.PropTypes.any
    }

    get ownerForm(): FormApi {
        return (this.context as FormContext).ownerForm;
    }

    resetState() {
        this.setState(Object.assign({}, this.state, {
            isDirty: false,
            isValid: true
        }));
    }

    focus() {
    }

    protected getControlStateCss() {
        var res = [];
        if (this.state.isDirty) {
            res.push("ctrl-dirty");
        }
        if (this.state.isValid) {
            res.push("ctrl-valid");
        } else {
            res.push("ctrl-invalid");
        }
        if (this.state.isTouched) {
            res.push("ctrl-touched");
        }
        if (this.state.value) {
            res.push("has-file");
        }
        return res.join(" ");
    }

    protected initValue(props: P) {
        return props["value"] || "";
    }

    componentWillMount() {
        this.ownerForm.attachToForm.apply(this.ownerForm, [this]);
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            setTimeout(() => {
                this.focus();
            }, 50);
        }
    }

    componentWillUnmount() {
        this.ownerForm.detachFromForm.apply(this.ownerForm, [this]);
    }

    updateStatus(errors: DictionaryType<ValidationResult>, onSubmit?: boolean, cb?: { (): void }) {
        let isValid = !errors || Object.keys(errors).length === 0;
        this.setState(Object.assign({}, this.state, {
            isValid: isValid
        }), () => {
            if (cb) { cb() }
            this.onValidate(errors, onSubmit);
        });
    }

    private onValidate(errors: DictionaryType<ValidationResult>, onSubmit: boolean) {
        // only show error when control is touched
        if (!this.state.isTouched && !onSubmit) {
            return;
        }
        if (!errors || Object.keys(errors).length === 0) {
            this.setValidationError("", "");
        } else {
            let i = 0;
            this.setValidationError(
                Object.keys(errors).map(type => {
                    return <div key={i++}>{errors[type].message}</div>;
                }),
                Object.keys(errors).map(type => {
                    return errors[type].message;
                }).join(""));
        }
    }

    protected setValidationError(errorText: React.ReactNode, error: string) {
        this.setState(Object.assign({}, this.state, { errorText, error }));
    }

    protected updateValue(value: any, callback?: { (): void }) {
        this.setState(Object.assign({}, this.state,
            {
                value: value,
                isDirty: true
            }), callback || this.updateFormModelAndValidate.bind(this));
    }

    protected onBlurHandler(event: React.FormEvent) {
        this.setState(Object.assign({}, this.state, {
            isTouched: true
        }));
    }

    protected updateFormModelAndValidate() {
        this.ownerForm.updateValueAndValidility.apply(this.ownerForm, [this]);
    }

    protected onKeyDownHandler(event: React.KeyboardEvent) {
        if (event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();
            this.ownerForm.submit();
        }
    }
}