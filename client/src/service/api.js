import axios from "axios";

const URL = "http://localhost:8082";

export const getBooks = async () => {
  try {
    return await axios.get(`${URL}/books`);
  } catch (error) {
    console.error("Error while calling get books API", error);
    throw error;
  }
};

export const getBook = async (id) => {
  try {
    return await axios.get(`${URL}/books/editBook/${id}`);
  } catch (error) {
    console.error("Error while calling get book API", error);
    throw error;
  }
};

export const editBook = async (bookDetails) => {
  try {
    // Ensure the formData is constructed correctly
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data' // Set content type to handle file uploads
      }
    };

    // Construct the formData if not already done
    if (!(bookDetails instanceof FormData)) {
      const formData = new FormData();
      Object.keys(bookDetails).forEach(key => {
        formData.append(key, bookDetails[key]);
      });
      bookDetails = formData;
    }

    // Perform the PUT request
    const response = await axios.put(`${URL}/books/editBook/${bookDetails.get('id')}`, bookDetails, config);
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data); // Log response errors
    } else if (error.request) {
      console.error("Error request:", error.request); // Log request errors
    } else {
      console.error("Error message:", error.message); // Log other errors
    }
    throw error;
  }
};

// Updated addBook function to handle PDF upload
export const addBook = async (formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data' // Set content type to handle file uploads
      }
    };
    return await axios.post(`${URL}/books/addBook`, formData, config);
  } catch (error) {
    console.error("Error while calling add book API", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    return await axios.delete(`${URL}/books/${id}`);
  } catch (error) {
    console.error("Error while calling delete book API", error);
    throw error;
  }
};
