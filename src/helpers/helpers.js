import axios from 'axios';

export const fetchApiDoctors = async (payload) => {
  try {
    let res = await axios.post(`http://localhost:3000/doctors`, payload);
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
    let res = await axios.post('http://localhost:3000/reviews', reviewPayload);
    return res.data;
  } catch (error) {}
};

export const createPhotos = async (doctor_reference, doctor_id) => {
  const photoHash = {
    doctor_id,
    doctor_reference,
  };

  try {
    let res = await axios.post(`http://localhost:3000/photos`, photoHash);
    return res.data;
  } catch (err) {}
};
