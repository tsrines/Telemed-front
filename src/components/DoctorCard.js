import React from 'react'
import {
  Card,
  Icon,
  Image
} from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'



class DoctorCard extends React.Component {





  doctorShow = (id) => {
    this.props.history.push(`/doctors/${id}`)
  }

  render() {

    return (
      <div>
        <Card onClick={() => this.doctorShow(this.props.id)}>
          <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
          <Card.Content>
            <Card.Header>{this.props.firstName} </Card.Header>
            <Card.Header>{this.props.lastName} </Card.Header>
            {/* <Card.Meta>
              <span className='date'>Joined in 2015</span>
            </Card.Meta> */}
            <Card.Description>
              {this.props.specialty}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>

            <Icon name='user' />

          </Card.Content>
        </Card>

      </div>
    )
  }
}

export default withRouter(DoctorCard)