import React, { Component } from 'react';
import './App.css';
import Room from "./Room"
import config from "./config.json"
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

  render() {
    return (
      <div className="App" >
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
