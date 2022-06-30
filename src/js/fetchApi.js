import axios from 'axios';


const API_KEY = `28317427-cd386f88f666cbda8176ce58f`;
const BASE_URL = `https://pixabay.com/api/`;

export async function fetchEvents(keyword, page) {
  const params = new URLSearchParams({
    key: API_KEY,
    q:keyword,
    image_type: `photo`,
    orientation: `horizontal`,
    safesearch: `true`,
    per_page: `40`,
    page: page,
  });

  const response = await axios.get(`${BASE_URL}?${params}`)
  return response.data
}



// Без asynс//////////////////////
// return response
// .then(response => {
//   if (!response.ok) {
//     throw new Error(response.status);
//   }
//   return response.json();
// });
