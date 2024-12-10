import React, { createContext, useState, useContext } from 'react';

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([
    { 
      id: 1, 
      title: 'Atomic Habits', 
      author: 'James Clear', 
      description: 'A guide on how to build good habits and break bad ones'
    , imageUrl: 'https://duabookpalace.com/cdn/shop/products/dua-book-palace-online-atomic-habits-38340136173800.jpg?v=1663838030'
    },
    { 
      id: 2, 
      title: 'Alchemist', 
      author: 'Paulo Coelho', 
      description: 'A story about a young shepherd who travels to Egypt after having a recurring dream about finding treasure there'
    , imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4T0aNvgYdBX8kfK_qYc046QFsSXhHE2NXWw&s'
    },
    { 
      id: 3, 
      title: 'Rich Dad Poor Dad',
      author : 'Robert Kiyosaki',
      description: "A book on personal finance",
      imageUrl: "https://www.getstoryshots.com/wp-content/uploads/Rich-Dad-Poor-Dad-summary-PDF-Robert-Kiyosaki.png"
    },
    {
        id: 4,
        title: "Steal Like an Artist",
        author: "Austin Kleon",
        description: "A book on creativity",
        imageUrl: "https://www.stanfords.co.uk/media/catalog/product/700x700/5/4/54a74734e21d485b04f6830b22abbcfb08c26a3e837ab3c2d72b255a6ab7dbe6.jpeg"
    },
    {
        id: 5,
        title: "Revive your Heart",
        author: "Nouman Ali Khan",
        description: "Inspiring modern Muslims to become sources of light in our world through the revival of their hearts",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWBZMyMiBvuXt5xudNcY1D0dzsbqknx81SRQ&s"
    },
    {
        id: 6,
        title: "Ikigai",
        author: "Hector Garcia",
        description: "A Japanese secret to a long and happy life",
        imageUrl: "https://thestationers.pk/cdn/shop/files/ikigai-the-japanese-secret-to-a-long-and-happy-life-the-stationers-1.jpg?v=1708446568"
    }
  ]);

  const addBook = (book) => {
    const newBook = { ...book, id: Date.now() };
    setBooks([...books, newBook]);
  };

  return (
    <BookContext.Provider value={{ books, addBook }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => useContext(BookContext);