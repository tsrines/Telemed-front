import React from 'react'
import { Grid, Rating, Header, Message, Button, Divider, Segment } from 'semantic-ui-react'





class ProfileShowCard extends React.Component {




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
    console.log("this.props from ProfileShowCard", this.props)





    return (

      <div>
        <Grid columns={2} textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Row style={{ maxWidth: 450 }}>
            <Grid.Column>
              <Segment >
                <Header>{this.props.first_name} {this.props.last_name} {this.props.title}</Header>
                <Divider />
                <Message>Phone Number: {this.props.phone_number}</Message>
                <Rating onRate={(e, data) => this.rate(e, data, )} icon="heart" rating={this.state.favorite} maxRating={1} size="huge" />
              </Segment >
            </Grid.Column>
            <Grid.Column>
              <Message>{this.props.bio}</Message>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default ProfileShowCard
