// Function to fetch data from the new API and display 5 quotes on page load
function getFiveQuotes() {
  const apiUrl = 'https://api.quotable.io/quotes?limit=5';

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.results && Array.isArray(data.results)) {
        renderQuotes(data.results); // Render all the fetched quotes
      } else {
        console.error('Invalid data format received:', data);
      }
    })
    .catch(error => console.error('Error fetching quotes:', error));
}

// Function to create and add like/dislike buttons to each quote
function addLikeDislikeButtons(quoteElement) {
  const likeButton = document.createElement('button');
  likeButton.innerText = 'Like';
  likeButton.classList.add('like-button');

  const dislikeButton = document.createElement('button');
  dislikeButton.innerText = 'Dislike';
  dislikeButton.classList.add('dislike-button');

  // Wrap the quote text in a separate <p> element
  const quoteTextElement = document.createElement('p');
  quoteTextElement.innerText = quoteElement.innerText;
  quoteElement.innerHTML = ''; // Clear the inner content of the quoteElement

  // Append the wrapped quote text and buttons to the quoteElement
  quoteElement.appendChild(quoteTextElement);
  quoteElement.appendChild(likeButton);
  quoteElement.appendChild(dislikeButton);

  // Add event listeners to the buttons
  likeButton.addEventListener('click', () => {
    likeQuote(quoteElement);
  });

  dislikeButton.addEventListener('click', () => {
    dislikeQuote(quoteElement);
  });
}

// Function to handle liking a quote
function likeQuote(quoteElement) {
  quoteElement.classList.add('liked');
  quoteElement.classList.remove('disliked');
  updateQuoteCounter(quoteElement);
  alert('Thank you for voting!');
}

// Function to handle disliking a quote
function dislikeQuote(quoteElement) {
  quoteElement.classList.add('disliked');
  quoteElement.classList.remove('liked');
  updateQuoteCounter(quoteElement);
  alert('Thank you for voting!');
}

// Function to update the like/dislike counter for a quote
function updateQuoteCounter(quoteElement) {
  const likeButton = quoteElement.querySelector('.like-button');
  const dislikeButton = quoteElement.querySelector('.dislike-button');

  const quoteId = quoteElement.dataset.id;
  const quoteCounterElement = quoteElement.querySelector('.quote-counter');

  // Check if the quote has been liked
  const isLiked = quoteElement.classList.contains('liked');
  // Check if the quote has been disliked
  const isDisliked = quoteElement.classList.contains('disliked');

  // Load existing counter data for this quote from local storage
  let counters = JSON.parse(localStorage.getItem('quote_counters')) || {};
  if (!counters[quoteId]) {
    counters[quoteId] = {
      likes: 0,
      dislikes: 0,
    };
  }

  // Update the like and dislike counts
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

  // Update the counters in local storage
  localStorage.setItem('quote_counters', JSON.stringify(counters));

  // Update the counter text on the quote element
  quoteCounterElement.innerText = 'Likes - Dislikes: ' + (counters[quoteId].likes - counters[quoteId].dislikes);
}

// Function to display comments for a specific quote
function displayComments(quoteElement, comments) {
  // Clear existing comments from the quote element
  const existingComments = quoteElement.querySelectorAll('.comment');
  existingComments.forEach(comment => {
    comment.remove();
  });

  // Append the new comments to the quote element
  comments.forEach((comment, index) => {
    let commentElement = document.createElement('p');
    commentElement.innerText = 'Comment: ' + comment;
    commentElement.classList.add('comment');

    // Create the delete button for each comment
    let deleteButton = document.createElement('button');
    deleteButton.innerText = 'x'; // Set the delete button text to 'x'
    deleteButton.classList.add('delete-button');

    // Add event listener to handle comment deletion
    deleteButton.addEventListener('click', () => {
      deleteComment(quoteElement, index);
    });

    // Append the delete button to the comment element
    commentElement.appendChild(deleteButton);

    quoteElement.appendChild(commentElement);
  });
}

// Function to handle deleting a comment
function deleteComment(quoteElement, commentIndex) {
  const quoteId = quoteElement.dataset.id;

  // Load existing comments for this quote from local storage
  let comments = JSON.parse(localStorage.getItem('quote_comments')) || {};

  if (comments[quoteId]) {
    // Remove the comment from the comments array
    comments[quoteId].splice(commentIndex, 1);

    // Update the comments in local storage
    localStorage.setItem('quote_comments', JSON.stringify(comments));

    // Display the updated comments for this quote
    displayComments(quoteElement, comments[quoteId]);
  }
}

// Function to handle submitting a comment
function submitComment(quoteElement, comment) {
  // Check if comments exist for this quote in local storage
  let comments = JSON.parse(localStorage.getItem('quote_comments')) || {};

  const quoteId = quoteElement.dataset.id;

  // Add the comment to the corresponding quote's comments array
  if (!comments[quoteId]) {
    comments[quoteId] = [];
  }
  comments[quoteId].push(comment);

  // Update the comments in local storage
  localStorage.setItem('quote_comments', JSON.stringify(comments));

  // Display the updated comments for this quote
  displayComments(quoteElement, comments[quoteId]);

  alert('Thank you for submitting a comment!');
}

// Function to display quotes on the page
function renderQuotes(quotesData) {
  let container = document.getElementById('quote-container');

  // Remove existing quotes if any
  container.innerHTML = '';

  // Get the first 5 quotes from the array (if there are more than 5)
  const fiveQuotes = quotesData.slice(0, 5);

  fiveQuotes.forEach((quoteData, index) => {
    let quoteElement = document.createElement('blockquote');
    quoteElement.dataset.id = index; // Set a unique identifier (index) for each quote

    // Create separate elements for quote content, author, and tags
    let quoteContentElement = document.createElement('p');
    quoteContentElement.innerText = "Quote: " + quoteData.content;

    let authorElement = document.createElement('p');
    authorElement.innerText = "Author: " + quoteData.author;

    let tagsElement = document.createElement('p');
    tagsElement.innerText = "Tags: " + (quoteData.tags ? quoteData.tags.join(', ') : 'N/A');

    let linebreak = document.createElement("br");

    // Append the quote content, author, and tags elements to the quote element
    quoteElement.appendChild(quoteContentElement);
    quoteElement.appendChild(linebreak);
    quoteElement.appendChild(authorElement);
    quoteElement.appendChild(linebreak);
    quoteElement.appendChild(tagsElement);

    addLikeDislikeButtons(quoteElement); // Call the function to add like/dislike buttons

    // Create the counter element and set its initial value to 0
    let quoteCounterElement = document.createElement('p');
    quoteCounterElement.innerText = 'Likes - Dislikes: 0';
    quoteCounterElement.classList.add('quote-counter');

    quoteElement.appendChild(quoteCounterElement);

    // Create the comment form and append it to the quote element
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

    // Load existing like/dislike counter data for this quote from local storage
    let counters = JSON.parse(localStorage.getItem('quote_counters')) || {};
    if (counters[index]) {
      quoteCounterElement.innerText = 'Likes - Dislikes: ' + (counters[index].likes - counters[index].dislikes);
      if (counters[index].likes - counters[index].dislikes > 0) {
        quoteElement.classList.add('liked');
      } else if (counters[index].likes - counters[index].dislikes < 0) {
        quoteElement.classList.add('disliked');
      }
    }

    // Add event listeners for mouseover and mouseout events on the quote
    quoteElement.addEventListener('mouseover', handleQuoteMouseOver);
    quoteElement.addEventListener('mouseout', handleQuoteMouseOut);
  });

  // Load existing comments for all quotes from local storage
  let comments = JSON.parse(localStorage.getItem('quote_comments')) || {};
  Object.keys(comments).forEach(quoteId => {
    const quoteElement = container.querySelector(`[data-id="${quoteId}"]`);
    if (quoteElement) {
      displayComments(quoteElement, comments[quoteId]);
    }
  });

  // Add event listener to handle comment submission
  addCommentFormListener();
}

// Add event listener to handle mouseover event on quote
function handleQuoteMouseOver(event) {
  // Store the original background color before applying the visual effect
  event.target.dataset.originalColor = event.target.style.backgroundColor;
  event.target.style.backgroundColor = 'lightgray';
}

// Add event listener to handle mouseout event on quote
function handleQuoteMouseOut(event) {
  // Reset the background color to its original color when the mouse pointer leaves the quote
  event.target.style.backgroundColor = event.target.dataset.originalColor;
}

// Add event listener to handle comment submission
function addCommentFormListener() {
  const commentForms = document.querySelectorAll('.comment-form');
  commentForms.forEach(commentForm => {
    commentForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const inputField = event.target.querySelector('input[type="text"]');
      const comment = inputField.value;
      if (comment.trim() !== '') {
        submitComment(event.target.parentElement, comment);
        inputField.value = ''; // Clear the input field after submission
      }
    });
  });
}

// Load 5 quotes on page load
getFiveQuotes();
