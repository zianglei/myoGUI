import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clazz from 'classname';

import classes from '../style.css';

export default class ChatLayout extends Component {
    static propTypes = {
        user: PropTypes.object,
        messages: PropTypes.object
    };

    renderMessages(list, from) {
        return list.data.map((e, index) => {
            let message = e;
            let user = from;
            var type = message.MsgType;

            if ([
                // WeChat system message
                10000,
                // Custome message
                19999
            ].includes(type)) {
                return (
                    <div
                        key={index}
                        className={clazz('unread', classes.message, classes.system)}
                        dangerouslySetInnerHTML={{__html: e.Content}} />
                );
            }

            if (!user) {
                return false;
            }

            return (
                <div className={clazz('unread', classes.message, {
                    // File is uploading
                    // [classes.uploading]: message.uploading === true,

                    [classes.isme]: message.isme,
                    [classes.isText]: type === 1,
                    [classes.isLocation]: type === 1 && message.location,
                    [classes.isImage]: type === 3,
                    [classes.isEmoji]: type === 47 || type === 49 + 8,
                    [classes.isVoice]: type === 34,
                    [classes.isContact]: type === 42,
                    [classes.isVideo]: type === 43,

                    // App messages
                    [classes.appMessage]: [49 + 2000, 49 + 17, 49 + 6].includes(type),
                    [classes.isTransfer]: type === 49 + 2000,
                    [classes.isLocationSharing]: type === 49 + 17,
                    [classes.isFile]: type === 49 + 6,
                })} key={index}>
                    <div>
                        {/* <Avatar */}
                        {/* src={message.isme ? message.HeadImgUrl : user.HeadImgUrl} */}
                        {/* className={classes.avatar} */}
                        {/* onClick={ev => this.props.showUserinfo(message.isme, user)}  /> */}

                        <p className={classes.username} dangerouslySetInnerHTML={{__html: message.nickname}} />

                        <div className={classes.content}>
                            <p
                                onContextMenu={e => this.showMessageAction(message)}
                                // dangerouslySetInnerHTML={{__html: this.getMessageContent(message)}}
                                dangerouslySetInnerHTML={{__html: message.Content}} />

                            {/* <span className={classes.times}>{ moment(message.CreateTime * 1000).fromNow() }</span> */}
                        </div>
                    </div>
                </div>
            );
        });
    };

    render() {
        var title = this.props.user.NickName;
        return (
            <div
                className={clazz(classes.container, {
                    [classes.hideConversation]: false,
                })}
                onClick={e => this.handleClick(e)}>
                {
                    this.props.user ? (
                        <div>
                            <header>
                                <div className={classes.info}>
                                    <p
                                        dangerouslySetInnerHTML={{__html: title}}
                                        title={title} />
                                </div>

                                <i
                                    className="icon-ion-android-more-vertical"
                                    onClick={() => this.showMenu()} />
                            </header>

                            <div
                                className={classes.messages}
                                onScroll={e => this.handleScroll(e)}
                                ref="viewport">
                                {
                                    this.renderMessages(this.props.messages.get(this.props.user.UserName), this.props.user)
                                }
                            </div>
                        </div>
                    ) : (
                        <div className={clazz({
                            [classes.noselected]: !this.props.user,
                        })}>
                            <img
                                className="disabledDrag"
                                src="assets/images/noselected.png" />
                            <h1>No Chat selected :(</h1>
                        </div>
                    )
                }
            </div>
        );
    }
}