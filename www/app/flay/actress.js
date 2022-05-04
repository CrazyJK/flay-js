import axios from 'axios';
import _ from 'lodash';
import $ from 'jquery';
import './actress.scss';
import { API } from '../lib/flay.api.js';
import { flayCard } from '../lib/flay.component.js';

const actress = {
  name: null,
};

window.initActress = (name) => {
  console.log('init', name);
  axios.get('/api/actress/' + name).then((response) => {
    _.extend(actress, response.data);
    console.log('actress', actress);
    showActress();
    showFlay();
    addEventListener();
  });
};

function showActress() {
  $('#favorite').prop('checked', actress.favorite);
  $('#name').val(actress.name);
  $('#localName').val(actress.localName);
  $('#birth').val(actress.birth);
  $('#body').val(actress.body);
  $('#height').val(actress.height);
  $('#debut').val(actress.debut);
  $('#comment').val(actress.comment);
}

function showFlay() {
  axios.get('/api/flay/find/' + actress.name).then((response) => {
    console.log('flay', response.data);
    const flayList = response.data;
    flayList.forEach((flay) => {
      $('.flay-container').append(flayCard(flay, { excludes: ['actress'] }));
    });
  });
}

function addEventListener() {
  $('#btnSave').on('click', () => {
    const newActress = {
      favorite: $('#favorite').prop('checked'),
      name: $('#name').val(),
      localName: $('#localName').val(),
      birth: $('#birth').val(),
      body: $('#body').val(),
      height: $('#height').val(),
      debut: $('#debut').val(),
      comment: $('#comment').val(),
    };
    _.extend(actress, newActress);
    console.log('actress', actress);
    API.Actress.save(actress);
  });
}
