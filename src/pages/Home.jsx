import React from 'react';
import { Link } from 'react-router';
import { Book, List, Cloud, Calculator, Image, ShoppingCart, Music, Gamepad, Video, Code, Dices } from 'lucide-react';

function Home() {
  const miniProjects = [
    { name: 'Book Management App', path: '/books', icon: <Book /> },
    { name: 'Todo App', path: '/todo', icon: <List /> },
    { name: 'Weather App', path: '/weather', icon: <Cloud /> },
    { name: 'Calculator App', path: '/calculator', icon: <Calculator /> },
    { name: 'Image Gallery', path: '/image-gallery', icon: <Image /> },
    { name: 'E-Commerce App', path: '/ecommerce', icon: <ShoppingCart /> },
    { name: 'Random Stuff', path: '/random-stuff', icon: <Dices /> },
    { name: 'Game Hub', path: '/game-hub', icon: <Gamepad /> },
    { name: 'Video Streaming', path: '/video-streaming', icon: <Video /> },
    { name: 'Code Editor', path: '/code-editor', icon: <Code /> },
    // Add more projects here (total 30 ideas below)
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-4">
        Welcome to My Mini Projects
      </h1>
      <p className="text-center text-gray-400 mb-6">
        Select a project to explore:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {miniProjects.map((project, index) => (
          <Link
            key={index}
            to={project.path}
            className="bg-gray-800 hover:bg-gray-700 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col items-center"
          >
            <div className="text-4xl mb-4">{project.icon}</div>
            <h3 className="text-lg font-semibold">{project.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;

