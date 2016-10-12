import * as React from 'react';
import { BusinessExceptionResponse } from '../../components';
import { GroupConsumerComponent } from '../currentGroupProviderInterface';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { Form, FormRadioButtonGroupField } from '../../controls';
import * as postSvc from '../../services/post';
import { PollVote } from '../../model/pollVote';
import { Post } from '../../model/post';
import { Bar } from "react-chartjs-2";
import { teal300, teal100, teal500 } from 'material-ui/styles/colors';

interface PostPollBoxState {
  voteId: number;
  post: Post;
  voted: boolean;
}

interface PostPollBoxProps extends React.Props<PostPollBox> {
  post: Post;
  onVoted?: { (pollVote: PollVote): void };
}

export class PostPollBox extends GroupConsumerComponent<PostPollBoxProps, PostPollBoxState> {
  constructor(props: PostPollBoxProps, ctx) {
    super(props, ctx);
    this.state = {
      voteId: 0,
      post: props.post,
      voted: false
    };
  }

  componentWillReceiveProps(nextProps: PostPollBoxProps, nextContext: any) {
    if (nextProps.post) {
      this.state.post = nextProps.post;
      this.setState(this.state);
    }
  }

  isUserAlreadyVote() {
    if (!this.props.post) {
      return false;
    }
    return this.state.voted || this.props.post.pollOptions.some(po => {
      return po.pollVotes.some(pv => pv.ownerId == this.serverInfoAPI.serverInfo.userProfile.id);
    });
  }

  render() {
    const userVoted = this.isUserAlreadyVote();
    if (this.props.post.pollOptions.length === 0) {
      return null;
    }
    return <div className="post post-poll-box">
      {!userVoted && this.props.post.pollable ? this.renderVote() : this.renderStatistic()}
    </div>;
  }

  async submitVote(model: PostPollBoxState) {
    let pollVote: PollVote = {
      id: 0,
      pollId: model.voteId,
      creationDate: new Date(),
      modificationDate: new Date(),
      rowVersion: null,
      ownerId: this.serverInfoAPI.serverInfo.userProfile.id
    };

    let pv = await postSvc.vote(this.httpClient, this.props.post.id, pollVote);
    if (!(pv as BusinessExceptionResponse).businessException) {
      let po = this.state.post.pollOptions.find(p => p.id === model.voteId);
      po.pollVotes.push(pv as PollVote);
      this.state.voted = true;
      this.setState(this.state);
      if (this.props.onVoted) {
        this.props.onVoted(pv as PollVote);
      }
    }
    return pv;
  }

  renderVote() {
    return !this.props.post ? null : < Form submitLabel= {this.i18n.t("post:button.vote")}
      unsaveConfirm={false}
      onChange={(model: PostPollBoxState) => {
        this.state.voteId = model.voteId;
        this.setState(this.state);
      } }
      onValidSubmit={this.submitVote.bind(this)}>
      <FormRadioButtonGroupField name="voteId">
        {!this.props.post ? null : this.props.post.pollOptions.map(p => {
          return <RadioButton value={p.id} label={p.content}/>
        })}
      </FormRadioButtonGroupField>
    </Form>;
  }

  renderStatistic() {
    if (!this.state.post.pollOptions.some(p => p.pollVotes.length > 0)) {
      return null;
    }
    const data = {
      labels: this.state.post.pollOptions.map(po => po.content),
      datasets: [
        {
          label: this.i18n.t("post:poll_graph"),
          backgroundColor: teal300,
          borderColor: teal500,
          borderWidth: 1,
          hoverBackgroundColor: teal100,
          hoverBorderColor: teal300,
          data: this.state.post.pollOptions.map(po => po.pollVotes.length)
        }
      ]
    };

    return <div className="post-poll statistic">
      <Bar data={data} height={100} options={{
        maintainAspectRatio: false
      }}/>
    </div>;
  }
}