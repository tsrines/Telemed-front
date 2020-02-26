import React from 'react'
import {
  Card,
  Icon,
  Image
} from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'



class DoctorCard extends React.Component {





  doctorShow = (id) => {
    let apiDoc = this.props.apiDoctors.find(doctor => doctor.uid === id)

    this.props.createDoctor(apiDoc)
    this.props.history.push(`/doctors/${id}`)
  }

  render() {

    let capitalGender
    console.log(this.props.gender)
    if (this.props.gender) {
      let gender = this.props.gender
      capitalGender = gender.charAt(0).toUpperCase() + gender.slice(1)
    } else {
      capitalGender = "Unknown"
    }

    return (
      <div>
        <Card onClick={() => this.doctorShow(this.props.id)}>
          <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
          <Card.Content>
            <Card.Header>{this.props.firstName} {this.props.lastName} {this.props.title}</Card.Header>
            <Card.Header> </Card.Header>
            <Card.Description>
              {this.props.specialty}
            </Card.Description>
            <Card.Meta>
              <span>{capitalGender}</span>
            </Card.Meta>



          </Card.Content>
          <Card.Content extra>
          <span></span>

          </Card.Content>
        </Card>

      </div>
    )
  }
}

export default withRouter(DoctorCard)