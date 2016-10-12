import * as React from 'react';
import { ServerInfos } from '../common';
interface ServerInfoProviderProps extends React.Props<ServerInfoProvider> {
    serverInfo: ServerInfos
}

interface ServerInfoProviderState {
    serverInfo: ServerInfos
}

export interface ServerInfoProviderAPI {
    serverInfo: ServerInfos;
    updateServerInfo(serverInfo: ServerInfos): void;
}

export const ServerInfoContextTypes = {
    serverInfoAPI: React.PropTypes.object
};

export class ServerInfoProvider extends React.Component<ServerInfoProviderProps, ServerInfoProviderState> implements ServerInfoProviderAPI {
    constructor(props: ServerInfoProviderProps, ctx) {
        super(props, ctx);
        this.state = {
            serverInfo: props.serverInfo
        };
    }

    static childContextTypes = ServerInfoContextTypes;

    getChildContext() {
        return {
            serverInfoAPI: this
        };
    }

    updateServerInfo(serverInfo: ServerInfos): void {
        this.setState({ serverInfo: serverInfo });
    }

    get serverInfo() {
        return this.state.serverInfo;
    }
        
    render() {
        return this.props.children as any;
    }
}