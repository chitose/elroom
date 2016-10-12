import * as React from 'react';
import { browserHistory } from 'react-router';
import { Right } from '../model/enums';
import { BusinessExceptionResponse } from './httpClientProvider';
import { BaseComponent, BaseContextTypes } from './base';
import { RoutePaths } from '../routes';
import { ProfileInfo } from '../model/profileInfo';
import * as authSvc from '../services/auth';
import { ServerInfos } from '../common';

export interface ProfileAPI {
    updateProfile(profile: ProfileInfo): Promise<ProfileInfo | BusinessExceptionResponse>;
}

interface ProfileProviderProps extends React.Props<ProfileProvider> {

}

export class ProfileProvider extends BaseComponent<ProfileProviderProps, void> implements ProfileAPI {
    constructor(props: any, ctx) {
        super(props, ctx);
    }

    static childContextTypes = {
        profileAPI: React.PropTypes.any
    }

    getChildContext() {
        return {
            profileAPI: this
        };
    }

    async updateProfile(profile: ProfileInfo) {
        const resp = await authSvc.updateProfile(this.httpClient, profile);
        if (!(resp as BusinessExceptionResponse).businessException) {
            let si = this.serverInfoAPI.serverInfo;
            si.userProfile = resp as ProfileInfo;
            this.serverInfoAPI.updateServerInfo(si);
        }
        return resp;
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}

export abstract class ProfileConsumerComponent<P, S> extends BaseComponent<P, S> {
    static contextTypes = Object.assign({}, BaseContextTypes, {
        profileAPI: React.PropTypes.object
    });

    get profileAPI() {
        return this.context["profileAPI"] as ProfileAPI;
    }

    render() {
        return this.props.children as any;
    }
}