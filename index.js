// Function to fetch data from the new API and display 5 quotes on page load
function getFiveQuotes() {
    const apiUrl = 'https://api.quotable.io/quotes?limit=5';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && Array.isArray(data.results)) {
                // Shuffle the quotes randomly
                const shuffledQuotes = shuffleArray(data.results);
                renderQuotes(shuffledQuotes);
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

// Function to display quotes on the page
function renderQuotes(quotesData) {
    let container = document.getElementById('quote-container');

    quotesData.forEach(quoteData => {
        let quoteElement = document.createElement('blockquote');
        quoteElement.innerText = quoteData.content;

        let authorElement = document.createElement('p');
        authorElement.innerText = "Quote by - " + quoteData.author;

        let tagsElement = document.createElement('p');
        tagsElement.innerText = "Tags: " + (quoteData.tags ? quoteData.tags.join(', ') : 'N/A');

        quoteElement.appendChild(authorElement);
        quoteElement.appendChild(tagsElement);

        container.appendChild(quoteElement);
    });
}

// Load 5 quotes on page load
getFiveQuotes();


// ... (existing functions: getFiveQuotes, shuffleArray)

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

// Function to display quotes on the page
function renderQuotes(quotesData) {
    let container = document.getElementById('quote-container');

    quotesData.forEach(quoteData => {
        let quoteElement = document.createElement('blockquote');
        quoteElement.innerText = quoteData.content;

        let authorElement = document.createElement('p');
        authorElement.innerText = "Quote by - " + quoteData.author;

        let tagsElement = document.createElement('p');
        tagsElement.innerText = "Tags: " + (quoteData.tags ? quoteData.tags.join(', ') : 'N/A');

        quoteElement.appendChild(authorElement);
        quoteElement.appendChild(tagsElement);

        addLikeDislikeButtons(quoteElement); // Call the function to add like/dislike buttons

        container.appendChild(quoteElement);
    });
}

// Load 5 quotes on page load
getFiveQuotes();

// ... (existing event listener for like/dislike buttons)
