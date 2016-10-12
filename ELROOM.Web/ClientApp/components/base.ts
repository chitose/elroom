import * as React from 'react';
import { HttpClientAPI } from './httpClientProvider';
import { SystemAPI } from './systemProvider';
import { Theme } from '../theme/theme';
import { ServerInfoContextTypes, ServerInfoProviderAPI } from './serverInfoProvider';

export const BaseContextTypes = Object.assign({
    httpClient: React.PropTypes.object,
    i18n: React.PropTypes.object,
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object,
    systemAPI: React.PropTypes.object
}, ServerInfoContextTypes);

export abstract class BaseComponent<P, S> extends React.Component<P, S> {
    static contextTypes = BaseContextTypes;

    get router(): ReactRouter.Router {
        return this.context["router"];
    }

    get serverInfoAPI() {
        return (this.context["serverInfoAPI"]) as ServerInfoProviderAPI;
    }

    get theme(): Theme {
        return (this.context)["muiTheme"] as Theme;
    }

    get systemAPI() {
        return (this.context)["systemAPI"] as SystemAPI;
    }

    get httpClient(): HttpClientAPI {
        return this.context["httpClient"] as HttpClientAPI;
    }

    get i18n(): I18next.I18n {
        return this.context["i18n"] as I18next.I18n;
    }
}