import React from 'react';
import {
  Route,
  Link,
  Switch,

} from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import DoctorShow from './components/DoctorShow'
import Doctors from './containers/Doctors'
import Video from './components/Video'

import './App.css';


const geoCodeUrl = ``


export default class App extends React.Component {

  state = {
    lat: 0,
    lng: 0,
    doctors: [],
    apiDoctors: []
  }
  // request to Google GeoCode API to turn string into Longitude/Latitude
  toGeoCode = (formData) => {

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${formData.address}&key=${process.env.REACT_APP_GOOGLE_GEOCODE_API_KEY}`)
      .then(resp => resp.json())
      .then(data => this.setState({
        lat: data["results"][0].geometry.location.lat,
        lng: data["results"][0].geometry.location.lng
      }, () => this.getDoctors(formData)))

  }

  // request to BetterDoc API with Long/Lat

  getDoctors = (formData) => {

    fetch(`https://api.betterdoctor.com/2016-03-01/doctors?query=${formData.ailment}&location=${this.state.lat}%2C${this.state.lng}%2C${formData.miles}&skip=0&limit=100&user_key=${process.env.REACT_APP_BETTER_DOC_API_KEY}`)
      .then(resp => resp.json())
      .then(data => {
        this.setState({
          apiDoctors: data.data
        })
        this.parseDoctors(data.data)
      }).catch((error) => {
        console.log(error)
      })
    // this.setState({ doctors: data.data }, () => this.postDoctors(this.state.doctors)))

  }

  parseDoctors = (doctorsArray) => {

    let doctors = []
    doctorsArray.map(element => {
      try {
        let doctorHash = {}
        doctorHash.id = element.uid
        doctorHash.firstName = element.profile.first_name
        doctorHash.lastName = element.profile.last_name
        doctorHash.specialty = element.specialties[0].name
        doctors.push(doctorHash)
      }
      catch (err) {
        console.log(err.message)
      }
    })

    this.setState({
      doctors
    })
  }

  // postDoctors = (doctors) => {
  //   fetch(`http://localhost:3000/doctors`, {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //       "accepts": "application/json"
  //     },
  //     body: JSON.stringify({ doctors })
  //   }).then(resp => resp.json()).then(data => console.log(data))

  // }

  render() {

    return (
      <div>
        <Button as={Link} to="/doctors">Search</Button>

        {/* <NavBar logOut={this.logOut} currentUser={this.state.currentUser} logUserIn={this.logUserIn} currentCart={this.state.currentCart} /> */}
        <Switch>
          <Route exact path='/doctors' render={routerProps => <Doctors apiDoctors={this.state.apiDoctors} doctors={this.state.doctors} {...routerProps} toGeoCode={this.toGeoCode} />} />
          <Route exact path='/doctors/:id' render={routerProps => <DoctorShow  {...routerProps} apiDoctors={this.state.apiDoctors} />} />
          <Route exact path='/video' render={routerProps => <Video  {...routerProps} apiDoctors={this.state.apiDoctors} />} />
        </Switch>
      </div>
    );
  }
}


