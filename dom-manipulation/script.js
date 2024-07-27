// script.js

let quotes = [];
let categories = new Set();
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Use JSONPlaceholder for testing

// Load quotes from local storage if available
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
    populateCategories();
    filterQuotes();
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    populateCategories();
}

// Function to handle adding a new quote
async function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);
        categories.add(quoteCategory);
        saveQuotes(); // Save to local storage
        await syncWithServer(newQuote); // Sync with server
        alert('Quote added successfully!');
        populateCategories();
        filterQuotes();
    } else {
        alert('Please fill in both fields.');
    }
}

// Function to update categories in the dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';

    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    filteredQuotes.forEach(quote => {
        const p = document.createElement('p');
        p.textContent = quote.text;
        quoteDisplay.appendChild(p);
    });

    localStorage.setItem('selectedCategory', selectedCategory);
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes(); // Save to local storage
        alert('Quotes imported successfully!');
        populateCategories();
        filterQuotes();
    };
    fileReader.readAsText(event.target.files[0]);
}

// Sync with server
async function syncWithServer(newQuote) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(newQuote),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        });
        const data = await response.json();
        console.log('Synced with server:', data);
    } catch (error) {
        console.error('Error syncing with server:', error);
    }
}

// Fetch quotes from server and update local storage
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();
        // Assuming serverQuotes is an array of quotes
        serverQuotes.forEach(serverQuote => {
            const existingQuote = quotes.find(q => q.text === serverQuote.text);
            if (!existingQuote) {
                quotes.push(serverQuote);
            }
        });
        saveQuotes();
        filterQuotes();
    } catch (error) {
        console.error('Error fetching from server:', error);
    }
}

// Sync quotes between local storage and server
async function syncQuotes() {
    await fetchQuotesFromServer();
    quotes.forEach(async (quote) => {
        await syncWithServer(quote);
    });
}

// Load quotes on initialization
window.onload = function() {
    loadQuotes();
    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory) {
        document.getElementById('categoryFilter').value = selectedCategory;
        filterQuotes();
    }
    // Fetch from server every 10 seconds
    setInterval(syncQuotes, 10000);
};

// Add event listeners
document.getElementById('addQuoteButton').addEventListener('click', addQuote);
document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);