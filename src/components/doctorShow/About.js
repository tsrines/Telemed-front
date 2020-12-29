import React, { useEffect, useState } from 'react';
import { Rating, Header, Message, Divider, Segment } from 'semantic-ui-react';
import { useParams } from 'react-router';
import axios from 'axios';
import { backendUrl } from '../../helpers/constants';

const About = ({
  doctor: {
    name,
    formatted_phone_number,
    formatted_address,
    rating,
    url,
    website,
  },

  loading,
  loadUser,
  currentUser,
}) => {
  const { id: doctorId } = useParams();
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const favoriteHandler = () => {
      if (currentUser !== undefined) {
        if (currentUser.favorites) {
          currentUser.favorites.forEach((fav) => {
            if (fav.doctor_id === parseInt(doctorId)) {
              setIsFavorite(1);
              setFavoriteId(fav.id);
            }
          });
        }
      }
    };
    favoriteHandler();
  }, [currentUser.favorites, doctorId, currentUser]);

  const [isFavorite, setIsFavorite] = useState(0);
  const [favoriteId, setFavoriteId] = useState(null);

  const deleteFavorite = async () => {
    try {
      await axios.delete(`${backendUrl}/favorites/${favoriteId}`);
    } catch (err) {
      console.error('error', err);
    }
  };

  const postFavorite = async () => {
    const favoriteObject = {
      doctor_id: doctorId,
      user_id: currentUser.id,
    };
    try {
      let { data } = await axios.post(
        `${backendUrl}/favorites`,
        favoriteObject
      );
      setFavoriteId(data.id);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const rate = async () => {
    if (isFavorite) {
      await deleteFavorite();
      setIsFavorite(0);
    } else {
      await postFavorite();
      setIsFavorite(1);
    }
  };

  return (
    <Segment textAlign='center'>
      <Header
        as='a'
        href={website}
        rel='noopener noreferrer'
        target='_blank'
        content={name}
      />

      <Rating
        disabled={loading}
        loading={loading.toString()}
        onRate={(e, data) => rate(e, data)}
        icon='heart'
        rating={isFavorite}
        maxRating={1}
        size='massive'
      />
      <Divider hidden />
      <Message
        content={
          <a rel='noopener noreferrer' href={`tel:${formatted_phone_number}`}>
            {formatted_phone_number}
          </a>
        }
      ></Message>
      <Message>
        <a href={url} rel='noopener noreferrer' target='_blank'>
          {formatted_address}
        </a>
      </Message>

      {rating && (
        <Message>
          <Header as='h3'>Average Rating: </Header>
          {
            <Rating
              disabled
              size='large'
              icon='star'
              maxRating={5}
              rating={rating}
            />
          }
        </Message>
      )}
    </Segment>
  );
};

export default About;
