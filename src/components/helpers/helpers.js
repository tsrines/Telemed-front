import axios from 'axios';

export const createDoctors = async (doctors) => {
  const docArray = [];
  doctors.forEach(async (doctor) => {
    let detailedDoctor;
    try {
      let res = await axios.get(
        `https://cryptic-island-45793.herokuapp.com/geocodes/details/${doctor.place_id}`
      );
      detailedDoctor = res.data.result;
    } catch (err) {
      console.error('Error', err);
    }

    const {
      formatted_address,
      formatted_phone_number,
      name,
      place_id,
      rating,
      url,
      website,
      user_ratings_total,
      geometry: {
        location: { lat, lng },
      },
    } = detailedDoctor;

    const doctorHash = {
      place_id,
      name,
      formatted_address,
      rating,
      user_ratings_total,
      formatted_phone_number,
      lat,
      lng,
      url,
      website,
    };
    const myHeaders = new Headers();

    myHeaders.append('Content-Type', 'Application/json');
    myHeaders.append('accepts', 'application/json');

    const postDoctorsOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(doctorHash),
      redirect: 'follow',
    };
    let data;
    try {
      let res = await fetch(
        'https://cryptic-island-45793.herokuapp.com/doctors',
        postDoctorsOptions
      );

      data = await res.json();
    } catch (err) {
      console.error(err);
    }
    docArray.push(data);
  });

  return docArray;
};
