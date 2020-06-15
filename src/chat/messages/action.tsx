import { h, Component } from 'preact';
import {botman} from './../botman';
import MessageType from "./messagetype";
import { IMessageTypeProps, IAction, IMessage } from '../../typings';

export default class Action extends MessageType {

    render(props: IMessageTypeProps) {
        const message = props.message;

        const buttons = message.actions.map((action: IAction) => {
            return <div class="btn" onClick={() => this.performAction(action)}>
                <div dangerouslySetInnerHTML={{ __html: action.text}} />
            </div>;
        });

        return (
            <div>
                {message.text && <div dangerouslySetInnerHTML={{ __html: message.text}} />}
                {this.state.attachmentsVisible ?
                    <div>{buttons}</div>
                    : ''}
            </div>
        );
    }

    performAction(action: IAction) {
        let isLink = action.text.indexOf('data-href');
        if( isLink >= 0 ) 
        {
            var div = document.createElement('div');
            div.innerHTML = action.text;
            window.top.location.href = div.getElementsByTagName('div')[0].getAttribute('data-href');
        }
        else
        {
            this.props.messageHandler({
                text: action.text,
                type: 'text',
                from: 'visitor'
            });
            botman.callAPI(action.value, true, null, (msg: IMessage) => {
                this.setState({ attachmentsVisible : false});
                this.props.messageHandler({
                    text: msg.text,
                    type: msg.type,
                    timeout: msg.timeout,
                    actions: msg.actions,
                    attachment: msg.attachment,
                    additionalParameters: msg.additionalParameters,
                    from: 'chatbot'
                });
            }, null);
        }
    }
}
