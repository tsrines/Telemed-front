import React from 'react'
import {
  Input,
  Form,
  Card,
  Button,
  Grid
} from 'semantic-ui-react'
import DoctorCard from '../components/DoctorCard'
import { withRouter } from 'react-router-dom'

class Doctors extends React.Component {

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
    let displayDoctors = this.props.doctors.map(doctor => <DoctorCard createDoctor={this.props.createDoctor} doctors={this.props.doctors} key={doctor.id} {...doctor} />)
    return (
      <div>
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <br></br>
          <br></br>
          <br></br>
          <Card.Group itemsPerRow={6}>
            {displayDoctors}
          </Card.Group>
        </Grid>
      </div>
    )
  }
}

export default withRouter(Doctors)