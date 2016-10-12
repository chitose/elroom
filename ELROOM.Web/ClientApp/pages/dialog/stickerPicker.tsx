import * as React from 'react';
import Paper from 'material-ui/Paper';
import { GridList, GridTile } from 'material-ui/GridList';
import { BaseComponent } from '../../components';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import * as stickerSvc from '../../services/stickers';

interface StickerPickerState {
  sticker: string;
  stickers: { [key: string]: string[] }
}
export class StickerPicker extends BaseComponent<any, StickerPickerState> {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = { sticker: "", stickers: {} };
  }

  async componentWillMount() {
    this.state.stickers = await stickerSvc.getAllStickers(this.httpClient) as any;
    this.setState(this.state);
  }

  save(model: StickerPickerState) {
    this.systemAPI.closeDialog(model.sticker, true);
  }

  render() {
    return <div>
      <Tabs>
        {Object.keys(this.state.stickers).map(k => {
          return <Tab label={k}>
            <div className="stickers-list">
              {this.state.stickers[k].map(tile => {
                return <img onClick={(evt) => { evt.preventDefault(); this.systemAPI.closeDialog(tile, true) } } className="sticker-preview" src={`/${tile}`}/>
              })}
              <div className="elroom-clearboth"></div>
            </div>
          </Tab>;
        })}
      </Tabs>
      <div style={{ textAlign: "right" }}>
        <RaisedButton label={this.i18n.t("common:button.close")} onTouchTap={(evt) => { evt.preventDefault(); this.systemAPI.closeDialog(null, true) } }/>
      </div>
    </div>;
  }
}