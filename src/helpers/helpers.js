import axios from 'axios';
import { backendUrl } from './constants';

export const fetchApiDoctors = async (payload) => {
  try {
    let res = await axios.post(`${backendUrl}/doctors`, payload);
    return res.data;
  } catch (err) {
    console.error('This is your error:', err);
  }
};

export const createReviews = async (place_id, doctor_id) => {
  const reviewPayload = {
    place_id,
    doctor_id,
  };

  try {
    let res = await axios.post(`${backendUrl}/reviews`, reviewPayload);
    return res.data;
  } catch (error) {}
};

export const createPhotos = async (doctor_reference, doctor_id) => {
  const photoHash = {
    doctor_id,
    doctor_reference,
  };

  try {
    let res = await axios.post(`${backendUrl}/photos`, photoHash);
    return res.data;
  } catch (err) {}
};
