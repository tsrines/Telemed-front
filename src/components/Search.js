import React from 'react';
import {
  Form,
  Header,
  Image,
  Button,
  Grid,
  Label,
  Input,
} from 'semantic-ui-react';
import axios from 'axios';

class Search extends React.Component {
  state = {
    address: '',
    query: '',
    distance: '',
    browserLocation: false,
    lat: null,
    lng: null,
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    this.props.loadingHandler(true);
    const payload = { ...this.state };
    const { query, address } = this.state;
    if (!this.state.browserLocation) {
      try {
        let { data } = await axios.get(
          `https://cryptic-island-45793.herokuapp.com/geocodes/coords?address=${address}`
        );
        payload.lat = data.lat;
        payload.lng = data.lng;
        payload.query = query;
        await this.props.googleSearch(payload);
      } catch (err) {
        console.error(err);
      }
    } else {
      payload.query = query;
      await this.props.googleSearch(payload);
    }
    // this.props.loadingHandler(false);
  };
  componentDidMount() {
    const browserLocation = localStorage.getItem('browserLocationEnabled');
    if (browserLocation) {
      const [lat, lng] = browserLocation.split(',');

      this.setState({ ...this.state, browserLocation: true, lat, lng });
    } else {
      this.setState({
        ...this.state,
        browserLocation: false,
        lat: null,
        lng: null,
      });
    }
  }

  toggleUseCurrentPosition = async (e) => {
    if (!this.state.browserLocation) {
      this.setState({ ...this.state, browserLocation: true });
      const geo = navigator.geolocation;
      if (!geo) {
        console.error('Geo not supported');
      } else {
        geo.getCurrentPosition(({ coords: { latitude, longitude } }) => {
          localStorage.setItem(
            'browserLocationEnabled',
            `${latitude.toString()},${longitude.toString()}`
          );
          this.setState({
            ...this.state,
            lat: latitude.toString(),
            lng: longitude.toString(),
          });
        });
      }
    } else {
      localStorage.removeItem('browserLocationEnabled');
      this.setState({
        ...this.state,
        browserLocation: false,
        lat: null,
        lng: null,
      });
    }
  };

  render() {
    return (
      <div>
        <Grid
          textAlign='center'
          style={{ height: '100vh' }}
          verticalAlign='middle'
        >
          <Grid.Column style={{ maxWidth: 900 }}>
            <Header as='h2' color='red' textAlign='center'>
              <Image src='../favicon.ico' />
              Telemed
            </Header>

            <Form onSubmit={this.onSubmit}>
              <>
                <Form.Field>
                  <div
                    style={{
                      marginBottom: `15px`,
                      display: `flex`,
                      flexDirection: `row`,
                      justifyContent: `center`,
                    }}
                  >
                    <Label>Use current location</Label>
                    <Form.Checkbox
                      style={{ marginLeft: `15px` }}
                      toggle
                      onChange={(e) => this.toggleUseCurrentPosition(e)}
                      type='checkbox'
                      checked={this.state.browserLocation}
                    />
                  </div>

                  {!this.state.browserLocation && (
                    <Input
                      fluid
                      name='address'
                      onChange={(e) => this.onChange(e)}
                      type='text'
                      placeholder='Address'
                      value={this.state.address}
                    />
                  )}
                </Form.Field>
                <Form.Field>
                  <Label>What kind of doctor do you need to see?</Label>
                  <Input
                    fluid
                    required
                    name='query'
                    onChange={(e) => this.onChange(e)}
                    type='text'
                    placeholder='...foot, heart, etc'
                    value={this.state.query}
                  />
                </Form.Field>
                <Form.Field>
                  <Label>How far are you willing to travel?</Label>
                  <Input
                    fluid
                    // label={'Travel Distance'}
                    required
                    name='distance'
                    onChange={(e) => this.onChange(e)}
                    type='number'
                    placeholder='...in miles'
                    value={this.state.distance}
                  />
                </Form.Field>
                <Button loading={this.props.loading} color='red' type='submit'>
                  Get Doctors
                </Button>
              </>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Search;
