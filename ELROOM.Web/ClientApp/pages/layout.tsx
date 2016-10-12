import * as React from 'react';
import { NavMenu } from '../components/navMenu';
import { RouteComponentProps } from 'react-router';

interface LayoutProps {
    body: React.ReactElement<any>;
}

export class Layout extends React.Component<LayoutProps & RouteComponentProps<any, any>, void> {
    render() {
        return <div className="app-root">
            <NavMenu location={this.props.location}/>
            {this.props.body}
        </div>;
    }
}