import * as React from 'react';
import { Router, Route, HistoryBase, RouterState, RedirectFunction, IndexRoute } from 'react-router';
import { Layout } from './pages/layout';
import { Home } from './pages/home';
import { Forbidden } from './pages/forbidden';
import { TestPage } from './pages/test';
import { GroupHome } from './pages/groupHome';
import { PostHome } from './pages/postHome';
import { ServerInfos } from './common';

export interface RouteConfig {
    path: string;
    component: any
}

export const RoutePaths = {
    root: "/",
    groupHome: (id: number): string => { return `/group/${id || ':groupId'}`; },
    postHome: (id: number): string => { return `/post/${id || ':postId'}`; },
    forbidden: "/forbidden"
}

const serverInfo = window["serverInfos"] as ServerInfos;

function privateGroupGuard(nextState: RouterState, replace: RedirectFunction) {
    if (nextState.location.pathname !== RoutePaths.forbidden) {
        const groupId = nextState.params["groupId"];
        if (groupId) {
            const gi = parseInt(groupId, 10);
            if (serverInfo.userProfile.privateGroups.indexOf(gi) >= 0 && serverInfo.userProfile.groups.indexOf(gi) < 0) {
                replace({
                    pathname: RoutePaths.forbidden,
                    state: { nextPathname: nextState.location.pathname }
                });
            }
        }
    }
}

function routeChange(prevState: RouterState, nextState: RouterState, replace: RedirectFunction) {
    privateGroupGuard(nextState, replace);
}

export const routes = <Route path={RoutePaths.root} component={Layout}>
    <IndexRoute components={{ body: Home as any }}/>
    <Route path={RoutePaths.groupHome(null) } components={{ body: GroupHome as any }} onEnter={privateGroupGuard} onChange={routeChange}/>
    <Route path={RoutePaths.postHome(null) } components={{ body: PostHome as any }} onChange={routeChange}/>
    <Route path={RoutePaths.forbidden} components={{ body: Forbidden as any }}/>
</Route>;