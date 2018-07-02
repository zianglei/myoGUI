
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { remote } from 'electron';
import clazz from 'classname';
import moment from 'moment';

import classes from './style.css';
import helper from 'utils/helper';

moment.updateLocale('en', {
    relativeTime: {
        past: '%s',
        m: '1 min',
        mm: '%d mins',
        h: 'an hour',
        hh: '%d h',
        s: 'now',
        ss: '%d s',
    },
});

@inject(stores => ({
    chats: stores.chat.sessions,
    chatTo: stores.chat.chatTo,
    selected: stores.chat.user,
    messages: stores.chat.messages,
    markedRead: stores.chat.markedRead,
    sticky: stores.chat.sticky,
    removeChat: stores.chat.removeChat,
    loading: stores.session.loading,
    searching: stores.search.searching,
}))
@observer
export default class Chats extends Component {
    getTheLastestMessage(userid) {
        var list = this.props.messages.get(userid);
        var res;

        if (list) {
            // Make sure all chatset has be loaded
            res = list.data.slice(-1)[0];
        }

        return res;
    }

    hasUnreadMessage(userid) {
        var list = this.props.messages.get(userid);

        if (list) {
            return list.data.length !== (list.unread || 0);
        }
    }

    showContextMenu(user) {
        var menu = new remote.Menu.buildFromTemplate([
            {
                label: 'Send Message',
                click: () => {
                    this.props.chatTo(user);
                }
            },
            {
                type: 'separator'
            },
            {
                label: helper.isTop(user) ? 'Unsticky' : 'Sticky on Top',
                click: () => {
                    this.props.sticky(user);
                }
            },
            {
                label: 'Delete',
                click: () => {
                    this.props.removeChat(user);
                }
            },
            {
                label: 'Mark as Read',
                click: () => {
                    this.props.markedRead(user.UserName);
                }
            },
        ]);

        menu.popup(remote.getCurrentWindow());
    }

    componentDidUpdate() {
        var container = this.refs.container;
        var active = container.querySelector(`.${classes.chat}.${classes.active}`);

        if (active) {
            let rect4active = active.getBoundingClientRect();
            let rect4viewport = container.getBoundingClientRect();

            // Keep the conversation always in the viewport
            if (!(rect4active.top >= rect4viewport.top
                && rect4active.bottom <= rect4viewport.bottom)) {
                active.scrollIntoViewIfNeeded();
            }
        }
    }

    render() {
        var { loading, chats, selected, chatTo, searching } = this.props;

        if (loading) return false;

        return (
            <div className={classes.container}>
                <div
                    className={classes.chats}
                    ref="container">
                    {
                        !searching && chats.map((e, index) => {
                            // var message = this.getTheLastestMessage(e.UserName) || {};
                            // var muted = helper.isMuted(e);
                            // var isTop = helper.isTop(e);

                            return (
                                <div
                                    className={clazz(classes.chat, {
                                        [classes.sticky]: false,
                                        [classes.active]: selected && selected.UserName === e.UserName
                                    })}
                                    key={index}
                                    onClick={ev => chatTo(e)}>
                                    <div className={classes.inner}>
                                        <div className={clazz(classes.dot, {
                                            [classes.green]: false,
                                            [classes.red]: false
                                        })}>
                                            <img
                                                className="disabledDrag"
                                                src={e.HeadImgUrl} />
                                        </div>

                                        <div className={classes.info}>
                                            <p
                                                className={classes.username}
                                                dangerouslySetInnerHTML={{__html: e.RemarkName || e.NickName}} />

                                            <span
                                                className={classes.message}
                                                dangerouslySetInnerHTML={{__html: 'No Message'}} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}
