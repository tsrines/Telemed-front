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
    address: this.props.currentUser.address,
    isDisabled: true
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  submitEdit = () => {
    let userData = this.state
    this.props.patchUser(userData)
    this.setState({
      isDisabled: true
    })
    this.props.history.push('/search')
    alert("Profile has been updated!")
  }

  edit = () => {
    this.setState({
      isDisabled: !this.state.isDisabled
    })
  }

  render() {
    let profileDoctors = this.props.currentUser.doctors.map(doctor => <DoctorCard key={doctor.id} {...doctor} />)
    return (
      <div>
        <Grid columns={2}>
          <Grid.Column>
            <Container textAlign='center'>
              <Header as='h2' display='flex' textAlign="center" color="red">User Profile</Header>
              <Divider />
              <Form width={6}>
                {this.state.isDisabled ? <Input disabled placeholder="Email" name="email" type="text" value={this.state.email} onChange={(e) => this.onChange(e)}></Input>
                  : <Input placeholder="Email" name="email" type="text" value={this.state.email} onChange={(e) => this.onChange(e)}></Input>}
              </Form>
              <Form>
                {this.state.isDisabled ? <Input disabled placeholder="Password" name="password" type="password" value={this.state.password} onChange={(e) => this.onChange(e)}></Input>
                  : <Input placeholder="Password" name="password" type="password" value={this.state.password} onChange={(e) => this.onChange(e)}></Input>}
              </Form>
              <Form>
                {this.state.isDisabled ? <Input disabled placeholder="Password Confirmation" name="passwordConfirmation" type="password" value={this.state.passwordConfirmation || ""} onChange={(e) => this.onChange(e)}></Input>
                  : <Input placeholder="Password Confirmation" name="passwordConfirmation" type="password" value={this.state.passwordConfirmation || ""} onChange={(e) => this.onChange(e)}></Input>}
              </Form>
              <Form>
                {this.state.isDisabled ? <Input disabled placeholder="First Name" name="firstName" type="text" value={this.state.firstName || ""} onChange={(e) => this.onChange(e)}></Input>
                  : <Input placeholder="First Name" name="firstName" type="text" value={this.state.firstName || ""} onChange={(e) => this.onChange(e)}></Input>}
              </Form>
              <Form>
                {this.state.isDisabled ? <Input disabled placeholder="Last Name" name="lastName" type="text" value={this.state.lastName || ""} onChange={(e) => this.onChange(e)}></Input>
                  : <Input placeholder="Last Name" name="lastName" type="text" value={this.state.lastName || ""} onChange={(e) => this.onChange(e)}></Input>}
              </Form>
              <Form>
                {this.state.isDisabled ? <Input disabled placeholder="Address" name="address" type="text" value={this.state.address || ""} onChange={(e) => this.onChange(e)}></Input>
                  : <Input placeholder="Address" name="address" type="text" value={this.state.address || ""} onChange={(e) => this.onChange(e)}></Input>}
              </Form>
              <Form>
                {this.state.isDisabled ? <Button disabled color='red' onClick={this.submitEdit}>Submit</Button>
                  : <Button color='red' onClick={this.submitEdit}>Submit</Button>}
                {this.state.isDisabled ? <Button color='red' onClick={this.edit}>Edit</Button>
                  : <Button color='black' onClick={this.edit}>Nevermind</Button>}

              </Form>
            </Container >
          </Grid.Column>
          {this.props.currentUser.doctors.length > 0 && <Grid.Column >
            <Header as='h2' display='flex' textAlign="center" color="red">Favorite Doctors</Header>
            <Divider />
            <Card.Group style={{ overflow: 'auto', maxHeight: '52em' }} display='flex' justify-content='center' itemsPerRow={2}>
              {profileDoctors}
            </Card.Group>
          </Grid.Column>}

        </Grid>



      </div>
    )
  }
}
export default Profile