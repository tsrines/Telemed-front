import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';

const Landing = ({ history, currentUser, guestHandler, loading }) => {
  if (currentUser.id) return <Redirect to={'/profile'} />;
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <Header as='h1' color='red' textAlign='center'>
            Telemed
          </Header>
          <p className='lead'>
            Search for doctors, see how they are rated, save them for easy
            access
          </p>
          <div className='buttons'>
            <Button
              disabled={loading}
              color='red'
              onClick={() => history.push('/signup')}
              className='btn btn-primary'
            >
              Sign Up
            </Button>
            <Button
              disabled={loading}
              color='red'
              onClick={() => history.push('/login')}
              className='btn btn-light'
            >
              Login
            </Button>
          </div>
          <Button
            disabled={loading}
            style={{ marginTop: `15px` }}
            color='red'
            onClick={guestHandler}
            className='btn btn-light'
            loading={loading}
          >
            Guest
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Landing;
