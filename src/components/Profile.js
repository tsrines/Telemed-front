import React from 'react'
import {
  Header,
  Divider,
  Button,
  Container,
  Form,
  Input,
  Grid,
  Card
} from 'semantic-ui-react'
import DoctorCard from './DoctorCard'


class Profile extends React.Component {
  state = {
    email: this.props.currentUser.email,
    password: this.props.currentUser.password,
    passwordConfirmation: this.props.currentUser.passwordConfirmation,
    firstName: this.props.currentUser.firstName,
    lastName: this.props.currentUser.lastName,
    address: this.props.currentUser.address
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    }, () => console.log(this.state))
  }

  submitEdit = () => {
    let userData = this.state
    this.props.patchUser(userData)
    this.props.history.push('/search')
    alert("Profile has been updated!")
  }

  render() {
    let profileDoctors = this.props.currentUser.doctors.map(doctor => <DoctorCard key={doctor.id} {...doctor} />)
    return (
      <div>
        <Grid columns={2}>
          <Grid.Column>
            <Container textAlign='center'>
              <Header>{this.props.currentUser.email}</Header>
              <Divider />
              <Form >
                <Input placeholder="Email" name="email" type="text" value={this.state.email} onChange={(e) => this.onChange(e)}></Input>
              </Form>
              <Form>
                <Input placeholder="Password" name="password" type="password" value={this.state.password} onChange={(e) => this.onChange(e)}></Input>
              </Form>
              <Form>
                <Input placeholder="Password Confirmation" name="passwordConfirmation" type="password" value={this.state.passwordConfirmation || ""} onChange={(e) => this.onChange(e)}></Input>
              </Form>
              <Form>
                <Input placeholder="First Name" name="firstName" type="text" value={this.state.firstName || ""} onChange={(e) => this.onChange(e)}></Input>
              </Form>
              <Form>
                <Input placeholder="Last Name" name="lastName" type="text" value={this.state.lastName || ""} onChange={(e) => this.onChange(e)}></Input>
              </Form>
              <Form>
                <Input placeholder="Address" name="address" type="text" value={this.state.address || ""} onChange={(e) => this.onChange(e)}></Input>
              </Form>
              <Form>
                <Button color='red' onClick={this.submitEdit}>Submit</Button>
              </Form>
            </Container >
          </Grid.Column>
          <Grid.Column >

              <Header display='flex' textAlign="center" color="red">Favorite Doctors</Header>
            <Card.Group style={{ overflow: 'auto', maxHeight: '52em' }} display='flex' justify-content='center' itemsPerRow={2}>
            {profileDoctors}
              </Card.Group> 
          </Grid.Column>

        </Grid>



      </div>
    )
  }
}
export default Profile