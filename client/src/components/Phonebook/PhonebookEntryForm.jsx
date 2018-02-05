import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setPhonebookEditState } from '../../actions/setPhonebookEditState';
import { setPhonebookData } from '../../actions/setPhonebookData';
import { setCurrentPhonebookEntry } from '../../actions/setCurrentPhonebookEntry';
import axios from 'axios';

class PhonebookEntryForm extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.getElementsByName('company')[0].value = this.props.data.company ? this.props.data.company : null;
    document.getElementsByName('service')[0].value = this.props.data.service ? this.props.data.service : null;
    document.getElementsByName('contactinfo')[0].value = this.props.data.contactinfo ? this.props.data.contactinfo : null;
  }

  async onAddHandler() {
    const payload = {
      propertyId: '1',
      company: document.getElementsByName('company')[0].value.toString(),
      service: document.getElementsByName('service')[0].value.toString(),
      contactInfo: document.getElementsByName('contactinfo')[0].value.toString()
    }
    const { data } = await axios.post('http://localhost:3396/api/phonebooks/create', payload);
    const d = await axios.get(`http://localhost:3396/api/phonebooks/1`);
    this.props.setPhonebookData(d.data);
    data ? await this.props.setPhonebookEditState('0') : null;
  }

  async onUpdateHandler() {
    const payload = {
      id: this.props.data.id.toString(),
      company: document.getElementsByName('company')[0].value.toString(),
      service: document.getElementsByName('service')[0].value.toString(),
      contactInfo: document.getElementsByName('contactinfo')[0].value.toString()
    }
    console.log('this is payload!', payload);
    const { data } = await axios.put('http://localhost:3396/api/phonebooks/update', payload);
    console.log('this is d!', data);
    const d = await axios.get(`http://localhost:3396/api/phonebooks/1`);
    this.props.setPhonebookData(d.data);
    data ? await this.props.setPhonebookEditState('0') : null;
  }

  async onDeleteHandler() {
    await axios.delete(`http://localhost:3396/api/phonebooks/delete/${this.props.data.id}`);
    const d = await axios.get(`http://localhost:3396/api/phonebooks/1`);
    await this.props.setPhonebookData(d.data);
    await this.props.setPhonebookEditState('0');
  }

  render() {
    return (
      <div>
        Company: <input type='text' name='company'></input>
        <br/><br/>
        Service: <input type='text' name='service'></input>
        <br/><br/>
        Contact Info: <input type='text' name='contactinfo'></input>
        <br/><br/>
        {this.props.phonebookEditState === '1' ? <button onClick={this.onAddHandler.bind(this)}>ADD</button> : null}
        {this.props.phonebookEditState === '2' ? <div><button onClick={this.onUpdateHandler.bind(this)}>UPDATE</button><button onClick={this.onDeleteHandler.bind(this)}>DELETE</button></div> : null}
        <br/><br/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    phonebookEditState:state.phonebookEditState
    // userData: state.userData,
    // phonebookData: state.phonebookData
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setPhonebookData:setPhonebookData,
    // setUserData:setUserData
    setPhonebookEditState:setPhonebookEditState,
    setCurrentPhonebookEntry:setCurrentPhonebookEntry
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(PhonebookEntryForm));