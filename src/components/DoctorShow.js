import React from 'react'
import { Container, Header, Card, Button, Divider, Icon, Image } from 'semantic-ui-react'



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

  render() {

    let apiDoc = this.props.apiDoctors.find(doctor => doctor.uid === this.props.match.params.id)

    return (
      <div>
        <Container textAlign='center'>
          <Header>{apiDoc.profile.first_name} {apiDoc.profile.last_name} {apiDoc.profile.title}</Header>
          <Divider />
          <Button onClick={() => this.props.history.push('/video')} primary>Video Call</Button>
          <Card.Description>{apiDoc.profile.bio}</Card.Description>
        </Container>
      </div>
    )
  }
}

export default DoctorShow