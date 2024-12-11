import { useState, useEffect } from 'react';
import { Book, Plus, Search, Save, X } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
import { Timestamp } from "firebase/firestore";
function Booklist() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for adding a new book
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    suggester: '',
    imageUrl: 'https://via.placeholder.com/300x450.png?text=Book+Cover',
  });

  // Fetch books from Firestore with real-time updates
  useEffect(() => {
    const booksCollection = collection(db, 'books');
    const booksQuery = query(booksCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      booksQuery,
      (snapshot) => {
        const booksList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(booksList);
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Filter books based on search term
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle input changes for new book form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding a new book
  

const handleAddBook = async (e) => {
  e.preventDefault();

  if (!newBook.title.trim() || !newBook.author.trim()) {
    alert("Please enter a title and author for the book.");
    return;
  }

  if (isSubmitting) return;
  setIsSubmitting(true);

  const suggesterName = auth.currentUser?.displayName || newBook.suggester || "Anonymous";

  const bookToAdd = {
    ...newBook,
    title: newBook.title.trim(),
    author: newBook.author.trim(),
    description: newBook.description.trim() || "No description provided",
    genre: newBook.genre || "Uncategorized",
    suggester: suggesterName,
    imageUrl: newBook.imageUrl || 'https://via.placeholder.com/300x450.png?text=Book+Cover',
    createdAt: Timestamp.now(), // Use Firestore Timestamp
  };

  try {
    const docRef = await addDoc(collection(db, "books"), bookToAdd);
    const newBookWithId = { id: docRef.id, ...bookToAdd };

    setBooks((prevBooks) => [newBookWithId, ...prevBooks]);
    setNewBook({
      title: '',
      author: '',
      description: '',
      genre: '',
      suggester: '',
      imageUrl: 'https://via.placeholder.com/300x450.png?text=Book+Cover',
    });
    setIsAddingBook(false);
    alert("Book added successfully!");
  } catch (error) {
    console.error("Error adding book: ", error);
    alert("Failed to add book. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold flex items-center">
          <Book className="mr-3 text-blue-600" size={36} />
          Book List
        </h2>
        <p>Some of the books I have read and suggest. Please add yours 😊📚</p>
        {auth.currentUser && (
          <button
            onClick={() => setIsAddingBook(!isAddingBook)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {isAddingBook ? (
              <>
                <X className="mr-2" size={20} />
                Cancel
              </>
            ) : (
              <>
                <Plus className="mr-2" size={20} />
                Suggest Book
              </>
            )}
          </button>
        )}
      </div>

      {/* Add Book Form */}
      {isAddingBook && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-blue-600">Add a New Book</h3>
          <form onSubmit={handleAddBook} className="space-y-4">
             <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter book title"
                value={newBook.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                id="author"
                name="author"
                type="text"
                placeholder="Enter book author"
                value={newBook.author}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <select
                id="genre"
                name="genre"
                value={newBook.genre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Mystery">Mystery</option>
                <option value="Biography">Biography</option>
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter book description"
                value={newBook.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (optional)
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="text"
                placeholder="Enter book cover image URL"
                value={newBook.imageUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="suggester" className="block text-sm font-medium text-gray-700 mb-1">
                Suggesters Name
              </label>
              <input
                id="suggester"
                name="suggester"
                type="text"
                placeholder="Enter your name"
                value={newBook.suggester}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                } text-white px-4 py-2 rounded-lg transition duration-300`}
              >
                <Save className="mr-2" size={20} />
                {isSubmitting ? 'Saving...' : 'Save Book'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Input */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 rounded-lg">
          <p className="text-xl text-gray-600">No books found</p>
          <p className="text-sm text-gray-500 mt-2">Try a different search or add a new book</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="p-5">
                <img
                  src={book.imageUrl}
                  alt={`${book.title} cover`}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <h3 className="text-xl font-semibold text-blue-600 hover:text-blue-800 mb-2">{book.title}</h3>
                <p className="text-gray-600 mb-2">by {book.author}</p>
                {book.genre && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {book.genre}
                  </span>
                )}
                {book.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-3">{book.description}</p>
                )}
                {book.suggester && (
                  <p className="text-xs text-gray-400 mt-3 italic">Suggested by: {book.suggester}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Booklist;
