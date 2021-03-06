import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import DoctorShow from './components/doctorShow/DoctorShow';
import Doctors from './containers/Doctors';
import Profile from './components/profile/Profile';
import Search from './components/Search';
import './App.css';
import {
  fetchApiDoctors,
  createReviews,
  createPhotos,
} from './helpers/helpers';
import axios from 'axios';
import Landing from './components/layout/Landing';
import SignUp from './components/SignUp';
import Login from './components/Login';
import NavBar from './components/layout/NavBar';
import { Container } from 'semantic-ui-react';
import Edit from './components/profile/Edit';
import SearchIndex from './containers/SearchIndex';

import { backendUrl } from './helpers/constants';

class App extends React.Component {
  state = {
    loading: true,
    favorites: [],
    currentUser: {},
    lat: 0,
    lng: 0,
    doctors: [],
    searchIndex: [],
    doctorShow: {},
    errors: [],
  };

  guestHandler = (e) => {
    this.login({ email: `guest@guest.com`, password: `123123` });
  };

  editProfileOnChange = (e) => {
    this.setState({
      ...this.state,
      currentUser: {
        ...this.state.currentUser,
        [e.target.name]: e.target.value,
      },
    });
  };

  editProfileOnSubmit = async (e) => {
    this.loadingHandler(true);
    e.preventDefault();
    const { email, address, first_name, last_name } = this.state.currentUser;
    const payload = {
      email,
      address,
      first_name,
      last_name,
    };
    await this.patchUser(payload);
    this.loadingHandler(false);
  };

  saveSearch = async (searchedDoctors) => {
    let user_id = this.state.currentUser.id;
    let ids = [];
    let data;
    searchedDoctors.forEach((doc) => ids.push(doc.id));
    let csv = ids.join(',');
    const payload = {
      csv,
      user_id,
    };
    try {
      let res = await axios.post(`${backendUrl}/searches`, payload);
      data = res.data;
    } catch (error) {}
    this.loadingHandler(false);
    this.props.history.push(`/search/${payload.user_id}/${data.id}`);
  };

  setSearchIndex = (searchIndex) => {
    this.setState({ searchIndex });
  };

  googleSearch = async (payload) => {
    this.loadingHandler(true);
    const apidocs = await fetchApiDoctors(payload);

    await apidocs.forEach(async (doc) => {
      let reviews = await createReviews(doc.place_id, doc.id);
      if (reviews) {
        doc.reviews = reviews;
      }
    });
    await apidocs.map(async (doc) => {
      let photos = await createPhotos(doc.place_id, doc.id);
      if (photos) {
        doc.photos = photos;
      }
    });
    this.saveSearch(apidocs);
  };

  loadingHandler = (bool) => {
    this.setState({ loading: bool });
  };

  patchUser = async (formData) => {
    try {
      let res = await axios.patch(
        `${backendUrl}/users/${this.state.currentUser.id}`,
        formData
      );

      if (res.data.errors) {
        console.error(res.data.errors);
      } else {
        let currentUser = res.data;
        this.setState({ currentUser }, () => this.loadingHandler(false));
      }
    } catch (err) {
      console.error(err);
    }
  };
  getDoctorById = async (id) => {
    try {
      let res = await axios.get(`${backendUrl}/doctors/${id}`);

      let doctorShow = res.data;
      this.setState({ doctorShow }, () => this.loadingHandler(false));
    } catch (err) {
      console.error(err);
    }
  };

  getDoctors = async () => {
    try {
      let res = await axios.get(`${backendUrl}/doctors`);
      this.setState({ doctors: res.data }, () => {
        this.loadingHandler(false);
      });
    } catch (error) {
      console.error(error);
    }
  };
  loadUser = async () => {
    const token = localStorage.token;
    if (token) {
      try {
        let res = await axios.get(`${backendUrl}/auto_login`, {
          headers: { Authorization: token },
        });
        if (res.data.errors) {
          this.setState({ errors: res.data.errors, currentUser: {} });
        } else {
          this.setState({ currentUser: res.data });
        }
      } catch (err) {
        console.error(err);
      }
    }
    this.loadingHandler(false);
  };

  getFavorites = async () => {
    try {
      let res = await axios.get(`${backendUrl}/favorites`);
      const favorites = res.data;
      this.setState({ favorites });
    } catch (err) {
    }
  };
  async componentDidMount() {
    await this.loadUser();
    await this.getFavorites();
  }

  login = async (formData) => {
    this.loadingHandler(true);
    try {
      let { data } = await axios.post(`${backendUrl}/login`, formData);

      if (data.error) {
        alert(data.error);
      } else {
        this.setUser(data);
      }
    } catch (err) {
      console.error(err);
    }
    this.loadingHandler(false);
  };
  signUp = async (formData) => {
    try {
      let res = await axios.post(`${backendUrl}/users`, formData);
      if (res.errors) {
        alert(res.errors);
      } else {
        let currentUser = res.data;
        this.setUser(currentUser);
      }
    } catch (err) {
      alert(err);
    }
    this.loadingHandler(false);
  };
  setUser = (currentUser) => {
    this.loadingHandler(true);
    this.setState(
      {
        currentUser: currentUser.user,
      },
      () => {
        localStorage.token = currentUser.token;
        this.loadUser().then((data) => this.loadingHandler(false));
        this.props.history.push('/search');
      }
    );
  };

  logout = () => {
    this.setState(
      {
        currentUser: {},
      },
      () => {
        localStorage.removeItem('token');
        this.props.history.push('/');
      }
    );
  };

  render() {
    return (
      <>
        <Switch>
          <Route
            exact
            path='/'
            render={(routerProps) => (
              <Landing
                {...routerProps}
                guestHandler={this.guestHandler}
                currentUser={this.state.currentUser}
                loading={this.state.loading}
              />
            )}
          />
          <Route
            exact
            path='/signup'
            render={(routerProps) => (
              <SignUp
                loadingHandler={this.loadingHandler}
                loading={this.state.loading}
                {...routerProps}
                setUser={this.setUser}
                signUp={this.signUp}
              />
            )}
          />

          <Route
            exact
            path='/login'
            render={(routerProps) => (
              <Login
                loadingHandler={this.loadingHandler}
                loading={this.state.loading}
                {...routerProps}
                setUser={this.setUser}
                login={this.login}
              />
            )}
          />
          <>
            <Container>
              {this.state.currentUser && this.state.currentUser.id && (
                <NavBar
                  signUp={this.signUp}
                  logout={this.logout}
                  loading={this.state.loading}
                  loadingHandler={this.loadingHandler}
                  currentUser={this.state.currentUser}
                />
              )}
              <Route
                exact
                path='/doctors'
                render={(routerProps) => (
                  <Doctors
                    loadUser={this.loadUser}
                    loadingHandler={this.loadingHandler}
                    getDoctorById={this.getDoctorById}
                    currentUser={this.state.currentUser}
                    loading={this.state.loading}
                    getDoctors={this.getDoctors}
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
                    loadingHandler={this.loadingHandler}
                    error={this.state.error}
                    loading={this.state.loading}
                    currentUser={this.state.currentUser}
                    {...routerProps}
                    googleSearch={this.googleSearch}
                    favorite={this.favorite}
                  />
                )}
              />
              <Route
                exact
                path='/search/:userId/:searchId'
                render={(routerProps) => (
                  <SearchIndex
                    loadingHandler={this.loadingHandler}
                    setSearchIndex={this.setSearchIndex}
                    searchIndex={this.state.searchIndex}
                    loadUser={this.loadUser}
                    currentUser={this.state.currentUser}
                    loading={this.state.loading}
                    {...routerProps}
                  />
                )}
              />

              <Route
                exact
                path='/doctors/:id'
                render={(routerProps) => (
                  <DoctorShow
                    favorites={this.state.favorites}
                    loadUser={this.loadUser}
                    loadingHandler={this.loadingHandler}
                    loading={this.state.loading}
                    getDoctorById={this.getDoctorById}
                    doctors={this.state.doctors}
                    isFavorite={this.isFavorite}
                    currentUser={this.state.currentUser}
                    {...routerProps}
                    doctorShow={this.state.doctorShow}
                  />
                )}
              />
              <Route
                exact
                path='/profile'
                render={(routerProps) => (
                  <Profile
                    loading={this.state.loading}
                    loadingHandler={this.loadingHandler}
                    currentUser={this.state.currentUser}
                    doctors={this.state.doctors}
                    loadUser={this.loadUser}
                    {...routerProps}
                  />
                )}
              />
              <Route
                exact
                path='/profile/edit'
                render={(routerProps) => (
                  <Edit
                    editProfileOnChange={this.editProfileOnChange}
                    editProfileOnSubmit={this.editProfileOnSubmit}
                    loading={this.state.loading}
                    loadingHandler={this.loadingHandler}
                    patchUser={this.patchUser}
                    currentUser={this.state.currentUser}
                    loadUser={this.loadUser}
                    {...routerProps}
                  />
                )}
              />
            </Container>
          </>
        </Switch>
      </>
    );
  }
}

export default withRouter(App);
