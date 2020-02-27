import React from 'react';
import {
  Route,
  Link,
  Switch,
  withRouter,
} from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import DoctorShow from './components/DoctorShow'
import Doctors from './containers/Doctors'
import Video from './components/Video'
import Login from './components/Login'
import Profile from './components/Profile'


import './App.css';

class App extends React.Component {

  state = {
    isLoggedIn: false,
    register: false,
    currentUser: {},
    lat: 0,
    lng: 0,
    doctors: [],
    apiDoctors: [],
    favoriteDoctors: []
  }

  createDoctor = (doctor) => {
    let doctorObj = {

      api_id: doctor.uid,
      first_name: doctor.profile.first_name,
      last_name: doctor.profile.last_name,
      title: doctor.profile.title,
      gender: doctor.profile.gender,
      bio: doctor.profile.bio,
      phone_number: doctor.practices[0].phones[0].number


    }
    fetch(`http://localhost:3000/doctors`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accepts": "application/json"
      },
      body: JSON.stringify(doctorObj)
    }).then(resp => resp.json())
      .then(data => this.setState({
        ...this.state,
        currentUser: {
          ...this.state.currentUser,
          favoriteDoctors: [data, ...this.state.favoriteDoctors]
        }

      }))
    console.log("doctor object: ", doctor, this.state.currentUser.id)
  }

  favorite = (doctor) => {

    let favoriteObject = {
      user_id: this.state.currentUser.id,
      doctor_id: this.state.currentUser.favoriteDoctors[0].id,
      api_id: doctor.uid
    }
    fetch(`http://localhost:3000/favorites`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accepts": "application/json"
      },
      body: JSON.stringify(favoriteObject)
    }).then(resp => resp.json())
      .then(data => console.log(data))

  }


  onSubmit = (formData) => {
    this.logInOrSignUp(formData)
  }

  logInOrSignUp = (formData) => {
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
      .then(data => {
        this.setState({
          ...this.state,
          currentUser: {
            id: data.id,
            email: data.email,
            address: data.address,
            password: data.password,
            passwordConfirmation: data.password_confirmation,
            firstName: data.first_name,
            lastName: data.last_name,
            favoriteDoctors: data.favorites
          },
          isLoggedIn: true
        }, () => this.props.history.push('/'))
      }

      )

  }

  logOut = () => {
    this.setState({ isLoggedIn: false, currentUser: {} }, () => this.props.history.push('/'))
  }

  onSignUp = () => {
    this.setState({ register: !this.state.register })
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


  }

  imageApi = (firstName, lastName, title) => {
    // debugger
    fetch(`https://serpapi.com/search?q=${firstName}%20${lastName},%20${title}&tbm=isch&ijn=0&api_key=${process.env.REACT_APP_SERP_API_KEY}`)
      .then(resp => { resp.json() })
      .then(data => {

        return data.images_results[0].original
      })
      .catch(err => {
        // debugger
        console.error(err)
      })
  }

  parseDoctors = (doctorsArray) => {

    let doctors = []
    doctorsArray.map(element => {


      try {
        let doctorHash = {}
        doctorHash.id = element.uid
        // doctorHash.image = this.imageApi(element.profile.first_name, element.profile.last_name, element.profile.title)
        doctorHash.firstName = element.profile.first_name
        doctorHash.lastName = element.profile.last_name
        doctorHash.title = element.profile.title
        doctorHash.gender = element.profile.gender
        doctorHash.phone = element.practices[0].phones[0].number

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

  patchUser = (userData) => {

    fetch(`http://localhost:3000/users/${this.state.currentUser.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "accepts": "application/json"
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.passwordConfirmation,
        first_name: userData.firstName,
        last_name: userData.lastName,
        address: userData.address,

      })
    }).then(resp => resp.json())
      .then(data =>
        this.setState({
          ...this.state,
          currentUser: {
            id: data.id,
            email: data.email,
            address: data.address,
            password: data.password,
            passwordConfirmation: data.password_confirmation,
            firstName: data.first_name,
            lastName: data.last_name
          }
        }, () => console.log(this.state.currentUser)))
  }

  render() {
    console.log(this.state.currentUser.favoriteDoctors)
    return (
      <div>
        <Button color="red" as={Link} to="/doctors">Search</Button>
        {!this.state.isLoggedIn && <Button color="red" as={Link} to="/login">Sign Up / Login</Button>}
        {this.state.isLoggedIn && <Button color="red" as={Link} to="/profile">Profile</Button>}
        {this.state.isLoggedIn && <Button color="red" onClick={this.logOut}>Logout</Button>}



        {/* <NavBar logOut={this.logOut} currentUser={this.state.currentUser} logUserIn={this.logUserIn} currentCart={this.state.currentCart} /> */}
        <Switch>
          <Route exact path='/doctors' render={routerProps => <Doctors createDoctor={this.createDoctor} apiDoctors={this.state.apiDoctors} doctors={this.state.doctors} {...routerProps} toGeoCode={this.toGeoCode} />} />
          <Route exact path='/doctors/:id' render={routerProps => <DoctorShow currentUser={this.state.currentUser} {...routerProps} apiDoctors={this.state.apiDoctors} favorite={this.favorite} />} />
          <Route exact path='/video' render={routerProps => <Video  {...routerProps} apiDoctors={this.state.apiDoctors} />} />
          <Route exact path='/login' render={routerProps => <Login isLoggedIn={this.state.isLoggedIn} onSignUp={this.onSignUp} onSubmit={this.onSubmit} register={this.state.register} {...routerProps} />} />
          <Route exact path='/profile' render={routerProps => <Profile patchUser={this.patchUser} currentUser={this.state.currentUser} isLoggedIn={this.state.isLoggedIn} {...routerProps} />} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App)