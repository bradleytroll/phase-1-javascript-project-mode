function getFiveQuotes() {
  const apiUrl = 'https://api.quotable.io/quotes?limit=5';

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.results && Array.isArray(data.results)) {
        renderQuotes(data.results); 
      } else {
        console.error('Invalid data format received:', data);
      }
    })
    .catch(error => console.error('Error fetching quotes:', error));
}

function addLikeDislikeButtons(quoteElement) {
  const likeButton = document.createElement('button');
  likeButton.innerText = 'Like';
  likeButton.classList.add('like-button');

  const dislikeButton = document.createElement('button');
  dislikeButton.innerText = 'Dislike';
  dislikeButton.classList.add('dislike-button');

  const quoteTextElement = document.createElement('p');
  quoteTextElement.innerText = quoteElement.innerText;
  quoteElement.innerHTML = ''; 

  quoteElement.appendChild(quoteTextElement);
  quoteElement.appendChild(likeButton);
  quoteElement.appendChild(dislikeButton);

  likeButton.addEventListener('click', () => {
    likeQuote(quoteElement);
  });

  dislikeButton.addEventListener('click', () => {
    dislikeQuote(quoteElement);
  });
}

function likeQuote(quoteElement) {
  quoteElement.classList.add('liked');
  quoteElement.classList.remove('disliked');
  updateQuoteCounter(quoteElement);
  alert('Thank you for voting!');
}

function dislikeQuote(quoteElement) {
  quoteElement.classList.add('disliked');
  quoteElement.classList.remove('liked');
  updateQuoteCounter(quoteElement);
  alert('Thank you for voting!');
}

function updateQuoteCounter(quoteElement) {
  const likeButton = quoteElement.querySelector('.like-button');
  const dislikeButton = quoteElement.querySelector('.dislike-button');

  const quoteId = quoteElement.dataset.id;
  const quoteCounterElement = quoteElement.querySelector('.quote-counter');

  const isLiked = quoteElement.classList.contains('liked');
  const isDisliked = quoteElement.classList.contains('disliked');

  let counters = JSON.parse(localStorage.getItem('quote_counters')) || {};
  if (!counters[quoteId]) {
    counters[quoteId] = {
      likes: 0,
      dislikes: 0,
    };
  }

  if (isLiked) {
    counters[quoteId].likes++;
    if (isDisliked) {
      counters[quoteId].dislikes--;
    }
  } else if (isDisliked) {
    counters[quoteId].dislikes++;
  } else {
    counters[quoteId].likes--;
  }

  localStorage.setItem('quote_counters', JSON.stringify(counters));

  quoteCounterElement.innerText = 'Likes - Dislikes: ' + (counters[quoteId].likes - counters[quoteId].dislikes);
}

function displayComments(quoteElement, comments) {
  const existingComments = quoteElement.querySelectorAll('.comment');
  existingComments.forEach(comment => {
    comment.remove();
  });

  comments.forEach((comment, index) => {
    let commentElement = document.createElement('p');
    commentElement.innerText = 'Comment: ' + comment;
    commentElement.classList.add('comment');

    let deleteButton = document.createElement('button');
    deleteButton.innerText = 'x'; 
    deleteButton.classList.add('delete-button');

    deleteButton.addEventListener('click', () => {
      deleteComment(quoteElement, index);
    });

    commentElement.appendChild(deleteButton);

    quoteElement.appendChild(commentElement);
  });
}

function deleteComment(quoteElement, commentIndex) {
  const quoteId = quoteElement.dataset.id;

  let comments = JSON.parse(localStorage.getItem('quote_comments')) || {};

  if (comments[quoteId]) {
    comments[quoteId].splice(commentIndex, 1);

    localStorage.setItem('quote_comments', JSON.stringify(comments));

    displayComments(quoteElement, comments[quoteId]);
  }
}

function submitComment(quoteElement, comment) {
  let comments = JSON.parse(localStorage.getItem('quote_comments')) || {};

  const quoteId = quoteElement.dataset.id;

  if (!comments[quoteId]) {
    comments[quoteId] = [];
  }
  comments[quoteId].push(comment);

  localStorage.setItem('quote_comments', JSON.stringify(comments));

  displayComments(quoteElement, comments[quoteId]);

  alert('Thank you for submitting a comment!');
}

function renderQuotes(quotesData) {
  let container = document.getElementById('quote-container');

  container.innerHTML = '';

  const shuffledQuotes = shuffleArray(quotesData);

  const fiveQuotes = shuffledQuotes.slice(0, 5);

  fiveQuotes.forEach((quoteData, index) => {
    let quoteElement = document.createElement('blockquote');
    quoteElement.dataset.id = index; 

    let quoteContentElement = document.createElement('p');
    quoteContentElement.innerText = "Quote: " + quoteData.content;

    let authorElement = document.createElement('p');
    authorElement.innerText = "Author: " + quoteData.author;

    let tagsElement = document.createElement('p');
    tagsElement.innerText = "Tags: " + (quoteData.tags ? quoteData.tags.join(', ') : 'N/A');

    let linebreak = document.createElement("br");

    quoteElement.appendChild(quoteContentElement);
    quoteElement.appendChild(linebreak);
    quoteElement.appendChild(authorElement);
    quoteElement.appendChild(linebreak);
    quoteElement.appendChild(tagsElement);

    addLikeDislikeButtons(quoteElement); 

    let quoteCounterElement = document.createElement('p');
    quoteCounterElement.innerText = 'Likes - Dislikes: 0';
    quoteCounterElement.classList.add('quote-counter');

    quoteElement.appendChild(quoteCounterElement);

    let commentForm = document.createElement('form');
    commentForm.classList.add('comment-form');

    let commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.placeholder = 'Leave a comment...';

    let commentSubmitButton = document.createElement('button');
    commentSubmitButton.type = 'submit';
    commentSubmitButton.innerText = 'Submit';

    commentForm.appendChild(commentInput);
    commentForm.appendChild(commentSubmitButton);
    quoteElement.appendChild(commentForm);

    container.appendChild(quoteElement);

    let counters = JSON.parse(localStorage.getItem('quote_counters')) || {};
    if (counters[index]) {
      quoteCounterElement.innerText = 'Likes - Dislikes: ' + (counters[index].likes - counters[index].dislikes);
      if (counters[index].likes - counters[index].dislikes > 0) {
        quoteElement.classList.add('liked');
      } else if (counters[index].likes - counters[index].dislikes < 0) {
        quoteElement.classList.add('disliked');
      }
    }

    quoteElement.addEventListener('mouseover', handleQuoteMouseOver);
    quoteElement.addEventListener('mouseout', handleQuoteMouseOut);
  });

  let comments = JSON.parse(localStorage.getItem('quote_comments')) || {};
  Object.keys(comments).forEach(quoteId => {
    const quoteElement = container.querySelector(`[data-id="${quoteId}"]`);
    if (quoteElement) {
      displayComments(quoteElement, comments[quoteId]);
    }
  });

  addCommentFormListener();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


function handleQuoteMouseOver(event) {
  event.target.dataset.originalColor = event.target.style.backgroundColor;
  event.target.style.backgroundColor = 'lightgray';
}

function handleQuoteMouseOut(event) {
  event.target.style.backgroundColor = event.target.dataset.originalColor;
}

function addCommentFormListener() {
  const commentForms = document.querySelectorAll('.comment-form');
  commentForms.forEach(commentForm => {
    commentForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const inputField = event.target.querySelector('input[type="text"]');
      const comment = inputField.value;
      if (comment.trim() !== '') {
        submitComment(event.target.parentElement, comment);
        inputField.value = ''; 
      }
    });
  });
}

getFiveQuotes();
