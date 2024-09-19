import React, { useState, useEffect } from "react";
import { addBook } from "../../service/api";
import "./addBook.css";
import "animate.css";

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [bookPages, setBookPages] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [genre, setGenre] = useState("");
  const [pdfFile, setPdfFile] = useState(null); // New state for PDF
  const [readingStatus, setReadingStatus] = useState(''); // New state for reading status
  const [modalMessage, setModalMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Scroll to top when modal becomes visible
  useEffect(() => {
    if (modalVisible) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [modalVisible]);

  const onPdfChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const addNewBook = async () => {
    const formData = new FormData(); // Using FormData to handle file upload
    formData.append("title", title);
    formData.append("author", author);
    formData.append("no_of_pages", bookPages);
    formData.append("published_at", publishDate); // Ensure backend uses 'published_at'
    formData.append("genre", genre);
    if (pdfFile) {
      formData.append("pdf", pdfFile); // Correct field name for PDF
    }
    formData.append("reading_status", readingStatus);

    try {
      const response = await addBook(formData); // Pass formData to API call
      console.log("Response:", response);
      setModalMessage(response?.data?.message || "Book added successfully");
      setModalVisible(true);
    } catch (error) {
      setModalMessage("Error adding book");
      console.error("Error adding book:", error);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <section>
      <div className="form-container animate__animated animate__backInDown">
        {modalVisible && (
          <div className="modal animate__animated animate__tada">
            <button className="close-btn" onClick={closeModal}>
              X
            </button>
            <p className="modal-text">{modalMessage}</p>
            <a href="/books">
              <button className="nav-back-btn">Back to Collection</button>
            </a>
          </div>
        )}
        <div className="add-book-form">
          <h1>Add a new book.</h1>
          <div className="input-container">
            <label>Title: </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label>Author: </label>
            <input
              type="text"
              name="author"
              id="author"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label># of Pages: </label>
            <input
              type="number"
              name="no_of_pages"
              id="no_of_pages"
              placeholder="Total Pages"
              value={bookPages}
              onChange={(e) => setBookPages(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <label>Date Published: </label>
            <input
              type="date"
              name="publish_date"
              id="publish_date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <label>Genre: </label>
            <input
              type="text"
              name="genre"
              id="genre"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </div>

          {/* New input for PDF file */}
          <div className="input-container">
            <label>Upload PDF: </label>
            <input
              type="file"
              name="pdf"
              id="pdf"
              accept="application/pdf"
              onChange={onPdfChange}
            />
          </div>

          <div className='input-container'>
            <label>Reading Status: </label>
            <select
              name='reading_status'
              id='reading_status'
              value={readingStatus}
              onChange={(e) => setReadingStatus(e.target.value)}
              required
            >
              <option value=''>Select Status</option>
              <option value='To Read'>To Read</option>
              <option value='Reading'>Reading</option>
              <option value='Read'>Read</option>
            </select>
          </div>

          <button className="addBook-btn" onClick={addNewBook}>
            Add Book
          </button>
        </div>
      </div>
    </section>
  );
};

export default AddBook;
