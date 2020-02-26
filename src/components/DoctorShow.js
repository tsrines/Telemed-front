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

  render() {

    let apiDoc = this.props.apiDoctors.find(doctor => doctor.uid === this.props.match.params.id)
    console.log(apiDoc)
    return (
      <div>
        <Grid columns={2} textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Row style={{ maxWidth: 450 }}>
            <Grid.Column>
              <Segment >
                <Header>{apiDoc.profile.first_name} {apiDoc.profile.last_name} {apiDoc.profile.title}</Header>
                <Divider />
                <Message>Phone Number: {apiDoc.practices[0].phones[0].number}</Message>
                <Rating onClick={() => this.props.favorite(apiDoc)}/>
                <Button onClick={() => this.props.history.push('/video')} color="red">Video Call</Button>

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

export default DoctorShow