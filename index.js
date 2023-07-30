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

// Function to shuffle an array using the Fisher-Yates Shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
}

// Function to handle disliking a quote
function dislikeQuote(quoteElement) {
    quoteElement.classList.add('disliked');
    quoteElement.classList.remove('liked');
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

    // Create a new paragraph element to display the comment
    let commentElement = document.createElement('p');
    commentElement.innerText = 'Comment: ' + comment;
    commentElement.classList.add('comment');
    quoteElement.appendChild(commentElement);
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
        quoteElement.innerText = quoteData.content;
        quoteElement.dataset.id = index; // Set a unique identifier (index) for each quote

        let authorElement = document.createElement('p');
        authorElement.innerText = "Quote by - " + quoteData.author;

        let tagsElement = document.createElement('p');
        tagsElement.innerText = "Tags: " + (quoteData.tags ? quoteData.tags.join(', ') : 'N/A');

        quoteElement.appendChild(authorElement);
        quoteElement.appendChild(tagsElement);

        addLikeDislikeButtons(quoteElement); // Call the function to add like/dislike buttons

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

        // Load existing comments for this quote from local storage
        let comments = JSON.parse(localStorage.getItem('quote_comments')) || {};
        if (comments[index]) {
            comments[index].forEach(comment => {
                submitComment(quoteElement, comment);
            });
        }

        container.appendChild(quoteElement);
    });

    // Add event listener to handle comment submission
    addCommentFormListener();
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
