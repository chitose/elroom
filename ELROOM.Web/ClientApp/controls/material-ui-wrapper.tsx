import * as React from 'react';
import { FormField } from './formField';
import { FormFieldProps, FormFieldState } from './formcommon';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import Slider from 'material-ui/Slider';
import Checkbox from 'material-ui/Checkbox';
import { RadioButtonGroup } from 'material-ui/RadioButton';
import AutoComplete from 'material-ui/AutoComplete';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import TimePicker from 'material-ui/TimePicker';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import * as formatter from '../services/formatters';
import i18n from 'i18next';
import moment from 'moment';

export interface FormTextFieldProps extends __MaterialUI.TextFieldProps, FormFieldProps { }

export class FormTextField extends FormField<FormTextFieldProps, FormFieldState, TextField> {
  protected onKeyDownHandler(event: React.KeyboardEvent) {
    if (!this.props.multiLine && event.keyCode === 13) {
      event.preventDefault();
      event.stopPropagation();
      this.ownerForm.submit();
    }
  }

  render() {
    return <TextField {...this.childProps } ref={(ctrl) => this.wrappedControl = ctrl}
      className={this.getControlStateCss()}
      disabled={this.props.disabled}
      errorText={this.state.errorText}
      onKeyDown={this.onKeyDownHandler.bind(this)}
      onBlur={this.onBlurHandler.bind(this)}
      onChange={(evt) => this.updateValue((evt.target as HTMLInputElement).value)}
      value={this.state.value} ></TextField>;
  }

  focus() {
    if (this.wrappedControl) {
      this.wrappedControl.focus();
    }
  }
}

export interface FormDatePickerProps extends __MaterialUI.DatePicker.DatePickerProps, FormFieldProps { }

export class FormDatePicker extends FormField<FormDatePickerProps, FormFieldState, FormDatePicker> {
  initValue(props: FormDatePickerProps) {
    return props.value || null;
  }

  focus() {
    if (this.wrappedControl) {
      this.wrappedControl.focus();
    }
  }

  getFieldValue(): any {
    return new Date(moment(this.state.value).format("YYYY-MM-DDT00:00:00") + "Z");
  }

  dateTimeFormat(locale?: string, opt?: Intl.DateTimeFormatOptions) {
    return new Intl.DateTimeFormat(locale, opt);
  }

  render() {
    return <DatePicker {...this.childProps}  DateTimeFormat={this.dateTimeFormat.bind(this)} ref={(ctrl) => this.wrappedControl = ctrl}
      className={this.getControlStateCss()}
      locale={i18n.language}
      disabled={this.props.disabled}
      errorText={this.state.errorText}
      onBlur={this.onBlurHandler.bind(this)}
      onChange={(evt, date) => this.updateValue(date)}
      value={this.state.value}></DatePicker>;
  }
}

export interface FormSelectFieldProps extends __MaterialUI.SelectFieldProps, FormFieldProps { }

export class FormSelectField extends FormField<FormSelectFieldProps, FormFieldState, SelectField> {
  render() {
    return <SelectField {...this.childProps}
      className={this.getControlStateCss()}
      ref={(ctrl) => this.wrappedControl = ctrl}
      disabled={this.props.disabled}
      errorText={this.state.errorText}
      onChange={(evt, index, value) => this.updateValue(value)}
      value={this.state.value}>
      {this.props.children}
    </SelectField>;
  }
}

export interface FormSliderProps extends __MaterialUI.SliderProps, FormFieldProps { }

export class FormSliderField extends FormField<FormSliderProps, FormFieldState, Slider> {
  initValue(props: FormSliderProps) {
    return props.value || 0;
  }
  render() {
    return <Slider {...this.childProps}
      value={this.state.value}
      disabled={this.props.disabled}
      onBlur={this.onBlurHandler.bind(this)}
      onChange={(evt, value: number) => { this.updateValue(value) } }
      error={this.state.error}></Slider>
  }
}

export interface FormCheckBoxProps extends __MaterialUI.Switches.CheckboxProps, FormFieldProps { }

export class FormCheckBoxField extends FormField<FormCheckBoxProps, FormFieldState, Checkbox> {
  initValue(props: FormCheckBoxProps) {
    return props.value || false;
  }

  render() {
    return <Checkbox {...this.childProps}
      className={this.getControlStateCss()}
      checked={this.state.value}
      disabled={this.props.disabled}
      onCheck={(evt, checked) => this.updateValue(checked)}
      ></Checkbox>;
  }
}

export interface FormRadioButtonGroupProps extends __MaterialUI.Switches.RadioButtonGroupProps, FormFieldProps {
  name: string;
}

export class FormRadioButtonGroupField extends FormField<FormRadioButtonGroupProps, FormFieldState, RadioButtonGroup> {
  render() {
    return <RadioButtonGroup {...this.childProps}
      className={this.getControlStateCss()}
      defaultSelected={this.state.value}
      onChange={(evt, selected) => this.updateValue(selected)}>
      {this.props.children}
    </RadioButtonGroup>
  }
}

export interface FormToggleProps extends __MaterialUI.Switches.ToggleProps, FormFieldProps {
}

export class FormToggleField extends FormField<FormToggleProps, FormFieldState, Toggle> {
  initValue(props: FormToggleProps) {
    return props.value || false;
  }

  render() {
    return <Toggle {...this.childProps}
      className={this.getControlStateCss()}
      disabled={this.props.disabled}
      toggled={this.state.value}
      onToggle={(evt, toggled) => this.updateValue(toggled)}></Toggle>
  }
}

export interface FormTimePickerProps extends __MaterialUI.TimePickerProps, FormFieldProps {
}

export class FormTimePickerField extends FormField<FormTimePickerProps, FormFieldState, TimePicker>{
  initValue(props: FormTimePickerProps) {
    return props.value || props.defaultValue || null;
  }

  getFieldValue(): any {
    return new Date(moment(this.state.value).format("YYYY-MM-DDT00:00:00") + "Z");
  }

  focus() {
    if (this.wrappedControl) {
      this.wrappedControl.focus();
    }
  }

  render() {
    return <TimePicker {...this.childProps} ref={(ctrl) => this.wrappedControl = ctrl}
      className={this.getControlStateCss()}
      errorText={this.state.errorText}
      disabled={this.props.disabled}
      onBlur={this.onBlurHandler.bind(this)}
      value={this.state.value}
      onChange={(evt, time) => this.updateValue(time, this.updateFormModelAndValidate.bind(this))}
      ></TimePicker>
  }
}

export interface FormFileUploadProps extends React.Props<FormFileUploadField>, FormFieldProps {
  name: string;
  maxSize?: number;
  allowExts?: string[];
  hintMessage?: string;
  returnBase64?: boolean;
  value?: any;
  existingImageUrl?: string;
  onFileLoaded?: { (file: File): void };
}

interface FormFileUploadState extends FormFieldState {
  size: number;
  fileName: string;
  previewData: string;
  previewIcon: string;
  existingImageUrl: string;
}

export class FormFileUploadField extends FormField<FormFileUploadProps, FormFileUploadState, HTMLInputElement> {
  private fileInput: HTMLInputElement;

  constructor(props: FormFileUploadProps, ctx) {
    super(props, ctx);
    this.state.existingImageUrl = this.props.existingImageUrl;
  }

  handleFileChange(evt: React.FormEvent) {
    if (this.fileInput.files) {
      this.processFile(this.fileInput.files[0]);
    }
  }

  processFile(file: File) {
    const state = this.validateFile(file);
    const isValid = state["isValid"];
    var updateState = {
      size: isValid ? file.size : 0,
      fileName: file.name
    };
    if (!this.props.returnBase64) {
      updateState["value"] = isValid ? file.name : ""
    }
    if (isValid && this.props.onFileLoaded) {
      this.props.onFileLoaded(file);
    }
    this.setState(Object.assign(state, updateState), this.updateFormModelAndValidate.bind(this));
  }

  initValue(props: FormFileUploadProps) {
    return props.value || "";
  }

  readFileContent(file: File, cb: { (base64content: string) }) {
    let fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      cb(fileReader.result);
    });
    fileReader.readAsDataURL(file);
  }

  private validateFile(file: File): any {
    let isValid = true;
    let result = {};
    let msgs = [];
    if (this.props.maxSize && file.size > this.props.maxSize) {
      isValid = false;
      msgs.push(i18n.t("validation:file_too_big", { size: formatter.formatBytes(this.props.maxSize) } as any));
    }
    let exts = file.name.split('.');
    let ext = exts[exts.length - 1].toLowerCase();

    if (this.props.allowExts) {
      isValid = this.props.allowExts.filter(e => e.toLowerCase() === ext).length > 0;
      if (!isValid) {
        msgs.push(i18n.t("validation:not_allowed_extension", { ext: this.props.allowExts.join(",") } as any));
      }
    }

    if (isValid) {
      // preview image
      if (["jpg", "jpeg", "bmp", "png", "gif"].indexOf(ext) >= 0) {
        this.readFileContent(file, (data) => {
          this.setState(Object.assign({}, this.state, {
            previewData: data,
            previewIcon: "",
            value: this.props.returnBase64 ? data : this.state.value
          }));
        });
      } else {
        if (this.props.returnBase64) {
          this.readFileContent(file, (data) => {
            this.setState(Object.assign({}, this.state, {
              value: data
            }));
          });
        }

        const dicts = {
          "fa-file-excel-o": "xlx_xlsx".split('_'),
          "fa-file-pdf-o": "pdf".split('_'),
          "fa-file-sound-o": "mp3_wav_ogg_ac3_acc".split('_'),
          "fa-file-word-o": "doc_docx".split('_'),
          "fa-file-archive-o": "zip_rar_7z_cab".split('_'),
          "fa-file-text-o": "txt_rtf_html".split('_'),
          "fa-file-powerpoint-o": "ppt_pptx".split('_')
        };
        let iconCss = "fa-file-o";
        Object.keys(dicts).forEach(k => {
          if (dicts[k].indexOf(ext) >= 0) {
            iconCss = k;
          }
        });
        result["previewIcon"] = "fa file-icon " + iconCss;
      }
    }

    return Object.assign(result, {
      isValid: isValid,
      isDirty: true,
      isTouched: true,
      errorText: msgs.map(m => <div key={m}>{m}</div>)
    });
  }

  private removeFile() {
    this.setState(Object.assign({}, this.state, {
      value: "",
      previewData: "",
      fileName: "",
      previewIcon: "",
      existingImageUrl: ""
    }), this.updateFormModelAndValidate.bind(this));
  }

  private getHintLabel(): string {
    var msg = "";
    if (this.state.size)
      msg = formatter.formatBytes(this.state.size);
    return this.state.fileName ? (this.state.fileName + " - " + msg) : "";
  }

  private containerDiv: HTMLDivElement;

  fileDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  fileDrop(e: DragEvent) {
    this.fileDragOver(e);
    // fetch FileList object
    var files = e.dataTransfer.files;

    // process all File objects
    if (files && files.length === 1) {
      this.processFile(files[0]);
    }
  }

  componentDidMount() {
    if (this.containerDiv) {
      this.containerDiv.addEventListener("dragover", this.fileDragOver.bind(this), false);
      this.containerDiv.addEventListener("dragleave", this.fileDragOver.bind(this), false);
      this.containerDiv.addEventListener("drop", this.fileDrop.bind(this), false);
    }
  }

  render() {
    return <div className={"file-upload " + this.getControlStateCss()} ref={(d) => { this.containerDiv = d } }>
      <FlatButton onTouchTap={() => this.removeFile()} icon={<FontIcon className="icon material-icons">close</FontIcon>}></FlatButton>
      <div className="info-wrapper">
        <FontIcon className="icon material-icons">cloud_upload</FontIcon>
        <div className="info">{this.props.hintMessage || "Drag and drop a file here or click"}</div>
        <div className="error">{this.state.errorText}</div>
      </div>
      <input type="file" className="file" onChange={this.handleFileChange.bind(this)} ref={(ip) => this.fileInput = ip}/>
      {this.state.previewData || this.state.existingImageUrl ? <img className="preview-img" src={this.state.previewData || this.state.existingImageUrl} /> : null}
      {this.state.previewIcon ? <FontIcon className={this.state.previewIcon}/> : null}
      <div className="preview-container">
        <div className="preview">
          <div className="file-info">{this.getHintLabel()}</div>
          <div className="info">{this.props.hintMessage || "Drag and drop a file here or click to replace"}</div>
          <div className="error">{this.state.errorText}</div>
        </div>
      </div>
    </div>
  }
}

export interface FormNumberFieldProps extends __MaterialUI.TextFieldProps {
  isDecimal?: boolean;
  allowNegative?: boolean;
}

export class FormNumberField extends FormField<FormNumberFieldProps, FormFieldState, TextField> {
  private isNavigationKey(keyCode: number): boolean {
    if (keyCode === 35 || keyCode === 36
      || keyCode === 37 || keyCode === 39
      || keyCode === 8 || keyCode === 9
      || keyCode === 46
      // - minus
      || (this.props.allowNegative && (String(this.state.value)[0] !== "-") && (keyCode === 109 || keyCode == 189))
      // . (decimal point)
      || (this.props.isDecimal && (keyCode === 110 || keyCode === 190) && String(this.state.value).indexOf(".") < 0)
    ) {
      return true;
    }
    return false;
  }
  onKeydown(evt: React.KeyboardEvent) {
    super.onKeyDownHandler(evt);
    if (this.isNavigationKey(evt.which)) {
      return;
    }
    if ((evt.which < 48 || evt.which > 57) && (evt.which < 96 || evt.which > 105)) {
      evt.preventDefault();
      return;
    }
  }

  getFieldValue() {
    let value: any = this.state.value;
    if (value && value.length > 0 && value[0] === ".") {
      value = "0" + value;
    } else if (value && value.length > 0 && value.endsWith(".")) {
      value = value.substr(0, value.length - 2);
    }
    if (!value || /^\s*$/.test(value)) {
      value = null;
    } else if (value[0] !== "." && value[value.length - 1] !== ".") {
      value = this.props.isDecimal ? parseFloat(value) : parseInt(value, 10);
      if (isNaN(value)) {
        value = null;
      }
    }
    return value;
  }

  focus() {
    if (this.wrappedControl) {
      this.wrappedControl.focus();
    }
  }

  render() {
    return <TextField errorText={this.state.errorText} ref={(ctrl) => this.wrappedControl = ctrl}
      value={String(this.state.value)}
      className={this.getControlStateCss()}
      disabled={this.props.disabled}
      onKeyDown={this.onKeydown.bind(this)}
      onBlur={this.onBlurHandler.bind(this)}
      onChange={(evt) => this.updateValue((evt.target as HTMLInputElement).value)}
      >
    </TextField>
  }
}

export interface FormAutocompleteFieldProps extends __MaterialUI.AutoCompleteProps {
  remoteDatasource?: { (searchText: string): Promise<any[]> };
  displayTemplate?: { (item: any): string | JSX.Element };
  value?: any;
  name: string;
  acceptInvalid?: boolean;
}

interface FormAutocompleteState extends FormFieldState {
  data: any[];
}

export class FormAutocompleteField extends FormField<FormAutocompleteFieldProps, FormAutocompleteState, AutoComplete> {
  constructor(props: FormAutocompleteFieldProps, ctx) {
    super(props, ctx);
    if (props.dataSource && props.displayTemplate) {
      this.state.data = (props.dataSource as any[]).map(item => props.displayTemplate(item));
    } else {
      this.state.data = [];
    }
  }
  initValue(props: FormAutocompleteFieldProps) {
    return props.value || "";
  }

  getFieldValue(): any {
    return this.state.value || null;
  }

  async onUpdateInputHandler(searchText: string, dataSource: __MaterialUI.AutoCompleteDataSource) {
    if (this.props.remoteDatasource) {
      let data = await this.props.remoteDatasource(searchText);
      this.setState(Object.assign({}, this.state, { data: this.props.displayTemplate ? data.map(it => this.props.displayTemplate(it)) : data }));
    }
  }

  onNewRequestHandler(textString: string, index: number) {
    if (index >= 0) {
      if (this.props.dataSourceConfig) {
        this.updateValue(this.state.data[index][this.props.dataSourceConfig.value]);
      } else {
        this.updateValue(this.state.data[index]);
      }
    } else {
      if (this.props.acceptInvalid) {
        this.updateValue(textString);
      } else {
        const match = this.state.data.find(v => {
          if (this.props.dataSourceConfig) {
            return String(v[this.props.dataSourceConfig.text]) === textString
              || String(v[this.props.dataSourceConfig.value]) === textString;
          }
          return String(v) === textString;
        });
        if (match) {
          this.updateValue(match);
        } else {
          this.updateValue("");
        }
      }
    }
  }

  render() {
    return <AutoComplete {...this.props} onNewRequest={this.onNewRequestHandler.bind(this)} dataSource={this.state.data} onUpdateInput={this.onUpdateInputHandler.bind(this)} />;
  }
}