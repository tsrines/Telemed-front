import React from 'react'
import { Grid, Rating, Header, Message, Button, Divider, Segment } from 'semantic-ui-react'



class DoctorShow extends React.Component {

  // sendEmail = () => {

  //   emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', e.target, 'YOUR_USER_ID')
  //     .then((result) => {
  //       console.log(result.text);
  //     }, (error) => {
  //       console.log(error.text)
  //       this.props.history.push('/video');
  //     });
  // }

  // go over all of user favorites
  // if there is a favorite containing this doctor, return true
  // otherwise false
  isFavorite = () => {

    let apiDoc = this.props.apiDoctors.find(doctor => doctor.uid === this.props.match.params.id)
    if (Array.isArray(this.props.currentUser.favoriteDoctors) && this.props.currentUser.favoriteDoctors.length > 0) {
      let doctorArray = this.props.currentUser.favoriteDoctors.filter(doctor => doctor.api_id === apiDoc.uid)
      // debugger
      if (doctorArray.length === 1) {
        this.setState({
          favorite: true
        })
      }
    }
  }

  state = {
    favorite: false
  }

  favorite = () => {
    // this.setState({favorite: !this.state.favorite})
  }

  componentDidMount() {
    this.isFavorite()
  }

  render() {
    console.log('Should be true', this.state.favorite);

    let apiDoc = this.props.apiDoctors.find(doctor => doctor.uid === this.props.match.params.id)
    console.log(this.state)
    console.log('PROPS', this.props.currentUser)
    return (

      <div>
        <Grid columns={2} textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Row style={{ maxWidth: 450 }}>
            <Grid.Column>
              <Segment >
                <Header>{apiDoc.profile.first_name} {apiDoc.profile.last_name} {apiDoc.profile.title}</Header>
                <Divider />
                <Message>Phone Number: {apiDoc.practices[0].phones[0].number}</Message>
                <Rating active={true} selected={true} size ="huge" icon='heart' >
                  <Rating.Icon active={true} selected={this.state.favorite} onClick={() => this.props.favorite(apiDoc)}></Rating.Icon>
                </Rating>
                {/* <Button onClick={() => this.props.history.push('/video')} color="red">Video Call</Button> */}

              </Segment >
            </Grid.Column>
            <Grid.Column>
              <Message>{apiDoc.profile.bio}</Message>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

DoctorShow.defaultProps = {
  currentUser: {
    favoriteDoctors: []
  }
};

export default DoctorShow