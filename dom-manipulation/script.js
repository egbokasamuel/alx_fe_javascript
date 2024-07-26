// Array of quote objects
let quotes = [
    { text: "The best way to predict the future is to create it.", category: "Inspiration" },
    { text: "Do what you can, with what you have, where you are.", category: "Motivation" },
    // Add more quotes here
  ];
  
  // Function to show a random quote
  function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>${randomQuote.category}</em></p>`;
  }
  
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      alert('New quote added successfully!');
    } else {
      alert('Please enter both the quote text and category.');
    }
  }
  // Function to create the Add Quote form and append it to the DOM
function createAddQuoteForm() {
    // Create form elements
    const form = document.createElement('form');
    form.id = 'addQuoteForm';

    const quoteInput = document.createElement('input');
    quoteInput.type = 'text';
    quoteInput.id = 'newQuoteText';
    quoteInput.placeholder = 'Enter a new quote';
    form.appendChild(quoteInput);

    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.id = 'newQuoteCategory';
    categoryInput.placeholder = 'Enter quote category';
    form.appendChild(categoryInput);

    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.innerText = 'Add Quote';
    submitButton.onclick = addQuote; // Assuming addQuote is another function to handle the form submission
    form.appendChild(submitButton);

    // Append the form to the body or a specific container
    document.body.appendChild(form);
}


  
  // Event listener for showing a new quote
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Initially show a random quote
  showRandomQuote();