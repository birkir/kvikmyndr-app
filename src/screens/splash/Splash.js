import { Component } from 'react';
// import PropTypes from 'prop-types';

export default class Splash extends Component {

  componentDidMount() {
    console.log('start timeout');
    setTimeout(() => {
      console.log('Done timeout');
    }, 1000);
  }

  render() {
    return null;
  }
}
