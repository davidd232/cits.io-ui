import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import io from 'socket.io-client/dist/socket.io.js';
import axios from 'axios';
import moment from 'moment';

class Messages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: null,
      messages: [],
      message: '',
      username: '',
      roomname: '',
      type: ''
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  componentWillMount() {
    axios.get(`http://localhost:3396/api/chat/getMessages`)
      .then((res) => {
        this.setState({
          messages: res.data
        })
      })
      .catch(() => {
        console.log('error fetching messages.  WHOOPS!');
      })
    console.log(this.props.userData)
    const socket = io.connect(`http://localhost:4155`, {
      query: {
        roomId: 'ROOMNAME' //this will change to the room of the property that I put into the URL
      }
    })
    socket.on('connect', () => {
      socket.emit('client.ready', 'SWAP WITH ROOM NAME AT SOME POINT');
    })
    socket.on('server.initialState', () => {
      this.setState({ socket })
    })
    socket.on('server.message', async (data) => {
      try {
        const message = await axios.get(`http://localhost:3396/api/chat/getMostRecentMessage`)
        await this.setState({
          messages: [...this.state.messages, message.data[0]]
        })
      } catch (err) {
        console.log('error fetching messages');
      }
      
    })
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleKeyPress(e) {
    if (e.keyCode === 13) {
      this.handleClick(e);
    }
  }
  async handleClick(e) {
    e.preventDefault();
    if (document.getElementById('message').value === '') {
      return;
    }
    const payload = {
      message: this.state.message,
      username: 'USER',
      roomname: 'ROOMNAME',
      type: 'TENANT OR MANAGER'
    }
    try {
      const data = await axios.post(`http://localhost:3396/api/chat/addMessage`, payload)
      data.data ? this.state.socket.emit('client.message', (data.data)) : console.log('error retrieving data');
      console.log('here?', data.data);
    } catch (err) {
      console.log('error', err);
    }
    document.getElementById('message').value = '';
  }
  render() {
    return (
      <div>
        <div>
          <ul>
            {this.state.messages.map((message, i) => (
              <div key={i}>
                <li>{message.username}: {message.message} <br/>{moment(message.date).fromNow()}</li>
              </div>
            ))}
          </ul>
        </div>
        <input onKeyUp={this.handleKeyPress} id="message" onChange={this.handleChange} type="text" name="message" autoComplete="off"></input>
        <button onClick={this.handleClick} type="submit">SUBMIT</button>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    userData: state.userData
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    //
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Messages);