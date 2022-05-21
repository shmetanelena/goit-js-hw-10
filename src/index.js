import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const input = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

input.addEventListener(
  'input',
  debounce(e => {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';

    const name = input.value.trim();
    if (name.length === 0) {
      return;
    }

    fetchCountries(name)
      .then(countries => {
        if (countries.length > 10) {
          Notify.info('Too many matches found. Please enter a more specific name.');
        } else if (countries.length > 1 && countries.length <= 10) {
          countryList.innerHTML = countries
            .map(
              country => `
            <li class="country-list-item">               
                <img class="flag" src=${country.flags.svg} alt="${country.name.official}"/>
                ${country.name.official}            
            </li>`
            )
            .join('');
        } else if (countries.length == 1) {
          const country = countries[0];

          countryInfo.innerHTML = `
                <div class="country-header">
                    <img class="flag" src=${country.flags.svg} alt="${country.name.official}"/>
                    <h1 class="country-name">${country.name.official}</h1>
                </div>
                <ul>
                    <li class="country-list-item">
                        <span class="country-attibute">Capital:</span>
                        ${country.capital[0]}
                    </li>
                    <li class="country-list-item">
                        <span class="country-attibute">Population:</span>
                        ${country.population}</span>
                    </li>
                    <li class="country-list-item">
                        <span class="country-attibute">Languages:</span>
                        ${Object.values(country.languages).join(', ')}
                    </li>
                </ul>`;
        }
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
      });
  }, DEBOUNCE_DELAY)
);
