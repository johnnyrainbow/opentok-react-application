import React, { Component } from 'react';
import './App.css';

import config from "./config.json"
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';
export default class Stream extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rooms: []
        }
    }



}
