import React, { useState } from 'react';
import { Moon, Sun, Github, Linkedin, Twitter, Send } from 'lucide-react';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 via-black to-gray-800' : 'bg-gradient-to-br from-gray-100 to-white'} min-h-screen font-inter tracking-tight text-gray-900 dark:text-white transition-all duration-500 relative overflow-hidden`}>
      {/* Blurred Background Circles */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500 dark:bg-purple-800 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500 dark:bg-blue-800 rounded-full filter blur-3xl opacity-30"></div>

      <div className="container mx-auto px-6 py-10 max-w-7xl relative z-10">
        {/* Navigation & Theme Toggle */}
        <nav className="flex justify-between items-center mb-20">
          <div className='text-3xl font-bold tracking-wider'>Abdul Basit</div>
          <button 
            onClick={toggleDarkMode} 
            className="backdrop-blur-sm bg-white/10 dark:bg-black/10 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
          </button>
        </nav>

        {/* Hero Section with Glassy Card */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Profile Section */}
          <div className="backdrop-blur-sm bg-white/10 dark:bg-black/10 rounded-3xl p-10 shadow-2xl border border-white/20 dark:border-black/20">
            <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-6xl font-bold text-white">AB</span>
            </div>
            <h1 className="text-5xl font-bold text-center mb-4">Abdul Basit</h1>
            <h2 className="text-2xl text-center text-gray-600 dark:text-gray-300 mb-8">Software Engineer</h2>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-8 mb-6">
              {[
                { Icon: Github, href: "https://github.com/yourusername" },
                { Icon: Linkedin, href: "https://linkedin.com/in/yourusername" },
                { Icon: Twitter, href: "https://twitter.com/yourusername" }
              ].map(({Icon, href}) => (
                <a 
                  key={href} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  <Icon size={32} />
                </a>
              ))}
            </div>
          </div>

          {/* About Me Section */}
          <div className="backdrop-blur-sm bg-white/10 dark:bg-black/10 rounded-3xl p-10 shadow-2xl border border-white/20 dark:border-black/20">
            <h3 className="text-3xl font-bold mb-6 border-b border-blue-500 pb-3">About Me</h3>
            <p className="text-xl leading-relaxed mb-8">
              Passionate Software Engineer specializing in React and React Native. 
              I transform complex challenges into elegant, user-centric digital solutions 
              with a keen eye for design and performance.
            </p>
            <button className="flex items-center gap-3 mx-auto bg-blue-500 text-white px-8 py-4 rounded-full hover:bg-blue-600 transition-colors text-lg">
              Contact Me <Send size={24} />
            </button>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-20 backdrop-blur-sm bg-white/10 dark:bg-black/10 rounded-3xl p-10 shadow-2xl border border-white/20 dark:border-black/20">
          <h3 className="text-4xl font-bold text-center mb-10 border-b border-blue-500 pb-3">Skills</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              'React', 'React Native', 'TypeScript', 
              'Tailwind CSS', 'JavaScript', 'UI/UX Design'
            ].map((skill) => (
              <div 
                key={skill} 
                className="bg-white/20 dark:bg-black/20 py-6 text-center rounded-xl hover:scale-105 transition-transform text-lg"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="mt-20 backdrop-blur-sm bg-white/10 dark:bg-black/10 rounded-3xl p-10 shadow-2xl border border-white/20 dark:border-black/20">
          <h3 className="text-4xl font-bold text-center mb-10 border-b border-blue-500 pb-3">Projects</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                name: 'Mobile App', 
                description: 'Cross-platform mobile application with seamless user experience',
                technologies: ['React Native', 'Redux', 'Firebase']
              },
              { 
                name: 'Web Dashboard', 
                description: 'Responsive dashboard with real-time data visualization',
                technologies: ['React', 'Tailwind', 'Chart.js']
              }
            ].map((project) => (
              <div 
                key={project.name} 
                className="bg-white/20 dark:bg-black/20 p-8 rounded-2xl hover:scale-105 transition-transform"
              >
                <h4 className="text-3xl font-semibold mb-6">{project.name}</h4>
                <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">{project.description}</p>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech) => (
                    <span 
                      key={tech} 
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-base"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-20 py-10 backdrop-blur-sm bg-white/10 dark:bg-black/10 rounded-t-3xl text-lg">
          <p>© 2024 Abdul Basit. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;