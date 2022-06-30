import './css/styles.css';
import { fetchEvents } from './js/fetchApi';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';

let page = 1;
let keyword;
let newtotalHits;

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

// const loadMore = document.querySelector('.load-more');
// loadMore.classList.add('visually-hidden');
// // ////////////////////click/////////////////
// loadMore.addEventListener('click', handleClick);
// function handleClick() {
//   fetchEvents(keyword, page)
//     .then(data => {
//       newtotalHits = data.totalHits;
//       const events = data.hits;
//       page += 1;
//       renderEvents(events);
//       if (page > 1) {
//         loadMore.classList.remove('visually-hidden');
//       }
//     })
//     .catch(error => console.log(error));

//   if (page === newtotalHits / 40) {
//     loadMore.classList.remove('visually-hidden');
//     Notiflix.Notify.failure(
//       `We're sorry, but you've reached the end of search results.`
//     );
//     return;
//   }
// }
// ////////////////////submit/////////////////
formEl.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  keyword = form.elements.searchQuery.value;
  if (page > 1) {
    page = 1;
  }
  //////////////////infinite-scroll////////////////////////////////
  observer.unobserve(target);
  //////////////////////////////////////////////////////////////
  fetchEvents(keyword, page)
    .then(data => {
      newtotalHits = data.totalHits;
      const events = data.hits;
      //////////////////infinite-scroll////////////////////////////////
      observer.observe(target);
      //////////////////////////////////////////////////////////////
      if (keyword === "") {
        galleryEl.innerHTML = "";
        return;
      }
      if (events.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      page += 1;
      renderEvents(events);
      if (page > 1) {
        // loadMore.classList.remove('visually-hidden');
        Notiflix.Notify.success(
          'Hooray! We found' + ' ' + newtotalHits + ' ' + 'images.'
        );
        return;
      }
    })
    .catch(error => console.log(error));
    event.currentTarget.reset();
}

// //////////////////renderEvents/////////////////////////////////////////
function renderEvents(events) {
  const markup = events
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
    <div class="photo-card"> 
    <a class="info-link" href="${largeImageURL}">
    <img class="info-image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes: </b>${likes}
      </p>
      <p class="info-item">
        <b>Views: </b>${views}
      </p>
      <p class="info-item">
        <b>Comments: </b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads: </b>${downloads}
      </p>
    </div>
  </div> 
   `;
      }
    )
    .join('');
  
  galleryEl.innerHTML = markup;
 
  let gallery = new SimpleLightbox('.gallery  a', {});
  gallery.refresh();
    }
  // //////////////////SimpleLightbox/////////////////////////////////////////

  // ///////////////////////////Прокручування сторінки//////////////////////////////////////////////////////////////////////////////
//   const { height: cardHeight } = galleryEl;
//   galleryEl.firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

// //////////////////infinite-scroll//////////////////////////////////////////////////
const target = document.querySelector('.target-guard');

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(update, options);

function update(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      fetchEvents(keyword, page)
        .then(data => {
          newtotalHits = data.totalHits;
          const events = data.hits;
          page += 1;
         if(events.length === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          return
         }
          renderEvents(events);
        
          if (keyword === "" ) {
            galleryEl.innerHTML = "";
            // loadMore.classList.add('visually-hidden');
            Notiflix.Notify.failure(
              'Sorry, there are no images matching your search query. Please try again.'
            );
            return;
          }
        })
        .catch(error => console.log(error));

      if (page === newtotalHits / 40) {
        Notiflix.Notify.failure(
          `We're sorry, but you've reached the end of search results.`
        );
        return;
      }
    }
  });
}


