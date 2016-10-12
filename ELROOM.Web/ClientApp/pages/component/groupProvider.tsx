import * as React from 'react';
import * as groupSvc from '../../services/group';
import { Group } from '../../model/group';
import { GroupDataResponse } from '../../model/groupDataResponse';
import { BaseComponent, BaseContextTypes } from '../../components';

interface GroupProviderState {
  favoriteGroups: Group[];
  followingGroups: Group[];
  publicGroups: Group[];
  ownedGroups: Group[];

  moreFavoriteGroups: boolean;
  moreFollowingGroups: boolean;
  morePublicGroups: boolean;
  moreOwnedGroups: boolean;
}

export interface GroupProviderAPI {
  favoriteGroups: Group[];
  followingGroups: Group[];
  publicGroups: Group[];
  ownedGroups: Group[];

  moreFavoriteGroups: boolean;
  moreFollowingGroups: boolean;
  morePublicGroups: boolean;
  moreOwnedGroups: boolean;

  setGroupFavorite(group: Group): void;
  removeGroupFromFavorite(group: Group): void;
  followGroup(group: Group): void;
  unfollowGroup(group: Group): void;
  newGroup(group: Group): void;
  editGroup(group: Group): void;
  deleteGroup(group: Group): void;
  loadGroupData(currentGroupType: string, currentGroupCount: number): void;
}

export class GroupProvider extends BaseComponent<any, GroupProviderState> implements GroupProviderAPI {
  static childContextTypes = {
    groupProvider: React.PropTypes.object
  }

  getChildContext() {
    return {
      groupProvider: this
    }
  }

  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      favoriteGroups: [],
      followingGroups: [],
      publicGroups: [],
      ownedGroups: [],
      moreFavoriteGroups: false,
      moreFollowingGroups: false,
      morePublicGroups: false,
      moreOwnedGroups: false,
    };
  }

  async componentWillMount() {
    this.loadGroupData("", 0);
  }

  get ownedGroups(): Group[] {
    return this.state.ownedGroups;
  }

  get favoriteGroups(): Group[] {
    return this.state.favoriteGroups;
  }

  get followingGroups(): Group[] {
    return this.state.followingGroups;
  }

  get publicGroups(): Group[] {
    return this.state.publicGroups;
  }

  get moreOwnedGroups(): boolean {
    return this.state.moreOwnedGroups;
  }

  get moreFavoriteGroups(): boolean {
    return this.state.moreFavoriteGroups;
  }

  get moreFollowingGroups(): boolean {
    return this.state.moreFollowingGroups;
  }

  get morePublicGroups(): boolean {
    return this.state.morePublicGroups;
  }

  async setGroupFavorite(group: Group) {
    let gr = await groupSvc.favorGroup(this.httpClient, group) as Group;
    this.state.favoriteGroups.push(gr);
    this.setState(this.state);
  };

  async removeGroupFromFavorite(group: Group) {
    let gr = await groupSvc.unFavorGroup(this.httpClient, group) as Group;
    this.state.favoriteGroups = this.state.favoriteGroups.filter(g => g.id !== group.id);
    let gi = this.state.followingGroups.findIndex(g => g.id === group.id);
    if (gi >= 0) {
      this.state.followingGroups[gi] = gr;
    }
    this.setState(this.state);
  }

  async followGroup(group: Group) {
    let gr = await groupSvc.followGroup(this.httpClient, group) as Group;
    this.state.followingGroups.push(gr);
    this.state.publicGroups = this.state.publicGroups.filter(g => g.id !== group.id);
    this.setState(this.state);
  }

  async unfollowGroup(group: Group) {
    let gr = await groupSvc.unfollowGroup(this.httpClient, group) as Group;
    this.state.followingGroups = this.state.followingGroups.filter(g => g.id !== group.id);
    this.state.favoriteGroups = this.state.favoriteGroups.filter(g => g.id !== group.id);
    this.publicGroups.push(gr);
    this.setState(this.state);
  }

  async loadGroupData(currentGroupType: string, currentGroupCount: number) {
    let resp = await groupSvc.getUserGroupData(this.httpClient, currentGroupType, currentGroupCount) as GroupDataResponse;
    const MAX_ROW = 5;
    if (resp.favoriteGroups !== null) {
      this.state.moreFavoriteGroups = resp.favoriteGroups.length < this.state.favoriteGroups.length + MAX_ROW ? false : true;
      this.state.favoriteGroups = resp.favoriteGroups;
    }

    if (resp.publicGroups !== null) {
      this.state.morePublicGroups = resp.publicGroups.length < this.state.publicGroups.length + MAX_ROW ? false : true;
      this.state.publicGroups = resp.publicGroups;
    }

    if (resp.followingGroups !== null) {
      this.state.moreFollowingGroups = resp.followingGroups.length < this.state.followingGroups.length + MAX_ROW ? false : true;
      this.state.followingGroups = resp.followingGroups;
    }

    if (resp.ownedGroups !== null) {
      this.state.moreOwnedGroups = resp.ownedGroups.length < this.state.ownedGroups.length + MAX_ROW ? false : true;
      this.state.ownedGroups = resp.ownedGroups;
    }

    this.setState(this.state);
  }

  newGroup(group: Group) {
    this.ownedGroups.push(group);
    this.followingGroups.push(group);
    this.setState(this.state);
  }
  editGroup(group: Group) {
    let gi = this.state.favoriteGroups.findIndex(x => x.id === group.id);
    if (gi >= 0) {
      this.state.favoriteGroups[gi] = group;
    }
    gi = this.state.followingGroups.findIndex(x => x.id === group.id);
    if (gi >= 0) {
      this.state.followingGroups[gi] = group;
    }
    gi = this.state.ownedGroups.findIndex(x => x.id === group.id);
    this.state.ownedGroups[gi] = group;
    this.setState(this.state);
  }
  deleteGroup(group: Group) {
    this.state.favoriteGroups = this.state.favoriteGroups.filter(g => g.id !== group.id);
    this.state.ownedGroups = this.state.ownedGroups.filter(g => g.id !== group.id);
    this.state.followingGroups = this.state.followingGroups.filter(g => g.id !== group.id);    
    this.setState(this.state);
  }


  render() {
    return this.props.children as any;
  }
}

export class GroupInfoConsumer<P, S> extends BaseComponent<P, S> {
  static contextTypes = Object.assign({}, BaseContextTypes, {
    groupProvider: React.PropTypes.object
  });

  get groupProvider(): GroupProviderAPI {
    return this.context["groupProvider"] as GroupProviderAPI;
  }
}