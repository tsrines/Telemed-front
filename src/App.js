import React from 'react';
import {
  Route,
  Link,
  Switch,
  withRouter,
} from 'react-router-dom'
import { Button, Image } from 'semantic-ui-react'
import DoctorShow from './components/DoctorShow'
import Doctors from './containers/Doctors'
import Video from './components/Video'
import Login from './components/Login'
import Profile from './components/Profile'
import Search from './components/Search'


import './App.css';

class App extends React.Component {

  state = {
    isLoggedIn: false,
    register: false,
    favorite: 0,
    currentUser: {
      id: "",
      email: "",
      address: "",
      password: "",
      passwordConfirmation: "",
      firstName: "",
      lastName: "",
      doctors: [],
      favorites: []
    },
    lat: 0,
    lng: 0,
    doctors: [],
    apiDoctors: [],
  }

  isFavorite = () => {
    let favoriteArray = this.state.currentUser.doctors.filter(doctor => doctor.api_id === this.props.match.params.id)
    if (favoriteArray.length > 0) {
      this.setState({
        favorite: 1
      })
    }
  
  }

  rate = (e, data) => {
    console.log(e, data)
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
      .then(data => 
        {
        let doctors = [...this.state.doctors]
        // this.setState({
        //   ...this.state,
        //   doctors: [data, ...doctors]
        // })
      })
  }

  heart = (doctor) => {
    // debugger
    console.log("this is doctor: ", doctor)
    let favorite = this.state.currentUser.favorites.find(favorite => favorite.api_id === doctor.uid)

    console.log("in the heart, before if", favorite)
    if (typeof favorite === "object") {
      console.log("in the if, before unHeart is called", favorite)
      this.unHeart(favorite)
    } else {
      console.log("in the else, before favorite is called", favorite)
      this.favorite(doctor)
    }
  }

  unHeart = (favorite) => {
    console.log("got here in the unheart", favorite)
    // let favorite = this.state.currentUser.userFavorites.find(favorite => favorite.api_id === doctor.uid)
    fetch(`http://localhost:3000/favorites/${favorite.id}`, {
      method: "DELETE",
    }).then(resp => resp.json()).then(data => {
      let favorites = this.state.currentUser.favorites.filter(favorite => favorite.id !== data.id)
      let doctors = this.state.currentUser.doctors.filter(doctor => doctor.api_id !== data.api_id)
      this.setState({
        ...this.state,
        favorite: 0,
        currentUser: {
          ...this.state.currentUser,
          favorites,
          doctors
        }
      }, () => console.log("currentUser state after delete: ", this.state.currentUser))
    })
  }

  favorite = (doctor) => {
    console.log("in the favorite")

    let favoriteObject = {
      user_id: this.state.currentUser.id,
      doctor_id: this.state.doctors[0].id,
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
      .then(data => {
        let favorites = [...this.state.currentUser.favorites]
        let doctors = [...this.state.currentUser.doctors]

        let newdoc = {
          id: data.doctor_id,
          api_id: doctor.uid,
          first_name: doctor.profile.first_name,
          last_name: doctor.profile.last_name,
          title: doctor.profile.title,
          gender: doctor.profile.gender,
          bio: doctor.profile.bio,
          phone_number: doctor.practices[0].phones[0].number}

        // userDoctors.filter
        this.setState({
            ...this.state,
            favorite: 1,
            currentUser: {
              ...this.state.currentUser,
              favorites: [data, ...favorites],
              doctors: [newdoc, ...doctors]

            }
          }, () => console.log("currentUser.favorites state after adding favorites:", this.state.currentUser))

        }, () => console.log("currentUser.userFavorites after favorites post", this.state.currentUser))

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
            doctors: data.doctors,
            favorites: data.favorites
          },
          isLoggedIn: true
        }, () => this.props.history.push('/search'))
      }

      )

  }

  userProfile = () => {


    let id = this.state.currentUser.id
    fetch(`http://localhost:3000/users/${id}`)
      .then(resp => resp.json())
      .then(data => {
        this.setState({
          profileDoctors: data.doctors
        }, () => this.props.history.push('/profile'))
      })
  }

  logOut = () => {
    this.setState({ isLoggedIn: false, currentUser: {} }, () => this.props.history.push('/'))
  }

  onSignUp = () => {
    this.setState({ register: !this.state.register })
  }
  // request to Google GeoCode API to turn string into Longitude/Latitude
  toGeoCode = (formData) => {
    this.props.history.push('/doctors')

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

    fetch(`https://serpapi.com/search?q=${firstName}%20${lastName},%20${title}&tbm=isch&ijn=0&api_key=${process.env.REACT_APP_SERP_API_KEY}`)
      .then(resp => { resp.json() })
      .then(data => {

        return data.images_results[0].original
      })
      .catch(err => {

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
        if (element.profile.gender === 'male') {
          doctorHash.image = 'https://semantic-ui.com/images/avatar2/large/matthew.png'
        } else if (element.profile.gender === 'female') {
          doctorHash.image = 'https://semantic-ui.com/images/avatar2/large/kristy.png'
        } else {
          doctorHash.image = 'https://semantic-ui.com/images/avatar2/large/elyse.png'
        }
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

    return (
      <div>
        <Button color="red" as={Link} to="/search">Search</Button>
        {/* {!this.state.isLoggedIn && <Button color="red" as={Link} to="/login">Sign Up / Login</Button>} */}
        {this.state.isLoggedIn && <Button color="red" onClick={() => this.userProfile()}>Profile</Button>}
        {this.state.isLoggedIn && <Button color="red" onClick={this.logOut}>Logout</Button>}



        {/* <NavBar logOut={this.logOut} currentUser={this.state.currentUser} logUserIn={this.logUserIn} currentCart={this.state.currentCart} /> */}
        <Image alt="" src=""></Image>
        {!this.state.isLoggedIn && <Login isLoggedIn={this.state.isLoggedIn} onSignUp={this.onSignUp} onSubmit={this.onSubmit} register={this.state.register} />}
        <Switch>
          <Route exact path='/doctors' render={routerProps => <Doctors createDoctor={this.createDoctor} apiDoctors={this.state.apiDoctors} {...routerProps} doctors={this.state.doctors} />} />
          <Route exact path='/search' render={routerProps => <Search currentUser={this.state.currentUser} {...routerProps} toGeoCode={this.toGeoCode} apiDoctors={this.state.apiDoctors} favorite={this.favorite} />} />
          <Route exact path='/doctors/:id' render={routerProps => <DoctorShow rate={this.rate} favorite={this.state.favorite} isFavorite={this.isFavorite} heart={this.heart} currentUser={this.state.currentUser} {...routerProps} apiDoctors={this.state.apiDoctors} favorite={this.favorite} />} />
          <Route exact path='/video' render={routerProps => <Video  {...routerProps} apiDoctors={this.state.apiDoctors} />} />
          <Route exact path='/profile' render={routerProps => <Profile patchUser={this.patchUser} currentUser={this.state.currentUser} apiDoctors={this.state.apiDoctors} profileDoctors={this.state.profileDoctors} isLoggedIn={this.state.isLoggedIn} {...routerProps} />} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App)