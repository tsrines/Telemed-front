import React from 'react'
import {
  Card,
  Icon,
  Image
} from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'



class ProfileDoc extends React.Component {





  doctorShow = (id) => {
    // let apiDoc = this.props.apiDoctors.find(doctor => doctor.uid === id)


    this.props.history.push(`/doctors/${id}`)
  }

  render() {

    let capitalGender

    if (this.props.gender) {
      let gender = this.props.gender
      capitalGender = gender.charAt(0).toUpperCase() + gender.slice(1)
    } else {
      capitalGender = "Unknown"
    }
    console.log(this.props)
    return (
      <div>
        <Card onClick={() => this.doctorShow(this.props.api_id)}>
          <Image src={this.props.image} wrapped ui={false} />
          <Card.Content>
            <Card.Header>{this.props.first_name} {this.props.last_name} {this.props.title}</Card.Header>
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

export default withRouter(ProfileDoc)