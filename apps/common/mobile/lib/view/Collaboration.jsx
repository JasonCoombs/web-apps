import React, { Component, useEffect } from 'react';
import { observer, inject } from "mobx-react";
import { Popover, List, ListItem, Navbar, NavTitle, NavRight } from 'framework7-react';
import { Sheet, Toolbar, BlockTitle, Link, Page, View, Icon } from 'framework7-react';
import { f7 } from 'framework7-react';
import { withTranslation, useTranslation } from 'react-i18next';

@inject('users')
@observer
class PageUsers extends Component {
    constructor(props){
        super(props)
    }

    render() {
        const { t } = this.props;
        const userlist = this.props.users;
        return (
            <Page name="collab__users">
                <Navbar title="Users" backLink="Back"></Navbar>
                <BlockTitle>{t("Collaboration.textEditUser")}</BlockTitle>
                <List className="coauth__list">
                    {userlist.users.map((model, i) => (
                        <ListItem title={model.asc_getUserName()} key={i}>
                            <Icon slot="media" icon="coauth__list__icon"
                                  style={{backgroundColor: model.asc_getColor()}}></Icon>
                        </ListItem>
                    ))}
                </List>
            </Page>)
    }
};

const PageCollaboration = () => {
    "use strict";

    return <Page name="collab__main">
                <Navbar title="Collaboration">
                    <NavRight>
                        <Link sheetClose>Close</Link>
                    </NavRight>
                </Navbar>
                <List>
                    <ListItem href="/users/" title="Users"/>
                    <ListItem link="#" title="Comments"/>
                </List>
            </Page>;

};

class CollaborationPopover extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Popover className="collab__popover">
                <Page>
                    <Navbar title="Collaboration"></Navbar>
                    <List>
                        <ListItem link="#" title="Users"/>
                        <ListItem link="#" title="Comments"/>
                    </List>
                </Page>
            </Popover>
        )
    }
}

class CollaborationSheet extends Component {
    constructor(props) {
        super(props);

        this.routes = [
            {path: '/', component: 'PageCollaboration'},
            {path: '/users/', component: 'PageUsers'}
        ];
    }
    render() {
        return (
            <Sheet className="coauth__sheet" push onSheetClosed={e => this.props.onclosed()}>
                <View>
                    <PageCollaboration />
                </View>
            </Sheet>
        )
    }
}

const CollaborationView = props => {
    useEffect(() => {
        f7.sheet.open('.coauth__sheet');

        return () => {
            // component will unmount
        }
    });

    const onviewclosed = () => {
        if ( props.onclosed ) props.onclosed();
    };

    return (
        <CollaborationSheet onclosed={onviewclosed} />
    )
};

const pageusers = withTranslation()(PageUsers);
// export withTranslation()(CollaborationPopover);
export {CollaborationPopover, CollaborationSheet, PageCollaboration, pageusers as PageUsers}
export default CollaborationView;