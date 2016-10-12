import * as React from 'react';
import i18n from 'i18next';

interface DocumentTitleProps extends React.Props<DocumentTitle> {
  title: string;
}

export class DocumentTitle extends React.Component<DocumentTitleProps, void> {
  constructor(props, ctx) {
    super(props, ctx);
    DocumentTitleService.setTitle(i18n.t(this.props.title));
  }

  componentWillReceiveProps(nextProps: DocumentTitleProps, nextContext: any) {
    if (nextProps.title) {
      DocumentTitleService.setTitle(i18n.t(nextProps.title));
    }
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

export class DocumentTitleService {
  static prefix = "";
  static subfix = "";
  static format = "";

  static lastTitle = "";

  static init(prefix?: string, subfix?: string, format?: string) {
    DocumentTitleService.prefix = prefix;
    DocumentTitleService.subfix = subfix;
    DocumentTitleService.format = format;
  }

  static getLastTitle(): string {
    return DocumentTitleService.lastTitle;
  }

  static setTitle(title: string): void {
    let text = "";
    if (DocumentTitleService.format) {
      text = DocumentTitleService.format;
      text = text.replace(/{{p}}/gi, DocumentTitleService.prefix);
      text = text.replace(/{{t}}/gi, title);
      text = text.replace(/{{s}}/gi, DocumentTitleService.subfix);
    }
    DocumentTitleService.lastTitle = text;
    if (typeof (document) !== "undefined") {
      document.title = text;
    }
  }
}