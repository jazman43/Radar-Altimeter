import React, { useEffect, useState } from 'react';

import './App.css';
//import images of Altimeter
import scale from './assets/radaltback.png';
import cover from './assets/radaltcover.png';
import needle from './assets/radaltneedle.png';
import bugImg from './assets/bug.png';
import flagImg from './assets/radaltflag.png';

//global variables
let altimeterExeedBug = false;
let altimeterRecedeBug = false;
let lightOn = false;

//function components
function FlagImg(props) {
  //if power is on return no image else show image 
  if (props.ispoweronflag) {
    return null;
  }

  return (
    <img src={flagImg} className="altimeter-child-objects" />
  );
}

function Needle(props) {

  //local variables
  let rotDeg;
  let style;
  let rotDegback;
  if (props.altimeterValue <= 500) {
    rotDeg = (0.36 * props.altimeterValue);
  }
  else if (props.altimeterValue <= 1500) {
    rotDeg = (0.09 * (props.altimeterValue - 500)) + 180;
  }

  //change to string to use in css styles
  rotDeg = rotDeg.toString();

  if (props.currentpowervalue) {
    style = {
      transform: "rotate(" + rotDeg + "deg)"
    };
    rotDegback = rotDeg;
  }
  else {
    style = {
      transform: "rotate(" + rotDegback + "deg)"
    };
  }

  //return image with dynamic styles to allow needle to move from 0 to 1500 and back
  return (
    <img src={needle} className="altimeter-child-objects" style={style} />
  );

}


function BugImg(props) {

  //local variables
  let rotDeg;
  if (props.bugVal <= 500) {
    rotDeg = (0.36 * props.bugVal);
  }
  else if (props.bugVal <= 1500) {
    rotDeg = (0.09 * (props.bugVal - 500)) + 180;
  }

  //change to string to use in css styles
  rotDeg = rotDeg.toString();

  let style = {
    transform: "rotate(" + rotDeg + "deg)"
  };

  //return image with dynamic styles to allow needle to move from 0 to 1500 and back
  return (
    <img src={bugImg} className="altimeter-child-objects" style={style} />
  );

}




function CoverLight(props) {


  if (altimeterExeedBug == false) {
    if (props.currentpowervalue) {
      if ((props.altimeterValue - props.bugVal) > 0) {
        altimeterExeedBug = true
        console.log("AltExceedBug " + altimeterExeedBug + ", altVal " + props.altimeterValue + ", bugVal " + props.bugVal)
      }
    }
  }
  else {
    if (altimeterRecedeBug == false) {
      if (props.currentpowervalue) {
        if ((props.altimeterValue - props.bugVal) < 0) {
          altimeterRecedeBug = true
          console.log("altRecedeBug " + altimeterRecedeBug + ", altVal " + props.altimeterValue + ", bugVal " + props.bugVal)
        }
      }
    }
  }

  if (altimeterExeedBug) {
    if (altimeterRecedeBug) {
      lightOn = true;
    }
    else {
      lightOn = false
    }
  }

  return (
    <span className={lightOn ? "circleon" : "circleoff"}></span>
  );
}

//class component puting all togeter
class Altimeter extends React.Component {

  //constructor of the default state
  constructor(props) {
    super(props);
    this.state = {
      powerOn: false,
      altitude: 0,
      bug: 0
    };
  }


  handlePowerOnClick() {
    this.setState(state => ({
      powerOn: !state.powerOn
    }));
    if (this.state.powerOn == true) {
      altimeterExeedBug = false;
      altimeterRecedeBug = false;
      lightOn = false
    }

  }

  handleAltChange(event) {
    this.setState(state => ({
      altitude: event.target.value,
    }));
  }

  handleBugChange(event) {
    this.setState({
      bug: event.target.value
    });

  }


  //html layout
  render() {
    return (
      <div>
        <h1>Radar Altimeter</h1>
        <div className="altimeter-wrapper-image" >
          <img src={scale} className="altimerer-scale-image" />
          <Needle altimeterValue={this.state.altitude} currentpowervalue={this.state.powerOn} />
          <BugImg bugVal={this.state.bug} />
          <FlagImg ispoweronflag={this.state.powerOn} />
          <img src={cover} className="altimeter-child-objects" />
          <CoverLight altimeterValue={this.state.altitude} bugVal={this.state.bug} currentpowervalue={this.state.powerOn} />

        </div>
        <br />
        <br />

        <div class="controls">
          Altitude: <input type="range" min="0" max="1500" step="1" defaultValue={this.state.altitude} onChange={(e) => this.handleAltChange(e)} /><span>{this.state.altitude}</span>
          <br />
          Bug: <input type="range" min="0" max="1500" step="1" defaultValue={this.state.bug} onChange={(e) => this.handleBugChange(e)} /><span>{this.state.bug}</span>
          <br />
          Has power: <input type="checkbox" onChange={() => this.handlePowerOnClick()} />
        </div>
      </div>
    );
  }
}



function App() {

  return (
    <Altimeter />
  );
}

export default App;
