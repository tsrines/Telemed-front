import React from 'react'
import {
  Input,
  Form,
  Card
} from 'semantic-ui-react'
import DoctorCard from '../components/DoctorCard'

class Doctors extends React.Component {

  state = {
    address: "",
    ailment: "",
    miles: ""

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

    let displayDoctors = this.props.doctors.map(doctor => <DoctorCard apiDoctors={this.props.apiDoctors} key={doctor.id} {...doctor} />)
    return (
      <div>
        <Form onSubmit={this.onSubmit}>
          <Input name="address" onChange={(e) => this.onChange(e)} type="text" placeholder="Address" value={this.state.address}></Input>
          <Input name="ailment" onChange={(e) => this.onChange(e)} type="text" placeholder="Ailment?" value={this.state.ailment}></Input>
          <Input name="miles" onChange={(e) => this.onChange(e)} type="number" placeholder="Miles?" value={this.state.miles}></Input>
          <Input type="submit" value="Get Doctors" />
        </Form>
        <br></br>
        <Card.Group itemsPerRow={4}>
          {displayDoctors}
        </Card.Group>
      </div>

    )
  }
}

export default Doctors