import './css/styles.css';
import NewApiFetch from './js/fetchApi';
import markup from './templates/markup.hbs';

import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

const newApiFetch = new NewApiFetch();

// // ////////////////////submit/////////////////
formEl.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  newApiFetch.query = form.elements.searchQuery.value.trim();
  if (newApiFetch.query === '') {
    galleryEl.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  newApiFetch.resetPage();
  newApiFetch.fetchArticles().then(articles => {
    // console.log(newApiFetch);
    if (articles.totalHits > newApiFetch.page * articles.hits.length) {
      loadMore.classList.remove('visually-hidden');
    } else {
      loadMore.classList.add('visually-hidden');
    }
  
    clearArticles();
    appendArticles(articles.hits);

  


    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}

const loadMore = document.querySelector('.load-more');
loadMore.classList.add('visually-hidden');
// // ////////////////////click/////////////////
loadMore.addEventListener('click', handleClick);
function handleClick() {
  newApiFetch.incrementPage();
  newApiFetch.fetchArticles().then(articles => appendArticles(articles.hits));
}

function appendArticles(articles) {
  galleryEl.insertAdjacentHTML('beforeend', markup(articles));
  let gallery = new SimpleLightbox('.gallery  a', {});
  gallery.refresh();
  if (newApiFetch.page > 1) {
    loadMore.classList.remove('visually-hidden');
  }
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function clearArticles() {
  galleryEl.innerHTML = '';
}
// //////////////////////////////
// if (newApiFetch.page > 1) {
//   Notiflix.Notify.success(
//     'Hooray! We found' + ' ' +  newApiFetch.totalHits + ' ' + 'images.'
//   );
//   return;
// }