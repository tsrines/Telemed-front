import React from 'react'
import { Grid, Rating, Header, Message, Button, Divider, Segment } from 'semantic-ui-react'



class DoctorShow extends React.Component {

  isFavorite = () => {


    let favoriteArray = this.props.currentUser.doctors.filter(doctor => doctor.id == this.props.match.params.id)
    if (favoriteArray.length > 0) {
      this.setState({
        favorite: 1
      })
    }

  }
  
  state = {
    favorite: 0
  }

  favoriteHandler = () => {
    this.setState({
      favorite: 0
    })
  }

  docCheck = () => {
    let doc
    if (this.props.doctors.length > 0) {
      doc = this.props.doctors.find(doctor => doctor.id == this.props.match.params.id)
      if (!!doc) {
        this.renderDocJsx(doc)
      }
    } else {
      doc = this.props.currentUser.doctors.find(doctor => doctor.id == this.props.match.params.id)
      if (!!doc) {
        this.renderDocJsx(doc)
      }
    }
  }


  componentDidMount() {
    if (Array.isArray(this.props.currentUser.doctors)) {
      this.isFavorite()
    }
  }

  rate = (e, data, doc) => {
    this.setState({
      favorite: data.rating
    }, () => this.props.heart(doc))
  }

  render() {
    let doc
    doc = this.props.currentUser.doctors.find(doctor => doctor.id == this.props.match.params.id)

    if (doc == undefined) {
      doc = this.props.doctors.find(doctor => doctor.id == this.props.match.params.id)

    }

    return (
      <div>
        <Grid columns={2} textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Row style={{ maxWidth: 750 }}>
            <Grid.Column>
              <Segment >
                <Header>{doc.first_name ? doc.first_name : doc.firstName} {doc.last_name ? doc.last_name : doc.lastName} {doc.title}</Header>
                <Divider />
                <Message>Phone Number: {doc.phone_number}</Message>                
                <Rating onRate={(e, data) => this.rate(e, data, doc)} icon="heart" rating={this.state.favorite} maxRating={1} size="huge" />
              </Segment >
            </Grid.Column>
            <Grid.Column>
              <Message>{doc.bio}</Message>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

// DoctorShow.defaultProps = {
//   currentUser: {
//     userDoctors: []
//   }
// };

export default DoctorShow