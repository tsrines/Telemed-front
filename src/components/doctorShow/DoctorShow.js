import React from 'react';
import { Divider, Image, Container } from 'semantic-ui-react';
import ShowMenu from './ShowMenu';

class DoctorShow extends React.Component {
  state = {
    favorite: 0,
  };

  isFavorite = () => {
    debugger;
    const favorite = this.props.currentUser.doctors.find(
      (doc) => doc.id === parseInt(this.props.match.params.id)
    );

    if (favorite) this.setState({ favorite: 1 });
    else this.setState({ favorite: 0 });
  };

  async componentDidMount() {
    this.props.loadingHandler(true);

    await this.props.getDoctorById(parseInt(this.props.match.params.id));
    await this.props.loadUser();
    this.props.loadingHandler(false);
  }

  render() {
    const { reviews, photos, photo } = this.props.doctorShow;
    return (
      <Container style={{ padding: '3em' }}>
        <Image centered size='large' src={photo && photo} />
        <Divider hidden />
        <ShowMenu
          loadUser={this.props.loadUser}
          loadingHandler={this.props.loadingHandler}
          loading={this.props.loading}
          favorite={this.state.favorite}
          currentUser={this.props.currentUser}
          doctor={this.props.doctorShow}
          reviews={reviews}
          photos={photos}
        />
      </Container>
    );
  }
}

export default DoctorShow;
