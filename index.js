// Function to fetch data from the new API and display 5 quotes on page load
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

// Function to display quotes on the page
function renderQuotes(quotesData) {
    let container = document.getElementById('quote-container');

    quotesData.forEach(quoteData => {
        let quoteElement = document.createElement('blockquote');
        quoteElement.innerText = quoteData.content;

        let authorElement = document.createElement('p');
        authorElement.innerText = "- " + quoteData.author;

        let tagsElement = document.createElement('p');
        tagsElement.innerText = "Tags: " + (quoteData.tags ? quoteData.tags.join(', ') : 'N/A');

        quoteElement.appendChild(authorElement);
        quoteElement.appendChild(tagsElement);

        container.appendChild(quoteElement);
    });
}

// Load 5 quotes on page load
getFiveQuotes();



// document.addEventListener('DOMContentLoaded', () => {
//     getBooks();
// })


// // //Function to fetch data from API
// function getBooks() {
//     const apiUrl = 'https://openlibrary.org/api/volumes/brief/isbn/9780525440987.json';

//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//             renderBooks(data);
//         })
//         .catch(error => console.error('Error fetching books:', error));
//     console.log("Fetch Working")
// }

// //Function to display data on the page
// function renderBooks(books) {
//     let contianer = document.getElementById('books-contianer');

//     books.forEach(book => {
//         let card = document.createElement('div');

//         let titleElement = document.createElement('h2');
//         titleElement.innerText = book.title;

//         let authorElement = document.createElement('p');
//         authorElement.innerText = "Author(s): " + book.authors.join(', ');

//         let genreElement = document.createElement('p');
//         genreElement.innerText = "Genre: " + book.genre;

//         card.appendChild(titleElement);
//         card.appendChild(authorElement);
//         card.appendChild(genreElement);

//         contianer.appendChild(card);
//     });
// }




// // function renderOneBook(book) {
// //     let card = document.createElement('span');
// //     card.innerText = book.title;
// //     card.id = book.authors
// // }



// // //Funtion to display data on the page




// // //Event listeners



