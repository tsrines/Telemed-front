import React from 'react'
import { Form, Header, Input, Image, Button, Grid } from 'semantic-ui-react'

class Search extends React.Component {

  state = {
    address: "",
    ailment: "",
    miles: "",

  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmit = (e) => {
    const formData = this.state
    e.preventDefault()
    this.props.toGeoCode(formData)
  }


  render() {
    return (
      <div>

        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 900 }}>
            <Header as='h2' color='red' textAlign='center'>
              <Image src='../favicon.ico' />
              Telemed
            </Header>
            <Form onSubmit={this.onSubmit}>
              <Input required name="address" onChange={(e) => this.onChange(e)} type="text" placeholder="Address" value={this.state.address}></Input>
              <Input required name="ailment" onChange={(e) => this.onChange(e)} type="text" placeholder="What hurts?" value={this.state.ailment}></Input>
              <Input required name="miles" onChange={(e) => this.onChange(e)} type="number" placeholder="Miles?" value={this.state.miles}></Input>
              <Button color="red" type="submit" value="Get Doctors">Get Doctors</Button>
            </Form>
          </Grid.Column >
        </Grid>

      </div>

    )
  }
}

export default Search 