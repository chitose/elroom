import * as React from 'react';
import { DictionaryType } from '../common';
import { ReferenceData } from '../model/referenceData';
import FontIcon from 'material-ui/FontIcon';

export function booleanIconColumn(data: any, row: DictionaryType<any>): React.ReactElement<any> {
  return <FontIcon className="material-icons">{data ? "check_box" : "check_box_outline_blank"}</FontIcon>;
}

export function referenceColumn(refData: { (): ReferenceData[] }) {
  return (data: number): React.ReactElement<any> => {
    let rdata = refData();
    const d = (rdata || []).find(r => r.id === data);
    return <span key={String(data)}>{d ? d.name : data}</span>;
  }
}