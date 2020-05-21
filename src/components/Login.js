import React from 'react'
import { Button, Form, Grid, Header, Image, Segment, Divider } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'



class LoginForm extends React.Component {

  state = {
    email: "",
    password: "",
    passwordConfirmation: ""
  }
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  formData = () => {
    let formData = this.state
    this.props.onSubmit(formData)
    this.setState({
      email: "",
      password: "",
      passwordConfirmation: ""
    })
  }


  render() {
    return (
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='red' textAlign='center'>
            Telemed 
            <Image src='../favicon.ico' />
          </Header>
          <br />
          <br />
          <Form size='large'>
            <Segment stacked>
              <Form.Input
                onChange={(e) => this.onChange(e)}
                name="email"
                value={this.state.email}
                fluid icon='user'
                iconPosition='left'
                placeholder='E-mail address' />
              <Form.Input
                onChange={(e) => this.onChange(e)}
                name="password"
                value={this.state.password}
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
              />
              {this.props.register &&
                <Form.Input
                  onChange={(e) => this.onChange(e)}
                  name="passwordConfirmation"
                  value={this.state.passwordConfirmation}
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password Confirmation'
                  type='password'
                />}
              {this.props.register && <Button.Group>
                <Button onClick={this.props.onSignUp}>Cancel</Button>
                <Button.Or />
                <Button onClick={this.formData} color='red' fluid size='large'>Sign Up!</Button>
              </Button.Group>}
              {!this.props.register && <Button onClick={this.formData} color='red' fluid size='large'>
                {this.props.register ? "Sign Up" : "Login"}
              </Button>}
            </Segment>
          </Form>
          {!this.props.register &&
            <Button onClick={this.props.onSignUp} label="Sign Up?" />}
        </Grid.Column>
      </Grid>
    )
  }
}


export default withRouter(LoginForm)