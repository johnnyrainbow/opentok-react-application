import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import gigaFetch from "./gigaFetch"
import CreateRoomSingle from './CreateRoomSingle';
export default class CreateRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rooms: []
        }
    }
    async createRoom() {
        const body = { maxOccupancy: 2, startAtOccupancy: 2, startAtTime: new Date(), title: "Sexy Preset" + Math.random(), description: "Just an exceedingly sexy generated room", cost: 30, isVariableCost: false, minJoinTime: 15 }
        const response = await gigaFetch('/rooms/create', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            body: JSON.stringify(body),
        })
        if (!response) return
        const roomId = response.room.hostId
        ReactDOM.render(<CreateRoomSingle roomId={roomId} />, document.getElementById('root'));
    }
    render() {
        return (
            <div className="App">
                <h1>Create room</h1>
                <button onClick={this.createRoom}>Create room with presets</button>
            </div>
        );
    }
}
