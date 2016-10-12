import * as React from 'react';
import { DocumentTitle } from '../controls';
import RaisedButton from 'material-ui/RaisedButton';
import { browserHistory } from 'react-router';
import { red300 } from 'material-ui/styles/colors';
import { BaseComponent } from '../components';

export class Forbidden extends BaseComponent<any, void> {
    render() {
        const styles: React.CSSProperties = {
            padding: "50px 0",
            color: red300
        };
        return <DocumentTitle title={this.i18n.t("common:label.forbidden_page")}>
            <div className="row center-xs">
                <div className="col-xs-12">
                    <p style={styles}>{this.i18n.t("common:message.private_group_access_denied")}</p>
                    <RaisedButton label={this.i18n.t("common:button.go_back")} onTouchTap={(evt) => { evt.preventDefault(); browserHistory.push('/') } }/>
                </div>
            </div>
        </DocumentTitle>;
    }
}