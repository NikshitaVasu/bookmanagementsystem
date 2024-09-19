import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBook, editBook } from '../../service/api';
import 'animate.css';

const temp = {
  id: 0,
  title: '',
  author: '',
  no_of_pages: 0,
  published_at: '',
  genre: '',
  pdf: null, // Adding pdf field
  reading_status:'' // Add reading_status here
};

const EditBook = () => {
  const [book, setBook] = useState(temp);
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { id } = useParams();
  const [pdfFile, setPdfFile] = useState(null); // For storing the uploaded PDF file

  useEffect(() => {
    loadBookDetails(id);
  }, [id]);

  const loadBookDetails = async (id) => {
    try {
      const response = await getBook(id);
      setBook(response.data);
    } catch (error) {
      console.error('Error loading book details:', error);
    }
  };

  const onValueChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const onPdfChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const updateNewBook = async () => {
    const formData = new FormData();
    formData.append('id', book.id); // Ensure ID is included
    formData.append('title', book.title);
    formData.append('author', book.author);
    formData.append('no_of_pages', book.no_of_pages);
    formData.append('published_at', book.published_at);
    formData.append('genre', book.genre);
    console.log(pdfFile,'pdf file edit book');
    if (pdfFile) {
      formData.append('pdf', pdfFile); // Append PDF file to form data if uploaded
    }
    formData.append("reading_status", book.reading_status);

    try {
      const response = await editBook(formData);
      setModalMessage(response.data.message || 'Book updated successfully');
      setModalVisible(true);
      scrollToTop(); // Scroll to top after showing the modal
    } catch (error) {
      setModalMessage('Error updating book');
      setModalVisible(true);
      console.error('Error updating book:', error);
      scrollToTop(); // Scroll to top after showing the modal
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    scrollToTop(); // Scroll to top when closing the modal
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section>
      <div className='form-container animate__animated animate__backInDown'>
        {modalVisible && (
          <div className='modal animate__animated animate__tada'>
            <button className='close-btn' onClick={closeModal}>
              X
            </button>
            <p className='modal-text'>{modalMessage}</p>
            <a href='/books'>
              <button className='nav-back-btn'>Back to Collection</button>
            </a>
          </div>
        )}
        <div className='add-book-form'>
          <h1>Edit book details.</h1>
          <div className='input-container'>
            <label>Title: </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='Title'
              onChange={onValueChange}
              value={book.title}
            />
          </div>
          <div className='input-container'>
            <label>Author: </label>
            <input
              type='text'
              name='author'
              id='author'
              placeholder='Author'
              onChange={onValueChange}
              value={book.author}
            />
          </div>
          <div className='input-container'>
            <label># of Pages: </label>
            <input
              type='number'
              min='1'
              name='no_of_pages'
              id='no_of_pages'
              placeholder='Total Pages'
              onChange={onValueChange}
              value={book.no_of_pages}
            />
          </div>
          <div className='input-container'>
            <label>Date Published: </label>
            <input
              type='date'
              name='published_at'
              id='published_at'
              onChange={onValueChange}
              value={book.published_at}
            />
          </div>
          <div className='input-container'>
            <label>Genre: </label>
            <input
              type='text'
              name='genre'
              id='genre'
              placeholder='Genre'
              onChange={onValueChange}
              value={book.genre}
            />
          </div>
          <div className='input-container'>
            <label>Upload PDF: </label>
            <input
              type='file'
              accept='application/pdf'
              onChange={onPdfChange}
            />
          </div>

          <div className='input-container'>
            <label>Reading Status: </label>
            <select
              name='reading_status'
              id='reading_status'
              onChange={onValueChange}
              value={book.reading_status}
            >
              <option value=''>Select Status</option>
              <option value='To Read'>To Read</option>
              <option value='Reading'>Reading</option>
              <option value='Read'>Read</option>
            </select>
          </div>

          <button className='addBook-btn' onClick={updateNewBook}>
            Edit Book
          </button>
        </div>
      </div>
    </section>
  );
};

export default EditBook;
