/*
 *
 * (c) Copyright Ascensio System SIA 2010-2019
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
*/
/**
 *  Transitions.js
 *
 *  View
 *
 *  Created by Olga.Sharova on 15.07.21
 *  Copyright (c) 2021 Ascensio System SIA. All rights reserved.
 *
 */



define([
    'text!presentationeditor/main/app/template/Transitions.template',
    'common/main/lib/util/utils',
    'common/main/lib/component/Button',
    'common/main/lib/component/DataView',
    'common/main/lib/component/ComboDataView',
    'common/main/lib/component/Layout',
    'presentationeditor/main/app/view/SlideSettings',
    'common/main/lib/component/MetricSpinner',
    'common/main/lib/component/Window'
], function (template) {
    'use strict';

    PE.Views.Transitions = Common.UI.BaseView.extend(_.extend((function(){
        function setEvents() {
            var me = this;
            if(me.listEffects)
            {
                me.listEffects.on('click', _.bind(function (combo,record){
                    me.fireEvent('transit:selecteffect',[combo,record]);
                },me));

            }
            if(me.btnPreview)
            {
                me.btnPreview.on('click', _.bind(function(btn){
                    me.fireEvent('transit:preview', [me.btnPreview]);
                }, me));
            }
            if (me.btnParametrs) {
                me.btnParametrs.on('click', function (e) {
                    me.fireEvent('transit:parametrs', ['current']);

                });

                me.btnParametrs.menu.on('item:click', function (menu, item, e) {
                    me.fireEvent('transit:parametrs', [item]);
                });

            }
            if(me.btnApplyToAll)
            {
                me.btnApplyToAll.on('click', _.bind(function(btn){
                    me.fireEvent('transit:applytoall', [me.btnApplyToAll]);
                }, me));
            }
            if(me.numDuration){
                me.numDuration.on('change', function(bth) {
                    me.fireEvent('transit:duration', [me.numDuration]);
                },me);
            }
            if(me.numDelay){
                me.numDelay.on('change', function(bth) {
                    me.fireEvent('transit:delay', [me.numDelay]);
                },me);
            }
            if(me.chStartOnClick)
            {
                me.chStartOnClick.on('change',_.bind(function (e){
                    me.fireEvent('transit:startonclick',[ me.chStartOnClick,me.chStartOnClick.value, me.chStartOnClick.lastValue]);
                },me));
            }
        }

        return {
            // el: '#transitions-panel',

            options: {},

            initialize: function (options) {
                this.$el=$(_.template(template)( {} ));
                this.SladeSettings=PE.Views.ShapeSettings;

                Common.UI.BaseView.prototype.initialize.call(this, options);
                this.appConfig = options.mode;
                var filter = Common.localStorage.getKeysFilter();
                this.appPrefix = (filter && filter.length) ? filter.split(',')[0] : '';

                this._arrEffectName = [
                    {title: this.textNone, imageUrl:"btn-text", value: Asc.c_oAscSlideTransitionTypes.None, id: Common.UI.getId()},
                    {title: this.textFade, imageUrl:"btn-insertimage", value: Asc.c_oAscSlideTransitionTypes.Fade, id: Common.UI.getId()},
                    {title: this.textPush, imageUrl:"btn-insertshape", value: Asc.c_oAscSlideTransitionTypes.Push, id: Common.UI.getId()},
                    {title: this.textWipe, imageUrl:"btn-insertchart", value: Asc.c_oAscSlideTransitionTypes.Wipe, id: Common.UI.getId()},
                    {title: this.textSplit, imageUrl:"btn-textart", value: Asc.c_oAscSlideTransitionTypes.Split, id: Common.UI.getId()},
                    {title: this.textUnCover, imageUrl:"btn-menu-comments", value: Asc.c_oAscSlideTransitionTypes.UnCover, id: Common.UI.getId()},
                    {title: this.textCover, imageUrl:"btn-editheader", value: Asc.c_oAscSlideTransitionTypes.Cover, id: Common.UI.getId()},
                    {title: this.textClock, imageUrl:"btn-datetime", value: Asc.c_oAscSlideTransitionTypes.Clock, id: Common.UI.getId()},
                    {title: this.textZoom,  imageUrl:"btn-insertequatio", value: Asc.c_oAscSlideTransitionTypes.Zoom, id: Common.UI.getId()}
                ];

                this._arrEffectType = [
                    {caption: this.textSmoothly,           value: Asc.c_oAscSlideTransitionParams.Fade_Smoothly},
                    {caption: this.textBlack,              value: Asc.c_oAscSlideTransitionParams.Fade_Through_Black},
                    {caption: this.textLeft,               value: Asc.c_oAscSlideTransitionParams.Param_Left},
                    {caption: this.textTop,                value: Asc.c_oAscSlideTransitionParams.Param_Top},
                    {caption: this.textRight,              value: Asc.c_oAscSlideTransitionParams.Param_Right},
                    {caption: this.textBottom,             value: Asc.c_oAscSlideTransitionParams.Param_Bottom},
                    {caption: this.textTopLeft,            value: Asc.c_oAscSlideTransitionParams.Param_TopLeft},
                    {caption: this.textTopRight,           value: Asc.c_oAscSlideTransitionParams.Param_TopRight},
                    {caption: this.textBottomLeft,         value: Asc.c_oAscSlideTransitionParams.Param_BottomLeft},
                    {caption: this.textBottomRight,        value: Asc.c_oAscSlideTransitionParams.Param_BottomRight},
                    {caption: this.textVerticalIn,         value: Asc.c_oAscSlideTransitionParams.Split_VerticalIn},
                    {caption: this.textVerticalOut,        value: Asc.c_oAscSlideTransitionParams.Split_VerticalOut},
                    {caption: this.textHorizontalIn,       value: Asc.c_oAscSlideTransitionParams.Split_HorizontalIn},
                    {caption: this.textHorizontalOut,      value: Asc.c_oAscSlideTransitionParams.Split_HorizontalOut},
                    {caption: this.textClockwise,          value: Asc.c_oAscSlideTransitionParams.Clock_Clockwise},
                    {caption: this.textCounterclockwise,   value: Asc.c_oAscSlideTransitionParams.Clock_Counterclockwise},
                    {caption: this.textWedge,              value: Asc.c_oAscSlideTransitionParams.Clock_Wedge},
                    {caption: this.textZoomIn,             value: Asc.c_oAscSlideTransitionParams.Zoom_In},
                    {caption: this.textZoomOut,            value: Asc.c_oAscSlideTransitionParams.Zoom_Out},
                    {caption: this.textZoomRotate,         value: Asc.c_oAscSlideTransitionParams.Zoom_AndRotate}
                ];

                this.listEffects = new Common.UI.ComboDataView({
                    cls: 'combo-styles',
                    itemWidth: 91,
                    itemHeight: 44,
                    enableKeyEvents: true,
                    beforeOpenHandler: function (e) {
                        var cmp = this,
                            menu = cmp.openButton.menu,
                            minMenuColumn = 7;

                        if (menu.cmpEl) {
                            var itemEl = $(cmp.cmpEl.find('.dataview.inner .style').get(0)).parent();
                            var itemMargin = /*parseInt($(itemEl.get(0)).parent().css('margin-right'))*/-1;
                            Common.Utils.applicationPixelRatio() > 1 && Common.Utils.applicationPixelRatio() < 2 && (itemMargin = itemMargin + 1/Common.Utils.applicationPixelRatio());
                            var itemWidth = itemEl.is(':visible') ? parseInt(itemEl.css('width')) :
                                (cmp.itemWidth + parseInt(itemEl.css('padding-left')) + parseInt(itemEl.css('padding-right')) +
                                    parseInt(itemEl.css('border-left-width')) + parseInt(itemEl.css('border-right-width')));

                            var minCount = cmp.menuPicker.store.length >= minMenuColumn ? minMenuColumn : cmp.menuPicker.store.length,
                                columnCount = Math.min(cmp.menuPicker.store.length, Math.round($('.dataview', $(cmp.fieldPicker.el)).width() / (itemMargin + itemWidth) + 0.5));

                            columnCount = columnCount < minCount ? minCount : columnCount;
                            menu.menuAlignEl = cmp.cmpEl;

                            menu.menuAlign = 'tl-tl';
                            var offset = cmp.cmpEl.width() - cmp.openButton.$el.width() - columnCount * (itemMargin + itemWidth) - 1;
                            menu.setOffset(Math.min(offset, 0));

                            menu.cmpEl.css({
                                'width': columnCount * (itemWidth + itemMargin),
                                'min-height': cmp.cmpEl.height()
                            });
                        }

                        if (cmp.menuPicker.scroller) {
                            cmp.menuPicker.scroller.update({
                                includePadding: true,
                                suppressScrollX: true
                            });
                        }

                        cmp.removeTips();
                    }
                });
                this.listEffects.menuPicker.store.add(this._arrEffectName);

                this.listEffects.fieldPicker.itemTemplate = _.template([
                    '<div class="style" id="<%= id %>">',
                    '<div style="width: ' + this.listEffects.itemWidth + 'px;  height: '+(this.listEffects.itemHeight-16)+'px;  ">',
                       '<div  class="btn btn-toolbar x-huge icon-top"data-toggle="tooltip" data-original-title="" title="">',
                                '<div class="inner-box-icon" style="width: ' + (this.listEffects.itemWidth) +'px;">',
                                    '<i class="icon toolbar__icon <%= imageUrl %>"></i>',
                                '</div>',
                                '<div class="inner-box-caption" style=" ">',
                                    '<span class="caption" style="font-size: 11px;"><%= title %></span>',
                                '</div>',
                            '</div>',
                        '</div>',
                    '</div>'
                ].join(''));
                this.listEffects.menuPicker.itemTemplate =this.listEffects.fieldPicker.itemTemplate;

                this.btnPreview = new Common.UI.Button({
                    cls: 'btn-toolbar text',// x-huge icon-top',
                    caption: this.txtPreview,
                    split: false,
                    iconCls: 'toolbar__icon btn-rem-comment'
                });

                this.btnParametrs = new Common.UI.Button({
                    cls: 'btn-toolbar x-huge icon-top',
                    caption: this.txtParametrs,
                    split: true,
                    iconCls: 'toolbar__icon btn-res-comment'
                });

                this.btnApplyToAll = new Common.UI.Button({
                    cls: 'btn-toolbar',
                    caption: this.txtApplyToAll,
                    split: true,
                    iconCls: 'toolbar__icon btn-res-comment'
                });

                this.numDuration = new Common.UI.MetricSpinner({
                    el: this.$el.find('#transit-spin-duration'),
                    step: 1,
                    width: 50,
                    value: '',
                    defaultUnit : this.txtSec,
                    maxValue: 300,
                    minValue: 0,
                    disabled: false
                });

                this.numDelay = new Common.UI.MetricSpinner({
                    el: this.$el.find('#transit-spin-delay'),
                    step: 1,
                    width: 60,
                    value: '',
                    defaultUnit : this.txtSec,
                    maxValue: 300,
                    minValue: 0,
                    disabled: false
                });

                this.chStartOnClick = new Common.UI.CheckBox({
                    el: this.$el.findById('#transit-checkbox-slidenum'),
                    labelText: this.strStartOnClick
                });

                Common.NotificationCenter.on('app:ready', this.onAppReady.bind(this));
            },

            render: function (el) {
                this.boxSdk = $('#editor_sdk');
                if ( el ) el.html( this.getPanel() );
                return this;
            },

            onAppReady: function (config) {
                var me = this;
                (new Promise(function (accept, reject) {
                    accept();
                })).then(function(){
                    var itemsMenu=[];
                    _.each(me._arrEffectType, function (item){
                        itemsMenu.push(
                            {
                                caption: item.caption,
                                value: item.value,
                                checkable: true,
                                toggleGroup: 'effects',
                                disabled:false
                            }
                        );
                    });
                    me.btnParametrs.setMenu(
                        new Common.UI.Menu({
                            items: itemsMenu
                        })
                    );
                    setEvents.call(me);
                });
            },

            getPanel: function () {
                //this.$el = $(_.template(template)( {} ));
                this.listEffects&&this.listEffects.render(this.$el.find('#transit-field-effects'));
                this.btnPreview && this.btnPreview.render(this.$el.find('#transit-button-preview'));
                this.btnParametrs && this.btnParametrs.render(this.$el.find('#transit-button-parametrs'));
                this.btnApplyToAll && this.btnApplyToAll.render(this.$el.find('#transit-button-apply'));
                this.renderComponent('#transit-spin-duration', this.numDuration);
                this.renderComponent('#transit-spin-delay', this.numDelay);
                this.renderComponent('#transit-checkbox-slidenum', this.chStartOnClick);
                this.$el.find("#label-duration").innerText=this.strDuration;
                this.$el.find("#label-delay").innerText=this.strDelay;
                return this.$el;
            },

            show: function () {
                Common.UI.BaseView.prototype.show.call(this);
                this.fireEvent('show', this);
            },

            getUserName: function (username) {
                return Common.Utils.String.htmlEncode(AscCommon.UserInfoParser.getParsedName(username));
            },

            turnSpelling: function (state) {

            },
            SetDisabled: function (state, langs) {
                //this.btnPreview && this.btnPreview.setDisabled(state|| !Common.Utils.InternalSettings.get())
                //this.btnCommentRemove && this.btnCommentRemove.setDisabled(state || !Common.Utils.InternalSettings.get(this.appPrefix + "settings-livecomment"));
            },
            renderComponent: function (compid, obj)
            {
                var element=this.$el.find(compid);
                element.parent().append(obj.el);
            },
            setMenuParametrs:function (effect,value)
            {
                var minMax=[-1,-1];
                switch (effect) {
                    case Asc.c_oAscSlideTransitionTypes.Fade:
                        minMax=[0,1];
                        break;
                    case Asc.c_oAscSlideTransitionTypes.Push:
                        minMax=[2, 5];
                        break;
                    case Asc.c_oAscSlideTransitionTypes.Wipe:
                        minMax=[2, 9];
                        break;
                    case Asc.c_oAscSlideTransitionTypes.Split:
                        minMax=[10, 13];
                        break;
                    case Asc.c_oAscSlideTransitionTypes.UnCover:
                        minMax=[2, 9];
                        break;
                    case Asc.c_oAscSlideTransitionTypes.Cover:
                        minMax=[2, 9];
                        break;
                    case Asc.c_oAscSlideTransitionTypes.Clock:
                        minMax=[14, 16];
                        break;
                    case Asc.c_oAscSlideTransitionTypes.Zoom:
                        minMax=[17,19];
                        break;
                }
                var selectedElement;
                _.each(this.btnParametrs.menu.items,function (element,index){
                    if(((index<minMax[0])||(index>minMax[1])))
                        element.$el.css('display','none');
                    else {
                        element.$el.css('display','');
                        if (value != undefined) {
                            if (value == element.value)
                                selectedElement = element;
                        }
                    }
                });
                if(selectedElement==undefined)
                    selectedElement=this.btnParametrs.menu.items[minMax[0]];
                if(effect!=Asc.c_oAscSlideTransitionTypes.None)
                    selectedElement.setChecked(true);

                this.btnParametrs.setDisabled(effect===Asc.c_oAscSlideTransitionTypes.None);
                this.btnPreview.setDisabled(effect===Asc.c_oAscSlideTransitionTypes.None);
                this.numDuration.setDisabled(effect===Asc.c_oAscSlideTransitionTypes.None);
                return selectedElement;
            },


            txtSec:'s',
            txtPreview:'Preview',
            txtParametrs: 'Parametrs',
            txtApplyToAll: 'Apply to All Slides',
            strDuration: 'Duration',
            strStartOnClick: 'Start On Click',

            textNone: 'None',
            textFade: 'Fade',
            textPush: 'Push',
            textWipe: 'Wipe',
            textSplit: 'Split',
            textUnCover: 'UnCover',
            textCover: 'Cover',
            textClock: 'Clock',
            textZoom: 'Zoom',

            textSmoothly: 'Smoothly',
            textBlack: 'Through Black',
            textLeft: 'Left',
            textTop: 'Top',
            textRight: 'Right',
            textBottom: 'Bottom',
            textTopLeft: 'Top-Left',
            textTopRight: 'Top-Right',
            textBottomLeft: 'Bottom-Left',
            textBottomRight: 'Bottom-Right',
            textVerticalIn: 'Vertical In',
            textVerticalOut: 'Vertical Out',
            textHorizontalIn: 'Horizontal In',
            textHorizontalOut: 'Horizontal Out',
            textClockwise: 'Clockwise',
            textCounterclockwise: 'Counterclockwise',
            textWedge: 'Wedge',
            textZoomIn: 'Zoom In',
            textZoomOut: 'Zoom Out',
            textZoomRotate: 'Zoom and Rotate'
        }
    }()), PE.Views.Transitions || {}));

    });