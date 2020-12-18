import { Card, Grid } from 'semantic-ui-react';
import DoctorCard from '../components/DoctorCard';
import Axios from 'axios';

import React, { Component } from 'react';

export default class SearchIndex extends Component {
  loadSearchIndex = async () => {
    // this.props.loadUser();
    const index = [];
    // debugger;
    const searchId = parseInt(this.props.match.params.searchId);

    const searches = this.props.currentUser.searches;
    try {
      let csv = searches.find((search) => searchId === search.id).csv;
      csv = csv.split(',');

      await csv.map(async (id) => {
        // console.log(id);
        let doctorId = parseInt(id);
        let res = await Axios.get(`http://localhost:3000/doctors/${doctorId}`);
        let doc = res.data;

        // console.log(doc);
        index.push(doc);

        this.props.setSearchIndex(index);
      });
    } catch (err) {
      alert('Something went wrong, please search again');
      this.props.history.push('/search');
      console.log(err);
      throw err;
    }
  };

  displayDoctors = () => {
    // this.props.loadingHandler(false)
    let sortedIndex = [...this.props.searchIndex].sort((a, b) => a.id - b.id);
    return sortedIndex.map((doctor) => (
      <DoctorCard
        currentUser={this.props.currentUser}
        getDoctorById={this.props.getDoctorById}
        key={doctor.id}
        doctor={doctor}
      />
    ));
  };

  async componentDidMount() {
    await this.props.loadUser();
    await this.loadSearchIndex();
  }
  render() {
    return (
      <div>
        {' '}
        <Grid
          container
          textAlign='center'
          style={{ height: '100vh' }}
          verticalAlign='middle'
        >
          <Card.Group
            style={{ maxHeight: '35em', padding: '3em' }}
            display='flex'
            justify-content='center'
            itemsPerRow={3}
          >
            {this.displayDoctors()}
          </Card.Group>
        </Grid>
      </div>
    );
  }
}
