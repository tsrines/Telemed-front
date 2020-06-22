import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Button, Image } from 'semantic-ui-react';
import DoctorShow from './components/DoctorShow';
import Doctors from './containers/Doctors';
import Login from './components/Login';
import Profile from './components/Profile';
import Search from './components/Search';
import './App.css';

class App extends React.Component {
  state = {
    isLoading: false,
    isLoggedIn: false,
    register: false,
    favorite: 0,
    currentUser: {
      id: '',
      email: '',
      address: '',
      password: '',
      passwordConfirmation: '',
      firstName: '',
      lastName: '',
      doctors: [],
      favorites: [],
    },
    lat: 0,
    lng: 0,
    doctors: [],
    error: false,
    apiDoctors: [],
    users: [],
  };

  isFavorite = () => {
    // eslint-disable-next-line
    let favoriteArray = this.state.currentUser.doctors.filter(
      (doctor) => doctor.api_id == this.props.match.params.id
    );
    if (favoriteArray.length > 0) {
      this.setState({
        favorite: 1,
      });
    }
  };

  rate = (e, data) => {};

  createDoctor = (doctor, isSeed) => {
    let doctorObj = {
      api_id: doctor.id,
      first_name: doctor.firstName,
      last_name: doctor.lastName,
      address: doctor.address,
      image: doctor.image,
      specialty: doctor.specialty,
      title: doctor.title,
      gender: doctor.gender,
      bio: doctor.bio,
      phone_number: doctor.phone,
    };
    fetch('https://localhost:3000/doctors', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accepts: 'application/json',
      },
      body: JSON.stringify(doctorObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        let doctors = [...this.state.doctors];
        this.setState(
          {
            ...this.state,
            doctors: [data, ...doctors],
          },
          () => {
            this.props.history.push('/doctors');
          }
        );
      }, this.setState({ isLoading: false }));
  };

  heart = (doctor) => {
    let favorite = this.state.currentUser.favorites.find(
      (favorite) => favorite.api_id == doctor.api_id
    );

    // eslint-disable-next-line
    if (typeof favorite == 'object') {
      this.unHeart(favorite);
    } else {
      this.favorite(doctor);
    }
  };

  unHeart = (favorite) => {
    // debugger

    // let favorite = this.state.currentUser.userFavorites.find(favorite => favorite.api_id === doctor.uid)
    // eslint-disable-next-line
    fetch(`http://localhost:3000/favorites/${favorite.id}`, {
      method: 'DELETE',
    })
      .then((resp) => resp.json())
      .then((data) => {
        let favorites = this.state.currentUser.favorites.filter(
          (favorite) => favorite.id !== data.id
        );
        let doctors = this.state.currentUser.doctors.filter(
          (doctor) => doctor.api_id !== data.api_id
        );
        this.setState({
          ...this.state,
          favorite: 0,
          doctors: [data.doctor, ...this.state.doctors],
          currentUser: {
            ...this.state.currentUser,
            favorites: favorites,
            doctors: doctors,
          },
        });
      });
  };

  favorite = (doctor) => {
    let favoriteObject = {
      user_id: this.state.currentUser.id,
      doctor_id: doctor.id,
      api_id: doctor.api_id,
    };

    fetch('http://localhost:3000/favorites', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accepts: 'application/json',
      },
      body: JSON.stringify(favoriteObject),
    })
      .then((resp) => resp.json())
      .then((data) => {
        let favorites = [...this.state.currentUser.favorites];
        let doctors = [...this.state.currentUser.doctors];

        let newdoc = {
          id: data.doctor_id,
          api_id: doctor.api_id,
          first_name: doctor.first_name,
          last_name: doctor.last_name,
          title: doctor.title,
          gender: doctor.gender,
          bio: doctor.bio,
          phone_number: doctor.phone_number,
        };

        // userDoctors.filter
        this.setState({
          ...this.state,
          favorite: 1,
          currentUser: {
            ...this.state.currentUser,
            favorites: [data, ...favorites],
            doctors: [newdoc, ...doctors],
          },
        });
      });
  };

  onSubmit = (formData) => {
    this.logInOrSignUp(formData);
  };

  logInOrSignUp = (formData) => {
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accepts: 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        this.setState(
          {
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
              favorites: data.favorites,
            },
            isLoggedIn: true,
          },
          () => this.props.history.push('/search')
        );
      });
  };

  userProfile = () => {
    let id = this.state.currentUser.id;
    fetch(`http://localhost:3000/users/${id}`)
      .then((resp) => resp.json())
      .then((data) => {
        this.setState(
          {
            ...this.state,
            currentUser: {
              ...this.state.currentUser,
              doctors: data.doctors,
            },
          },
          () => {
            this.props.history.push('/profile');
          }
        );
      });
  };

  logOut = () => {
    this.props.history.push('/');
    this.setState({ isLoggedIn: false, currentUser: {}, doctors: [] });
  };

  onSignUp = () => {
    this.setState({ register: !this.state.register });
  };
  // request to Google GeoCode API to turn string into Longitude/Latitude
  toGeoCode = (formData) => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${formData.address}&key=AIzaSyCuEOeSzUNgNIoiSLtWMZdIUPkl0S3DTDI`
    )
      .then((resp) => resp.json())
      .then((data) =>
        this.setState(
          {
            lat: data['results'][0].geometry.location.lat,
            lng: data['results'][0].geometry.location.lng,
          },
          () => this.getDoctors(formData)
        )
      )
      .catch((err) => console.log(err));
  };

  // request to BetterDoc API with Long/Lat
  isResolved = () => {
    if (this.state.apiDoctors.length < 1) {
      this.setState({ error: true });
    } else {
      this.setState({ error: false });
    }
  };

  getDoctors = (formData) => {
    fetch(
      `https://api.betterdoctor.com/2015-01-27/doctors?query=${formData.ailment}&location=${this.state.lat}%2C${this.state.lng}%2C${formData.miles}&skip=0&limit=100&user_key=456c38f1b8349922db25eb4a4fd44429`
    )
      .then((resp) => resp.json())
      .then((data) => {
        this.setState(
          {
            apiDoctors: data.data,
            isLoading: false,
          },
          () => this.isResolved()
        );
        this.parseDoctors(data.data);
      })
      .catch((err) => {
        this.getSeeds();
      });
  };

  parseDoctors = (doctorsArray) => {
    let doctors = [];
    doctorsArray.map((element) => {
      try {
        let doctorHash = {};
        doctorHash.id = element.uid;
        // doctorHash.image = this.imageApi(element.profile.first_name, element.profile.last_name, element.profile.title)
        doctorHash.firstName = element.profile.first_name;
        doctorHash.lastName = element.profile.last_name;
        if (element.profile.gender === 'male') {
          doctorHash.image =
            'https://semantic-ui.com/images/avatar2/large/matthew.png';
        } else if (element.profile.gender === 'female') {
          doctorHash.image =
            'https://semantic-ui.com/images/avatar2/large/kristy.png';
        } else {
          doctorHash.image =
            'https://semantic-ui.com/images/avatar2/large/elyse.png';
        }
        doctorHash.title = element.profile.title;
        doctorHash.bio = element.profile.bio;
        doctorHash.address = element.practices[0].address;
        doctorHash.gender = element.profile.gender;
        doctorHash.phone = element.practices[0].phones[0].number;

        doctorHash.specialty = element.specialties[0].name;
        doctors.push(doctorHash);
        this.createDoctor(doctorHash);
      } catch (err) {
        console.log(err);
      }
    });
  };

  loadingHandler = () => {
    this.setState({ isLoading: true });
  };

  patchUser = (userData) => {
    fetch('http://localhost:3000' + `/users/${this.state.currentUser.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        accepts: 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.passwordConfirmation,
        first_name: userData.firstName,
        last_name: userData.lastName,
        address: userData.address,
      }),
    })
      .then((resp) => resp.json())
      .then((data) =>
        this.setState({
          ...this.state,
          currentUser: {
            doctors: data.doctors,
            favorites: data.favorites,
            id: data.id,
            email: data.email,
            address: data.address,
            password: data.password,
            passwordConfirmation: data.password_confirmation,
            firstName: data.first_name,
            lastName: data.last_name,
          },
        })
      );
  };

  componentDidMount() {
    // let doctorsInCurrentState = [...this.state.doctors]
    fetch('http://localhost:3000' + `/users`)
      .then((resp) => resp.json())
      .then((users) => {
        this.setState({
          users,
        });
      });
  }

  searchButton = () => {
    if (this.state.isLoggedIn) {
      this.props.history.push('/search');
    } else {
      alert('Please log in before searching');
    }
  };

  getSeeds = () => {
    fetch('http://localhost:3000/seeds')
      .then((res) => res.json())
      .then((doctors) => {
        this.setState({ doctors, isLoading: false }, () =>
          this.props.history.push('/doctors')
        );
      });
  };

  render() {
    return (
      <div>
        <Button color='red' onClick={() => this.searchButton()}>
          Search
        </Button>
        {this.state.isLoggedIn && (
          <Button color='red' onClick={() => this.userProfile()}>
            Profile
          </Button>
        )}
        {this.state.isLoggedIn && (
          <Button color='red' onClick={this.logOut}>
            Logout
          </Button>
        )}
        <Image alt='' src=''></Image>
        {!this.state.isLoggedIn && (
          <Login
            isLoggedIn={this.state.isLoggedIn}
            onSignUp={this.onSignUp}
            onSubmit={this.onSubmit}
            register={this.state.register}
          />
        )}
        <Switch>
          <Route
            exact
            path='/doctors'
            render={(routerProps) => (
              <Doctors
                createDoctor={this.createDoctor}
                {...routerProps}
                doctors={this.state.doctors}
              />
            )}
          />
          <Route
            exact
            path='/search'
            render={(routerProps) => (
              <Search
                error={this.state.error}
                isLoading={this.state.isLoading}
                currentUser={this.state.currentUser}
                loadingHandler={this.loadingHandler}
                {...routerProps}
                toGeoCode={this.toGeoCode}
                favorite={this.favorite}
              />
            )}
          />
          <Route
            exact
            path='/doctors/:id'
            render={(routerProps) => (
              <DoctorShow
                rate={this.rate}
                doctors={this.state.doctors}
                favorite={this.state.favorite}
                isFavorite={this.isFavorite}
                heart={this.heart}
                currentUser={this.state.currentUser}
                {...routerProps}
                favorite={this.favorite}
              />
            )}
          />
          <Route
            exact
            path='/profile'
            render={(routerProps) => (
              <Profile
                patchUser={this.patchUser}
                currentUser={this.state.currentUser}
                doctors={this.state.doctors}
                isLoggedIn={this.state.isLoggedIn}
                {...routerProps}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
