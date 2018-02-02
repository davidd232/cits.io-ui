require('babel-polyfill');
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import PropertySearch from './PropertySearch';
import axios from 'axios';

class Signup extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      userType: null,
      full_name: '',
      email: '',
      username: '',
      phone: '',
      password: '',
      propName: '',
      propAddress: '',
      propSecret: '',
      userID: null,
      propertyID: null
    }

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  inputChangeHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  async submitHandler() {
    console.log(this.state);

    const userBody = {
      full_name: this.state.full_name,
      email: this.state.email,
      phonenumber: this.state.phone,
      username: this.state.username,
      password: this.state.password,
      type: this.state.userType
    };

    const propBody = {
      name: this.state.propName,
      address: this.state.propAddress,
      secret_key: this.state.propSecret
    }

    await axios
      .post('http://localhost:3396/api/auth/signup', userBody)

    this.state.propName && this.state.propAddress && this.state.propSecret ?
    await axios
      .post('http://localhost:3396/api/properties/create', propBody)
    : null;
    // axios to persist user first
    // axios to persist property second
    // set state to user and prop IDs returned by previous requests
    // axios to add both user and prop IDs to joint table
  }

  render() {
    return (
      <div>
        Hello from signup!
        {/* Standard form displayed on page load */}
        <form action="/api/auth/signup" method="post">
          <div>
            Select User Type:
            <select 
              name="userType"
              defaultValue="select"
              onChange={this.inputChangeHandler}
            >
              <option name="select" value="">Select User Type</option>
              <option name="tenant" value="0">Tenant</option>
              <option name="manager" value="1">Manager</option>
            </select>
          </div>
          
          <div>
            Full Name:
            <input 
              name="full_name" 
              placeholder="Enter Full Name"
              onChange={this.inputChangeHandler}
            />
          </div>

          <div>
            Email:
            <input 
              name="email" 
              placeholder="Enter Email"
              onChange={this.inputChangeHandler}
            />
          </div>

          <div>
            Username:
            <input 
              name="username" 
              placeholder="Enter Username"
              onChange={this.inputChangeHandler}
            />
          </div>

          <div>
            Phone:
            <input 
              name="phone" 
              placeholder="Phone Number"
              onChange={this.inputChangeHandler}
            />
          </div>

          <div>
            Password:
            <input 
              name="password" 
              placeholder="Enter Password"
              onChange={this.inputChangeHandler}
            />
          </div>
        </form>

        {/* Conditional properties form based on selected user type */}
        {
          !this.state.userType ? null :
          this.state.userType === "0" ? 
            <div>
              Property (Tenant):
              <PropertySearch 
                inputChangeHandler={this.inputChangeHandler}
                userType={this.state.userType} 
              />
              needs:
              - selected property OR
              - new property fields
            </div>
          :
          this.state.userType === "1" ? 
            <div>
              Property (Manager):
              <PropertySearch 
                inputChangeHandler={this.inputChangeHandler}
                userType={this.state.userType}
              />
            </div>
          : null
        } 
        {
          !this.state.userType ? null :
          <div>
            <button
              onClick={this.submitHandler}
            >
              Sign Up
            </button>
          </div>
        }
      </div>
    );
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

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Signup));