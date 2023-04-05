import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '35093909-87304c45613df24ba6fd5782f';
const BASE_URL = 'https://pixabay.com/api/';
const gallery = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');
const toUpBtn = document.querySelector('.btn-to-top');

let searchQuery = '';
let page = 1;
let totalHits = 0;

form.addEventListener('submit', async event => {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return;
  }

  page = 1;
  totalHits = 0;
  gallery.innerHTML = '';

  const images = await fetchImages();
  renderImages(images);

  if (totalHits <= page * 40) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  const images = await fetchImages();
  renderImages(images);

  if (totalHits <= page * 40) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
});

async function fetchImages() {
  const { data } = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: page,
    },
  });

  totalHits = data.totalHits;

  return data.hits;
}

function renderImages(images) {
  if (!images.length) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  const html = images
    .map(
      image => `
       <div class="photo-card">
          <a class="gallery__link" href="${image.largeImageURL}">
          <div class="gallery-item" id="${image.id}">
            <img class="gallery-item__img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          <div class="info">
              <p class="info-item"><b>Likes</b>${image.likes}</p>
              <p class="info-item"><b>Views</b>${image.views}</p>
              <p class="info-item"><b>Comments</b>${image.comments}</p>
              <p class="info-item"><b>Downloads</b>${image.downloads}</p>
            </div>
          </div>
        </a>
        </div>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', html);
}
