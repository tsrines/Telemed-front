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


  isFavorite = () => {
    
    
    let favoriteArray = this.props.currentUser.doctors.filter(doctor => doctor.api_id === this.props.match.params.id)
      
      

    if (favoriteArray.length > 0) {
      this.setState({
        favorite: 1
      })
    }
  
  }
  // let apiDoc = this.props.apiDoctors.find(doctor => doctor.uid === this.props.match.params.id)
  // if (Array.isArray(this.props.currentUser.userDoctors) && this.props.currentUser.userDoctors.length > 0) {
  //   let doctorArray = this.props.currentUser.userDoctors.filter(doctor => doctor.api_id === apiDoc.uid)

  //   if (doctorArray.length === 1) {
  //     this.setState({
  //       favorite: 1
  //     })
  //   }
  // }


  state = {
    favorite: 0,

  }

  favoriteHandler = () => {
    this.setState({
      favorite: 0
    })
  }

  favorite = () => {
    // this.setState({favorite: !this.state.favorite})
  }

  componentDidMount() {
    if (Array.isArray(this.props.currentUser.doctors)){
      this.isFavorite()
    }
  }

  rate = (e, data, apiDoc) => {
    this.setState({
      favorite: data.rating
    }, () => this.props.heart(apiDoc))
  }

  render() {


    let apiDoc = this.props.apiDoctors.find(doctor => doctor.uid === this.props.match.params.id)


    return (

      <div>
        <Grid columns={2} textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Row style={{ maxWidth: 450 }}>
            <Grid.Column>
              <Segment >
                <Header>{apiDoc.profile.first_name} {apiDoc.profile.last_name} {apiDoc.profile.title}</Header>
                <Divider />
                <Message>Phone Number: {apiDoc.practices[0].phones[0].number}</Message>
                <Rating onRate={(e,data) => this.rate(e, data, apiDoc)}  icon="heart" rating={this.state.favorite} maxRating={1}  size="huge" />
                {/* <Rating.Icon onClick={() => this.props.heart(apiDoc)}/> */}





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
    userDoctors: []
  }
};

export default DoctorShow