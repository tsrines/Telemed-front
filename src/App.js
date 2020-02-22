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
import Login from './components/Login'
import './App.css';

export default class App extends React.Component {

  state = {
    isLoggedIn: false,
    register: false,
    currentUser: "",
    lat: 0,
    lng: 0,
    doctors: [],
    apiDoctors: []
  }

  onSubmit = (formData) => {
    if (Object.keys(formData).length > 2) {
      this.createUser(formData)
    } else {
      this.findUser(formData)
    }
  }

  findUser = formData => {
    fetch(`http://localhost:3000/users`).then(resp => resp.json())
      .then(data => console.log(data))
  }

  setCurrentUser = () => {

  }

  createUser = (formData) => {
    fetch(`http://localhost:3000/users`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accepts": "application.json"
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation

      })
    }).then(resp => resp.json())
      .then(data => console.log(data))
      .catch(error => console.log(error))
  }

  onSignUp = () => {
    this.setState({ register: !this.state.register })
  }
  // request to Google GeoCode API to turn string into Longitude/Latitude
  toGeoCode = (formData) => {
    console.log(formData)

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
    console.log(this.state.apiDoctors)
    return (
      <div>
        <Button color="red" as={Link} to="/doctors">Search</Button>
        <Button color="red" as={Link} to="/login">Sign Up / Login</Button>


        {/* <NavBar logOut={this.logOut} currentUser={this.state.currentUser} logUserIn={this.logUserIn} currentCart={this.state.currentCart} /> */}
        <Switch>
          <Route exact path='/doctors' render={routerProps => <Doctors apiDoctors={this.state.apiDoctors} doctors={this.state.doctors} {...routerProps} toGeoCode={this.toGeoCode} />} />
          <Route exact path='/doctors/:id' render={routerProps => <DoctorShow  {...routerProps} apiDoctors={this.state.apiDoctors} />} />
          <Route exact path='/video' render={routerProps => <Video  {...routerProps} apiDoctors={this.state.apiDoctors} />} />
          <Route exact path='/login' render={routerProps => <Login isLoggedIn={this.state.isLoggedIn} onSignUp={this.onSignUp} onSubmit={this.onSubmit} register={this.state.register} {...routerProps} />} />
        </Switch>
      </div>
    );
  }
}