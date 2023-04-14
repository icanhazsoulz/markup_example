import './color-mode-toggler';
import '../scss/styles.scss';
import * as bootstrap from 'bootstrap';

(() => {
  'use strict';

  const loadItems = {
    url: 'https://picsum.photos/v2/list',
    button: document.getElementById('load-items'),
    container: document.getElementById('photos'),
    pageNum: 1,
    lorem: 'Lorem ipsum dolor sit amet',
    init() {
      this.updatePage();
      this.button.addEventListener('click', () => this.updatePage())
    },
    updatePage() {
      this.renderCards(this.url, this.pageNum);
      this.pageNum++;
      this.button.setAttribute('data-page-num', this.pageNum.toString());
    },
    renderCards(url, pageNum) {
      paginatedFetch(url, pageNum)
        .then(data => {
          if (!data.length) {
            this.button.remove();
            return false;
          }
          this.populateCards(data);
        })
        .catch(err => console.error(err));
    },
    populateCards(arr) {
      arr.forEach((item, i, arr) => {
        this.container.insertAdjacentHTML('beforeend', this.cardTemplate(item));
      });
      this.adjustCardText();
    },
    cardTemplate(item) {
      const text = this.generateCardText(this.lorem);
      return `
        <div class="col-md-6 mb-4">
          <div class="card">
            <img src="${item.download_url}" class="card-img-top" alt="${item.author}">
            <div class="card-body">
              <div class="h2 card-title">${item.author}</div>   
              <p class="card-text mb-2">${text}</p>      
              <span class="link-dark d-none unfold">Show more...</span>  
              <span class="link-dark d-none fold">Show less</span>
            </div>
            <div class="card-footer bg-transparent">
                <a href="#" class="btn btn-primary text-white me-3 mb-0 mb-md-2 mb-lg-0">Save to collection</a>
                <a href="#" class="btn btn-light">Share</a>
            </div>
          </div>
        </div>      
      `;
    },
    generateCardText(string) {
      return [...Array(Math.floor(Math.random() * 10 + 1))].map(_ => string).join(' ');
    },
    adjustCardText() {
      document.querySelectorAll('.card').forEach((item, i, arr) => {
        const card = this.setCard(item);

        this.resetCardBody(card);

        card.unfold.addEventListener('click', () => this.expandText(card));
        card.fold.addEventListener('click', () => this.collapseText(card));
      });
    },
    setCard(item) {
      return {
        text: item.querySelector('.card-text'),
        fold: item.querySelector('.fold'),
        unfold: item.querySelector('.unfold'),
        body: item.querySelector('.card-body')
      }
    },
    resetCardBody(card) {
      card.text.style.height = 'auto';
      card.text.style.overflow = 'auto';
      card.unfold.classList.add('d-none');
      card.fold.classList.add('d-none');

      if (card.text.offsetHeight > 48) {
        card.text.style.height = '48px';
        card.text.style.overflow = 'hidden';
        card.unfold.classList.remove('d-none');
      }
    },
    recheck(card) {
      if (card.text.offsetHeight <= 48) {
        card.unfold.classList.add('d-none');
      }
    },
    expandText(card) {
      card.text.style.height = 'auto';
      card.text.style.overflow = 'auto';
      card.body.style.height = 'auto';
      card.unfold.classList.add('d-none');
      card.fold.classList.remove('d-none');
    },
    collapseText(card) {
      card.text.style.height = '48px';
      card.text.style.overflow = 'hidden';
      card.body.style.height = cardBodyHeight();
      card.unfold.classList.remove('d-none');
      card.fold.classList.add('d-none');
    }
  }

  loadItems.init()

  function paginatedFetch (url, page = 1) {
    return fetch(`${url}?page=${page}&limit=9`)
      .then(response => {
        return response.json()
      })
  }

  function cardBodyHeight() {
    const screenWidth = window.screen.width;
    return (screenWidth >= 768 && screenWidth <=991) ? '175px' : '150px';
  }

  window.addEventListener('resize', function() {
    document.querySelectorAll('.card').forEach((item, i, arr) => {
      const card = loadItems.setCard(item);
      loadItems.resetCardBody(card);
    });
  });
})()
