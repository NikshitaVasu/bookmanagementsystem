import React, { useState, useEffect } from "react";
import { getBooks, deleteBook } from "../../service/api";
import "./books.css";
import "animate.css";
// import '../../../../server/uploads/1726320923221.pdf';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("none");

  useEffect(() => {
    getAllBooks();
  }, []);

  const getAllBooks = async () => {
    setLoading(true);
    try {
      const response = await getBooks();
      console.log("Book details:", response.data);
      const sortedBooks = sortBooks(response.data, sortBy, sortOrder);
      setBooks(sortedBooks);
      setFilteredBooks(sortedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortBooks = (booksArray, sortBy, order) => {
    if (sortBy === "none") return booksArray;
    return booksArray.slice().sort((a, b) => {
      if (sortBy === "pages") {
        return order === "asc"
          ? a.no_of_pages - b.no_of_pages
          : b.no_of_pages - a.no_of_pages;
      } else if (sortBy === "date") {
        return order === "asc"
          ? new Date(a.published_at) - new Date(b.published_at)
          : new Date(b.published_at) - new Date(a.published_at);
      }
      return 0;
    });
  };

  const viewPdf = (file) => {
    window.open(`http://localhost:8082/pdfs/${file}`, '_blank');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteBookFromCollection = async (id) => {
    try {
      const response = await deleteBook(id);
      document.querySelector(".modal-text").textContent = response.data.message;
      document.querySelector(".modal").classList.remove("hide-modal");
      scrollToTop();
      getAllBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const closeModal = () => {
    document.querySelector(".modal").classList.add("hide-modal");
    scrollToTop();
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterBooks(query);
  };

  const filterBooks = (query) => {
    let filtered = books;
    if (query) {
      filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          (book.genre && book.genre.toLowerCase().includes(query.toLowerCase()))
      );
    }
    setFilteredBooks(sortBooks(filtered, sortBy, sortOrder));
  };

  const handleSortOptionsChange = (e) => {
    const [by, order] = e.target.value.split(":");
    setSortBy(by);
    setSortOrder(order);
    setFilteredBooks(sortBooks(filteredBooks, by, order));
  };

  return (
    <section className="books-page animate__animated animate__backInDown">
      <h1>Books Collection</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title, author or genre..."
          value={searchQuery}
          onChange={handleSearch}
          aria-label="Search"
        />
      </div>

      <div className="sort-container">
        <label htmlFor="sortOptions">Sort by: </label>
        <select id="sortOptions" onChange={handleSortOptionsChange}>
          <option value="none">Default</option>
          <option value="pages:asc">Pages: Low to High</option>
          <option value="pages:desc">Pages: High to Low</option>
          <option value="date:asc">Publish Date: Old to New</option>
          <option value="date:desc">Publish Date: New to Old</option>
        </select>
      </div>

      <div className="books-container">
        <div className="modal hide-modal animate__animated animate__tada">
          <button className="close-btn" onClick={closeModal}>
            X
          </button>
          <p className="modal-text"></p>
          <a href="/books">
            <button className="nav-back-btn">Back to Collection</button>
          </a>
        </div>

        {loading && <p>Loading...</p>}

        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div className="book-card" key={book.id}>
              <div className="book-card-header">
                <h2>
                  Title: <span className="light-text">{book.title}</span>
                </h2>
                <h3>
                  Author: <span className="light-text">{book.author}</span>
                </h3>
                <h4>
                  Number of Pages:{" "}
                  <span className="light-text">{book.no_of_pages}</span>
                </h4>
                <h4>
                  Publish Date:{" "}
                  <span className="light-text">{book.published_at}</span>
                </h4>
                <h4>
                  Genre:{" "}
                  <span className="light-text">
                    {book.genre || "Not available"}
                  </span>
                </h4>
                <h4>
                  Reading Status: <span className='light-text'>{book.reading_status || 'Not available'}</span>
                </h4>
                {book.pdf && (
                  <button className="view-pdf" onClick={() => viewPdf(book.pdf)}>
                    View pdf
                  </button>
                )}
              </div>
              
              <div className="book-card-buttons">
                <a href={`books/editBook/${book.id}`}>
                  <button className="book-card-button edit-btn">Edit</button>
                </a>
                <button
                  className="book-card-button remove-btn"
                  onClick={() => deleteBookFromCollection(book.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="book-card">
            <div className="book-card-header">
              <h2 className="light-text">No results found</h2>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Books;
