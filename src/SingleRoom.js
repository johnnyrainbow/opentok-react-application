import React from 'react'
import config from "./config.json"
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';
const OT = require('@opentok/client');
export default class SingleRoom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sessionId: null,
            token: null
        }

        this.publisherProperties = {
            insertMode: 'append',
            width: '100%',
            height: '100%',
            videoSource: "screen",
            publishAudio: true,
        }

    }
    async componentDidMount() {
        const broadcast = await this.getBroadcast()
        if (!broadcast) return

        const token = await this.getAppropriateToken(broadcast.id)
        this.setState({ token, sessionId: broadcast.sessionId })
    }

    async getBroadcastToken(broadcastId, type) {
        const response = await fetch(`${config.API_ENDPOINT}/broadcasts/${broadcastId}/${type}`, {
            headers: new Headers({
                'Authorization': `Bearer ${config.API_TOKEN}`,
                'Content-Type': 'application/json'
            })
        })
        const data = await response.json()

        if (data.error)
            return null

        return data.token
    }

    async getAppropriateToken(broadcastId) {
        let token;
        token = await this.getBroadcastToken(broadcastId, "publisher")
        if (!token) {
            console.log("could not get publisher token")
            token = await this.getBroadcastToken(broadcastId, "viewer")
        }

        return token
    }

    async getBroadcast() {
        const response = await fetch(`${config.API_ENDPOINT}/rooms/${this.props.room.id}/broadcast`, {
            headers: new Headers({
                'Authorization': `Bearer ${config.API_TOKEN}`,
                'Content-Type': 'application/json'
            })
        })
        const data = await response.json()
        if (data.error) {
            alert(data.error)
            return null
        }
        return data.broadcast;
    }

    render() {
        console.log("rendering..")
        if (this.state.sessionId === null) return null
            console.log(this.state)
        return (
            <div className="publisher" >
                <h2>{this.props.room.title}</h2>

                <OTSession apiKey={config.TOK_API_KEY} sessionId={this.state.sessionId} token={this.state.token}>
                    <OTPublisher
                        properties={this.publisherProperties}
                        eventHandlers={this.publisherEventHandlers}
                    />
                </OTSession>

            </div >
        )
    }
}
