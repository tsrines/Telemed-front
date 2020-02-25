import React from 'react'
import {
  Header,
  Divider,
  Button,
  Container,
  Form,
  Input
} from 'semantic-ui-react'

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
    this.props.history.push('/')
    alert("Profile has been updated!")
  }

  render() {
    console.log(this.props.currentUser)
    return (
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
        {/* <Form>
          <Form.Group>
            <Form.Input name="email" type="text" value={this.state.email} onChange={(e) => this.onChange(e)}>Email</Form.Input>
          </Form.Group>
        </Form> */}


      </Container >
    )
  }
}
export default Profile