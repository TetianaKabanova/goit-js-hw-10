import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  countriesList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
  searchBox: document.getElementById('search-box'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(onInputSearch, DEBOUNCE_DELAY)
);

function onInputSearch(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const inputValue = refs.searchBox.value.trim();
  console.log(inputValue);

  form.reset();

  fetchCountries(inputValue)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      renderMarkup(data);
    })
    .catch(onFetchError)
    .finally(() => form.reset());
}

function onFetchError(error) {
  Notify.failure('Oops, there is no country with that name');
}

const renderMarkup = data => {
  if (data.length === 1) {
    clearInterface();
    const markupInfo = createInfoMarkup(data);
    refs.countryInfo.innerHTML = markupInfo;
  } else {
    clearInterface();
    const markupList = createListMarkup(data);
    refs.countriesList.innerHTML = markupList;
  }
};

const createListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`
    )
    .join('');
};

const createInfoMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<img src="${flags.png}" alt="${name.official}" width="200" height="100">
      <h1>${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
};
