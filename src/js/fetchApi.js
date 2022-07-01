// import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = `28317427-cd386f88f666cbda8176ce58f`;
const BASE_URL = `https://pixabay.com/api/`;


// async
export default class NewApiFetch {
  constructor() {
    this.query = '';
    this.page = 1;
  }

  fetchArticles() {
    // console.log(this);
    const params = new URLSearchParams({
      key: API_KEY,
      q: this.query,
      image_type: `photo`,
      orientation: `horizontal`,
      safesearch: `true`,
      per_page: `40`,
      page:this.page,
    });
    return fetch(`${BASE_URL}?${params}`)
      .then(response => {
        return response.json()
      })
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}

// Без asynс//////////////////////
// return response
// .then(response => {
//   if (!response.ok) {
//     throw new Error(response.status);
//   }
//   return response.json();
// });
