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
    // ... (existing code to create like/dislike buttons and wrap the quote text)
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

// Function to display quotes on the page
function renderQuotes(quotesData) {
    let container = document.getElementById('quote-container');

    // Remove existing quotes if any
    container.innerHTML = '';

    // Get the first 5 quotes from the array (if there are more than 5)
    const fiveQuotes = quotesData.slice(0, 5);

    fiveQuotes.forEach(quoteData => {
        let quoteElement = document.createElement('blockquote');
        quoteElement.innerText = quoteData.content;

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

        container.appendChild(quoteElement);
    });
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

// Function to handle submitting a comment
function submitComment(quoteElement, comment) {
    let commentElement = document.createElement('p');
    commentElement.innerText = 'Comment: ' + comment;
    commentElement.classList.add('comment');
    quoteElement.appendChild(commentElement);
}

// Load 5 quotes on page load
getFiveQuotes();
