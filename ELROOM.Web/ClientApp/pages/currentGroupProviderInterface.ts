import * as React from 'react';
import { Group } from '../model/group';
import { BaseContextTypes, BaseComponent } from '../components';

export interface CurrentGroupAPI {
    group: Group;
    groupId: number;
}

export const GroupConsumerTypes = Object.assign({}, BaseContextTypes, {
    currentGroupAPI: React.PropTypes.object
});

export class GroupConsumerComponent<P, S> extends BaseComponent<P, S> {
    static contextTypes = GroupConsumerTypes;

    get currentGroup(): CurrentGroupAPI {
        return this.context["currentGroupAPI"] as CurrentGroupAPI;
    }
}