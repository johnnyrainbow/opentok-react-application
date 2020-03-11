import React, { Component } from 'react';
import './App.css';
import Room from "./Room"
import config from "./config.json"
import ReactDOM from 'react-dom';
import CreateRoom from './CreateRoom';

export default class RoomExplorer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rooms: []
    }
  }

  componentDidMount() {
    this.getRooms()
  }
  getRooms = async () => {
    const response = await fetch(`${config.API_ENDPOINT}/rooms`, {
      headers: new Headers({
        'Authorization': `Bearer ${config.API_TOKEN}`,
        'Content-Type': 'application/json'
      })
    })
    const data = await response.json()
    console.log(data)
    this.setState({ rooms: data.rooms })
  }
  createRoom() {
    ReactDOM.render(<CreateRoom />, document.getElementById('root'));
  }
  render() {
    return (
      <div className="App">
        <button onClick={this.createRoom}>Create Room</button>
        {
          this.state.rooms.map(room => (
            <Room
              key={room.id}
              room={room}
            />
          ))
        }

      </div >
    );
  }

}
