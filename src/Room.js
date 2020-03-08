import React from 'react'
import ReactDOM from 'react-dom';
import SingleRoom from "./SingleRoom"
import config from "./config.json"
class Room extends React.Component {
    constructor(props) {
        super(props)
    }
    requestJoinRoom = async () => {
        const response = await fetch(`${config.API_ENDPOINT}/rooms/${this.props.room.id}/join`, {
            headers: new Headers({
                'Authorization': `Bearer ${config.API_TOKEN}`,
                'Content-Type': 'application/json'
            })
        })

        const data = await response.json()

        if (data.error) {
            alert(data.error)
            return false
        }
        return true
    }
    //called on click of room container
    joinRoom = async () => {
        const canJoin = await this.requestJoinRoom()

        if (canJoin)
            ReactDOM.render(<SingleRoom room={this.props.room} />, document.getElementById('root'));
    }
    render() {
        return (
            <div className="room-container" onClick={this.joinRoom}>
                <h1>{this.props.room.title}</h1>
            </div>
        )
    }
}
export default Room