import "babel-polyfill";

import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext, browserHistory, Router } from 'react-router';
import createMemoryHistory from 'history/lib/createMemoryHistory';
import { routes } from './routes';
type BootResult = { html?: string, globals?: { [key: string]: any }, redirectUrl?: string };

import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { getDefaultLightTheme } from './theme/theme';
import { DocumentTitleService } from './controls';

import { ServerInfoProvider, SystemProvider } from './components';
import { LANGUAGE_MODULES } from './common';
import { GroupProvider } from './pages/component/groupProvider';

injectTapEventPlugin();

let theme = getDefaultLightTheme(getMuiTheme(lightBaseTheme));
theme.snackbar.backgroundColor = theme.appBar.color;

export default function (params: any): Promise<{ html: string }> {
  return new Promise<BootResult>((resolve, reject) => {
    match({ routes: routes, location: params.location }, (error, redirectLocation, renderProps: any) => {
      if (error) {
        throw error;
      }

      // If there's a redirection, just send this information back to the host application
      if (redirectLocation) {
        resolve({ redirectUrl: redirectLocation.pathname });
        return;
      }

      // If it didn't match any route, renderProps will be undefined
      if (!renderProps) {
        throw new Error(`The location '${params.url}' doesn't match any route configured in react-router.`);
      }

      i18n
        .init({
          resources: params.data.resources,
          fallbackLng: 'en',
          ns: LANGUAGE_MODULES,
          defaultNS: 'common',
          interpolation: {
            escapeValue: false // not needed for react!!
          }
        });
      const useri18n = i18n.cloneInstance();
      useri18n.changeLanguage(params.data.language || "en");

      DocumentTitleService.init("", useri18n.t("common:app_title"), "{{t}} - {{s}}");

      theme.userAgent = params.data.userAgent;
      const app = (
        <I18nextProvider i18n={useri18n}>
          <MuiThemeProvider muiTheme={theme}>
            <ServerInfoProvider serverInfo={params.data}>
              <SystemProvider>
                <GroupProvider>
                  <RouterContext {...renderProps}/>
                </GroupProvider>
              </SystemProvider>
            </ServerInfoProvider>
          </MuiThemeProvider>
        </I18nextProvider>
      );

      // Perform an initial render that will cause any async tasks (e.g., data access) to begin
      renderToString(app);

      const docTitle = DocumentTitleService.getLastTitle();
      // Once the tasks are done, we can perform the final render
      params.domainTasks.then(() => {
        resolve({
          html: renderToString(app),
          globals: {
            serverInfos: params.data,
            documentTitle: docTitle
          }
        });
      }, reject); // Also propagate any errors back into the host application
    });
  });
}