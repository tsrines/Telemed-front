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


    let favoriteArray = this.props.currentUser.doctors.filter(doctor => doctor.id == this.props.match.params.id)
    if (favoriteArray.length > 0) {
      this.setState({
        favorite: 1
      })
    }
    // debugger
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
    console.log("doc after currentUser find:", doc)
    if (doc == undefined) {
      doc = this.props.doctors.find(doctor => doctor.id == this.props.match.params.id)
      console.log("doc after doctor find:", doc)
    } 
    // if (doc === undefined){
      // console.log("before push", doc)

      // this.props.history.push('/profile')
      // debugger
    // }

  


    // console.log("this.props.doctors ", this.props.doctors)
    // console.log("this.props.match ", this.props.match)
    // console.log("this.props.match.params.id: ", this.props.match.params.id)
    // console.log("doc: ", doc)

    // console.log("this.props.currentUser", this.props.currentUser)
    // debugger




    return (
      // <div>Hello</div>

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