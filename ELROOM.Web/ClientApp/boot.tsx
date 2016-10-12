import './content/css/site.less';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory, Router } from 'react-router';
import { routes } from './routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { I18nextProvider } from 'react-i18next'; // as we build ourself via webpack
import i18n from 'i18next';
import { DocumentTitleService } from './controls';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { getDefaultLightTheme } from './theme/theme';
import { ServerInfoProvider, SystemProvider } from './components';
import { GroupProvider } from './pages/component/groupProvider';
import { ServerInfos, LANGUAGE_MODULES } from './common';
import { teal300 } from 'material-ui/styles/colors';
injectTapEventPlugin();


let theme = getDefaultLightTheme(getMuiTheme(lightBaseTheme));
theme.appBar.color = teal300;
theme.snackbar.backgroundColor = theme.appBar.color;

const serverInfo = window["serverInfos"] as ServerInfos;

i18n
    .init({
        resources: serverInfo.resources,
        fallbackLng: 'en',
        ns: LANGUAGE_MODULES,
        defaultNS: 'common',
        interpolation: {
            escapeValue: false // not needed for react!!
        }
    });

i18n.changeLanguage(serverInfo.language);

DocumentTitleService.init("", i18n.t("common:app_title"), "{{t}} - {{s}}");

ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <MuiThemeProvider muiTheme={theme}>
            <ServerInfoProvider serverInfo={serverInfo}>
                <SystemProvider>
                    <GroupProvider>
                        <Router history={browserHistory} children={routes} />
                    </GroupProvider>
                </SystemProvider>
            </ServerInfoProvider>
        </MuiThemeProvider>
    </I18nextProvider>,
    document.getElementById('react-app')
);