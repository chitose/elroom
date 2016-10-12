import * as React from 'react';
import { DictionaryType } from '../common';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import { BaseComponent } from '../components';
import RefreshIndicator from 'material-ui/RefreshIndicator';

type RemoteDataSource = { (offset: number, length?: number): Promise<{ data: DictionaryType<any>[], totalRecords: number }> };

type ColumnRenderer = { (data: any, row: DictionaryType<any>, grid: DataGrid): React.ReactElement<any> };

export interface GridColumnInfo {
  title?: string;
  field: string;
  renderer?: ColumnRenderer;
  visible?: boolean;
}

export interface DataGridProps extends __MaterialUI.Table.TableProps {
  pageSize?: number;
  data?: DictionaryType<any>[];
  remoteData?: RemoteDataSource;
  columns: GridColumnInfo[];
  rowKey: string;
  loadingSize?: number;
}

interface DataGridState {
  offset: number;
  totalRecords: number;
  pageData: DictionaryType<any>[];
  loadingStatus: "ready" | "loading" | "hide";
}

export class DataGrid extends BaseComponent<DataGridProps, DataGridState> {
  static defaultProps = {
    loadingSize: 100,
    pageSize: 10
  };

  constructor(props: DataGridProps, ctx) {
    super(props, ctx);
    this.state = {
      offset: 0,
      pageData: [],
      totalRecords: 0,
      loadingStatus: "hide"
    };
  }
  componentWillMount() {
    if (this.props.remoteData) {
      this.loadData(0);
    }
  }

  setLoadingState(state: string) {
    this.setState(Object.assign({}, this.state, {
      loadingStatus: state
    }));
  }

  async loadData(offset: number) {
    const timerId = setTimeout(() => this.setLoadingState("loading"), 1000);
    const data = await this.props.remoteData(offset, this.props.pageSize);
    clearTimeout(timerId);
    this.setState(Object.assign({}, this.state, { pageData: data.data, totalRecords: data.totalRecords, offset: offset, loadingStatus: "hide" }));
  }

  gotoPage(page: number) {
    this.loadData((page - 1) * this.props.pageSize);
  }

  render() {
    let tblProps = Object.assign({}, this.props);
    Object.keys(this.props).forEach(k => {
      if (k === "pageSize" || k === "data" || k === "remoteData" || k === "columns" || k === "rowKey") {
        delete tblProps[k];
      }
    });
    const maxPages = Math.ceil(this.state.totalRecords / this.props.pageSize);
    const currentPage = this.state.offset / this.props.pageSize + 1;

    return <div className="data-grid" style={{ position: 'relative' }}>
      <div className="grid-loading-indicator" style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: `-${this.props.loadingSize / 2}px`, marginTop: `-${this.props.loadingSize / 2}px` }}>
        <div style={{ position: 'relative' }}>
          <RefreshIndicator
            size={this.props.loadingSize}
            left={0}
            top={0}
            loadingColor={"#FF9800"}
            status={this.state.loadingStatus}
            />
        </div>
      </div>
      <Table {...tblProps} fixedFooter={true}>
        <TableHeader>
          <TableRow>
            {this.props.columns.filter(c => c.visible !== false).map(c => {
              return <TableHeaderColumn key={c.field} tooltip={this.i18n.t(c.title)}>{this.i18n.t(c.title)}</TableHeaderColumn>
            })}
          </TableRow>
        </TableHeader>
        <TableBody showRowHover={true}>
          {(this.props.data || this.state.pageData).map(r => {
            return <TableRow key={r[this.props.rowKey]}>
              {this.props.columns.filter(c => c.visible !== false).map(c => {
                return <TableRowColumn key={c.field} > {c.renderer ? c.renderer(r[c.field], r, this) : r[c.field]}
                </TableRowColumn>
              })}
            </TableRow>
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableRowColumn colSpan={this.props.columns.filter(c => c.visible !== false).length} style={{ textAlign: 'center' }}>
              <FlatButton style={{ minWidth: this.theme.gridPagination.minWidth, marginRight: this.theme.gridPagination.itemMargin / 2 }} disabled={currentPage === 1} onTouchTap={() => this.gotoPage(1)} icon={<FontIcon className="material-icons">{this.theme.gridPagination.firstPageIcon}</FontIcon>}/>
              <FlatButton style={{ minWidth: this.theme.gridPagination.minWidth, marginRight: this.theme.gridPagination.itemMargin / 2 }} disabled={currentPage === 1} onTouchTap={() => this.gotoPage(currentPage - 1)} icon={<FontIcon className="material-icons">{this.theme.gridPagination.prevIcon}</FontIcon>}/>
              <FlatButton hoverColor={this.theme.gridPagination.itemActiveBg} style={{ minWidth: this.theme.gridPagination.minWidth, marginLeft: this.theme.gridPagination.itemMargin / 2, marginRight: this.theme.gridPagination.itemMargin / 2, color: this.theme.gridPagination.itemActiveColor }} backgroundColor={this.theme.gridPagination.itemActiveBg} >{currentPage}</FlatButton>
              <FlatButton style={{ minWidth: this.theme.gridPagination.minWidth, marginLeft: this.theme.gridPagination.itemMargin / 2 }} disabled={currentPage === maxPages} onTouchTap={() => this.gotoPage(currentPage + 1)} icon={<FontIcon className="material-icons">{this.theme.gridPagination.nextIcon}</FontIcon>}/>
              <FlatButton style={{ minWidth: this.theme.gridPagination.minWidth, marginRight: this.theme.gridPagination.itemMargin / 2 }} disabled={currentPage === maxPages} onTouchTap={() => this.gotoPage(maxPages)} icon={<FontIcon className="material-icons">{this.theme.gridPagination.lastPageIcon}</FontIcon>}/>
            </TableRowColumn>
          </TableRow>
        </TableFooter>
      </Table></div>;
  }
}