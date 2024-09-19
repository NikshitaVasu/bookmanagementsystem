<<<<<<< HEAD
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 8082;

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Built-in middleware to handle url encoded data
// Data which user enters in a form
app.use(express.urlencoded({ extended: false }));

// Built-in middleware for json data
app.use(express.json());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve PDF files from your specified directory
app.use('/pdfs', express.static('C:/Users/Siddhik Kumar/Desktop/Rospl/bookmanagementsystem-main/server/uploads'));

// Routes
app.use('/books', require('./routes/api/books'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 8082;

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//built-in middleware to handle url encoded data
//data which user enters in a form
app.use(express.urlencoded({ extended: false }));

//built-in middleware for json data
app.use(express.json());

//Routes
app.use('/books', require('./routes/api/books'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> a16c129e84ced801d680ab3b52a17d3d3bc7123e
