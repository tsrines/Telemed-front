import React from 'react';
import About from './About';
import Reviews from './Reviews';
import Photos from './Photos';
import { Label, Menu, Tab, Icon } from 'semantic-ui-react';

const ShowMenu = ({
  favorite,
  doctor,
  loadUser,
  reviews,
  photos,
  loading,
  loadingHandler,
  currentUser,
}) => {
  const panes = [
    {
      menuItem: { key: 'about', icon: 'user', content: 'About' },
      render: () => (
        <Tab.Pane>
          <About
            currentUser={currentUser}
            loadUser={loadUser}
            loading={loading}
            loadingHandler={loadingHandler}
            favorite={favorite}
            doctor={doctor}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key='reviews'>
          <Icon name='image' />
          Reviews
          <Label color='red' inverted='true'>
            {reviews && reviews.length}
          </Label>
        </Menu.Item>
      ),
      render: () => (
        <Tab.Pane>
          <Reviews reviews={reviews} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: (
        <Menu.Item key='photos'>
          <Icon name='image' />
          Photos
          <Label color='red' inverted='true'>
            {photos && photos.length}
          </Label>
        </Menu.Item>
      ),
      render: () => (
        <Tab.Pane>
          <Photos photos={photos} />
        </Tab.Pane>
      ),
    },
  ];
  return <Tab menu={{ color: 'red', inverted: true }} panes={panes} />;
};

export default ShowMenu;
