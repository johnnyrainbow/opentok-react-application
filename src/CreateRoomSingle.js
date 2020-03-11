import React, { Component } from 'react';
import gigaFetch from "./gigaFetch"
import config from "./config.json"
const OT = require('@opentok/client');

export default class CreateRoomSingle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            room: null
        }
        console.log("construct")
    }
    componentDidMount() {
        this.getRoom(this.props.roomId)
    }
    async getRoom(roomId) {
        console.log(roomId)
        const response = await gigaFetch(`/rooms/${roomId}`, { method: "GET" })
        if (!response) return
        console.log("GOT RES")
        console.log(response)
        this.setState({ room: response.room[0] })
    }
    async createBroadcast() {
        const body = { roomId: this.state.room.hostId }
        const broadcastResponse = await gigaFetch('/broadcasts/create', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            body: JSON.stringify(body),
        })
        if (!broadcastResponse) return
        const { broadcast } = broadcastResponse
        const response = await gigaFetch(`/broadcasts/${broadcast.id}/publisher`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
        })
        if (!response) return
        console.log("publisher token")
        console.log(response.token)
        console.log(broadcast)
        this.beginBroadcasting(response.token, broadcast.sessionId)
    }
    beginBroadcasting(token, sessionId) {
        const self = this
        console.log(token + ":" + sessionId + ":" + config.TOK_API_KEY)
        var session = OT.initSession(config.TOK_API_KEY, sessionId);
        session.connect(token, function (error) {
            console.log("connecting session")
            const result = Promise.all([
                OT.getUserMedia({
                    videoSource: 'screen'
                }),
                OT.getUserMedia({
                    videoSource: null
                })
            ])
                .then(([screenStream, micStream]) => {
                    const publisher = OT.initPublisher("publisher", {
                        videoSource: screenStream.getVideoTracks()[0],
                        audioSource: micStream.getAudioTracks()[0]
                    });
                    //make GO LIVE button
                    self.setState({ publisher })
                    self.setState({ session })
                    // If the connection is successful, publish to the session

                })
        })

    }
    publishBroadcast() {
        const self = this
        const { session, publisher } = this.state
        session.publish(publisher, (error, result) => {
            if (error) alert(error.message)
            self.setState({ broadcasting: true })
        });
    }

    render() {
        console.log("rendering..")
        console.log(this.state)
        let available_button;
        if (this.state.session && !this.state.broadcasting) {
            available_button = (<button onClick={this.publishBroadcast.bind(this)}>Go LIVE </button>)
        } else {
            available_button = (<button onClick={this.createBroadcast.bind(this)}>Setup Stream </button>)
        }
        if (!this.state.room) return null
        return (
            <div className="App">
                {available_button}
            </div>
        );
    }
}
