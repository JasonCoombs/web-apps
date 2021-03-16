import React, { Component } from 'react';
import { Searchbar, Popover, Popup, View, Page, List, ListItem, Navbar, NavRight, Link } from 'framework7-react';
import { Toggle } from 'framework7-react';
import { f7 } from 'framework7-react';
import { Dom7 } from 'framework7';
import { Device } from '../../../../common/mobile/utils/device';
import { observable, runInAction } from "mobx";
import { observer } from "mobx-react";

const searchOptions = observable({
    usereplace: false
});

const popoverStyle = {
    height: '300px'
};

const SEARCH_BACKWARD = 'back';
const SEARCH_FORWARD = 'next';

class SearchSettingsView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            useReplace: false,
            // caseSensitive: false,
            // markResults: false
            searchIn: 0,
            searchBy: 1,
            lookIn: 1,
            isMatchCase: false,
            isMatchCell: false
        };
    }

    onFindReplaceClick(action) {
        runInAction(() => searchOptions.usereplace = action == 'replace');

        this.setState({
            useReplace: searchOptions.usereplace
        });

        if (this.onReplaceChecked) {}
    }

    extraSearchOptions() {
    }

    render() {
        const show_popover = !Device.phone;
        // const navbar =
        //     <Navbar title="Find and replace">
        //         {!show_popover &&
        //             <NavRight>
        //                 <Link popupClose=".search-settings-popup">Done</Link>
        //             </NavRight>
        //         }
        //     </Navbar>;
        const extra = this.extraSearchOptions();
        const content =
            <View style={show_popover ? popoverStyle : null}>
                {/* <Page> */}
                    {/* {navbar} */}
                    {extra}
                {/* </Page> */}
            </View>;
        return (
            show_popover ?
                <Popover id="idx-search-settings" className="popover__titled">{content}</Popover> :
                <Popup id="idx-search-settings" className="search-settings-popup">{content}</Popup>
        )
    }
}

// @observer
class SearchView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: '',
            replaceQuery: ''
        };

        const $$ = Dom7;

        $$(document).on('page:init', (e, page) => {
            if ( page.name == 'home' ) {
                this.searchbar = f7.searchbar.create({
                    el: '.searchbar',
                    customSearch: true,
                    expandable: true,
                    backdrop: false,
                    on: {
                            search: (bar, curval, prevval) => {
                        },
                        enable: this.onSearchbarShow.bind(this, true),
                        disable: this.onSearchbarShow.bind(this, false)
                    }
                });

                // function iOSVersion() {
                //     var ua = navigator.userAgent;
                //     var m;
                //     return (m = /(iPad|iPhone|iphone).*?(OS |os |OS\_)(\d+((_|\.)\d)?((_|\.)\d)?)/.exec(ua)) ? parseFloat(m[3]) : 0;
                // }

                const $editor = $$('#editor_sdk');
                // const $replaceLink = $$('#replace-link');
               
                if (false /*iOSVersion() < 13*/) {
                    // $editor.single('mousedown touchstart', _.bind(me.onEditorTouchStart, me));
                    // $editor.single('mouseup touchend',     _.bind(me.onEditorTouchEnd, me));
                } else {
                    // $editor.single('pointerdown', this.onEditorTouchStart, me));
                    // $editor.single('pointerup',     _.bind(me.onEditorTouchEnd, me));
                }

                $editor.on('pointerdown', this.onEditorTouchStart.bind(this));
                $editor.on('pointerup',   this.onEditorTouchEnd.bind(this));
                // $replaceLink.on('click', this.onReplaceHold.bind(this));
            }
        });

        this.onSettingsClick = this.onSettingsClick.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
        this.onReplaceClick = this.onReplaceClick.bind(this);
    }

    componentDidMount(){
        const $$ = Dom7;
        this.$replace = $$('#idx-replace-val');
    }

    onSettingsClick(e) {
        if ( Device.phone ) {
            f7.popup.open('.search-settings-popup');
        } else f7.popover.open('#idx-search-settings', '#idx-btn-search-settings');
    }

    searchParams() {
        let params = {
            find: this.searchbar.query
        };

        if (searchOptions.usereplace) {
            params.replace = this.$replace.val();
        } 

        return params;
    }

    onSearchClick(action) {
        if (this.searchbar && this.state.searchQuery) {
            if (this.props.onSearchQuery) {
                let params = this.searchParams();
                params.find = this.state.searchQuery;
                params.forward = action != SEARCH_BACKWARD;
                // console.log(params);

                this.props.onSearchQuery(params);
            }
        }
    }

    onReplaceClick() {
        if (this.searchbar && this.state.searchQuery) {
            if (this.props.onReplaceQuery) {
                let params = this.searchParams();
                params.find = this.state.searchQuery;
                // console.log(params);

                this.props.onReplaceQuery(params);
            }   
        }
    }

    onReplaceAllClick() {
        if (this.searchbar && this.state.searchQuery) {
            if (this.props.onReplaceAllQuery) {
                let params = this.searchParams();
                params.find = this.state.searchQuery;
                // console.log(params);

                this.props.onReplaceAllQuery(params);
            }   
        }
    }

    onSearchbarShow(isshowed, bar) {
        if ( !isshowed ) {
            this.$replace.val('');
        }
    }

    onEditorTouchStart(e) {
        this.startPoint = this.pointerPosition(e);
        // console.log(this.startPoint);
    }

    onEditorTouchEnd(e) {
        const endPoint = this.pointerPosition(e);
        // console.log(endPoint);

        if (this.searchbar.enabled) {
            let distance;

            if(this.startPoint) {
                distance = (!!this.startPoint.x || !!this.startPoint.y) ? 0 : 
                    Math.sqrt((endPoint.x -= this.startPoint.x) * endPoint.x + (endPoint.y -= this.startPoint.y) * endPoint.y);
            } else {
                distance = 0;
            }

            // const distance = (this.startPoint.x === undefined || this.startPoint.y === undefined) ? 0 :
            //     Math.sqrt((endPoint.x -= this.startPoint.x) * endPoint.x + (endPoint.y -= this.startPoint.y) * endPoint.y);

            if (distance < 1) {
                this.searchbar.disable();
            }
        }
    }

    pointerPosition(e) {
        let out = {x:0, y:0};
        if ( e.type == 'touchstart' || e.type == 'touchend' ) {
            const touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            out.x = touch.pageX;
            out.y = touch.pageY;
        } else if ( e.type == 'mousedown' || e.type == 'mouseup' ) {
            out.x = e.pageX;
            out.y = e.pageY;
        }

        return out;
    }

    changeSearchQuery(value) {
        this.setState({
            searchQuery: value
        });
    }

    changeReplaceQuery(value) {
        this.setState({
            replaceQuery: value
        });
    }

    render() {
        const usereplace = searchOptions.usereplace;
        const hidden = {display: "none"};
        const searchQuery = this.state.searchQuery;
        const replaceQuery = this.state.replaceQuery;
        const isIos = Device.ios;
        const { _t } = this.props;

        if(this.searchbar && this.searchbar.enabled) {
            usereplace ? this.searchbar.el.classList.add('replace') : this.searchbar.el.classList.remove('replace');
        } 

        return (
            <form className="searchbar">
                {isIos ? <div className="searchbar-bg"></div> : null}
                <div className="searchbar-inner">
                    <div className="buttons-row searchbar-inner__left">
                        <a id="idx-btn-search-settings" className="link icon-only" onClick={this.onSettingsClick}>
                            <i className="icon icon-settings" />
                        </a>
                    </div>
                    <div className="searchbar-inner__center">
                        <div className="searchbar-input-wrap">
                            <input placeholder={_t.textSearch} type="search" value={searchQuery} 
                                onChange={e => {this.changeSearchQuery(e.target.value)}} />
                            {isIos ? <i className="searchbar-icon" /> : null}
                            <span className="input-clear-button" />
                        </div>
                        <div className="searchbar-input-wrap" style={!usereplace ? hidden: null}>
                            <input placeholder={_t.textReplace} type="search" id="idx-replace-val" value={replaceQuery} 
                                onChange={e => {this.changeReplaceQuery(e.target.value)}} />
                            {isIos ? <i className="searchbar-icon" /> : null}
                            <span className="input-clear-button" />
                        </div>
                    </div>
                    <div className="buttons-row searchbar-inner__right">
                        <div className="buttons-row buttons-row-replace">
                            <a id="replace-link" className={"link " + (searchQuery.trim().length ? "" : "disabled")} style={!usereplace ? hidden: null} onClick={() => this.onReplaceClick()}>{_t.textReplace}</a>
                            <a id="replace-all-link" className={"link " + (searchQuery.trim().length ? "" : "disabled")} style={!usereplace ? hidden: null} onClick={() => this.onReplaceAllClick()}>{_t.textReplaceAll}</a>
                        </div>
                        <div className="buttons-row">
                            <a className={"link icon-only prev " + (searchQuery.trim().length ? "" : "disabled")} onClick={() => this.onSearchClick(SEARCH_BACKWARD)}>
                                <i className="icon icon-prev" />
                            </a>
                            <a className={"link icon-only next " + (searchQuery.trim().length ? "" : "disabled")} onClick={() => this.onSearchClick(SEARCH_FORWARD)}>
                                <i className="icon icon-next" />
                            </a>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

const SearchViewWithObserver = observer(SearchView);

export {SearchViewWithObserver as SearchView, SearchSettingsView};