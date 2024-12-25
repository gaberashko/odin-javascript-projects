
const myLibrary = [];

// Constructor for Book object.
function Book(title, author, pages, read=false) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;

    this.info = function() {
        let info = `${title} by ${author}, ${pages} pages, ${(read ? "read" : "not read yet")}`;
        return info;
    }
}

// Handles logic for removing a book from the library.
function removeBook(index) {
    myLibrary.splice(index, 1);
    render();
}

// Handles logic for switching the read status of a book.
function toggleRead(index) {
    let curBook = myLibrary[index];
    curBook.read = !curBook.read;
    render();
}

// Handles logic for adding a new book.
let titleElem = document.querySelector("#title"),
    authorElem = document.querySelector("#author"),
    pagesElem = document.querySelector("#pages"),
    readElem = document.querySelector("#read");

function addBookToLibrary() {
    let title = titleElem.value,
    author = authorElem.value,
    pages = pagesElem.value,
    read = readElem.checked;

    let newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    render();
}

// Handles logic for adding a new book card to display in library-wrapper.
let libraryElem = document.querySelector(".library-wrapper");

function render() {
    libraryElem.style.display = `${myLibrary.length == 0 ?"none":"flex"}`;
    libraryElem.innerHTML = "";
    for (let i = 0; i < myLibrary.length; ++i) {
        let curBook = myLibrary[i];
        let bookCard = document.createElement("div");
        bookCard.className = "book-card";
        bookCard.innerHTML = `<div class="title"><b>Title:</b> ${curBook.title}</div>
        <div class="author"><b>Author:</b> ${curBook.author}</div>
        <div class="pages"><b>Pages:</b> ${curBook.pages}</div>
        <div class="read"><b>Read:</b> ${curBook.read ? "Yes" : "No"}</div> <div class="button-wrapper">
                <button class="bold mfnt card-btn secondary" id="remove-btn" onclick="removeBook(${i})">Remove</button>
                <button class="bold mfnt card-btn" id="toggle-btn" onclick="toggleRead(${i})">Toggle Read</button></div>`;

        libraryElem.appendChild(bookCard);
    }
}


// Handles logic to display the form when clicking "New Book".
let newBookBtn = document.querySelector("#new-book");

newBookBtn.addEventListener("click", ()=> {
    let bookForm = document.querySelector(".content-wrapper");
    bookForm.classList.toggle("hidden");
});

let bookForm = document.querySelector("#book-form");
bookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBookToLibrary();
});

render();