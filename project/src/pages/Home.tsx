// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  { title: 'Plumbing', desc: 'High-quality plumbing services you can trust.' },
  { title: 'Electrical', desc: 'Reliable electrical solutions for your home and office.' },
  { title: 'Carpentry', desc: 'Expert carpentry services with attention to detail.' },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-beige-50 via-amber-50 to-yellow-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 rounded-b-xl transition-all duration-500 hover:shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-md hover:shadow-xl transition-shadow duration-300">
            <MessageSquare className="w-6 h-6 text-white animate-bounce" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide">NSA Maintenance</h1>
        </div>
        <div className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-amber-600 transition">Home</Link>
          <a href="#services" className="text-gray-700 hover:text-amber-600 transition">Services</a>
          <a href="#about" className="text-gray-700 hover:text-amber-600 transition">About</a>
          <Link
            to="/login"
            className="text-white bg-amber-400 px-5 py-2 rounded-lg hover:bg-orange-400 transition shadow-md hover:shadow-xl"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-20 px-4">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-24 h-24 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-2xl"
        >
          <MessageSquare className="w-10 h-10 text-white animate-pulse" />
        </motion.div>
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl font-extrabold mb-4 text-gray-800 tracking-tight"
        >
          Welcome to NSA Maintenance
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-gray-700 mb-6 max-w-2xl"
        >
          Providing top-notch maintenance services with reliability, trust, and excellence.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <Link
            to="/login"
            className="bg-amber-400 text-white px-10 py-3 rounded-xl hover:bg-orange-400 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 hover:scale-105"
          >
            Get Started
          </Link>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="mt-32 px-4 text-center">
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-semibold mb-12 text-gray-800"
        >
          Our Services
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <MessageSquare className="w-10 h-10 text-white animate-bounce" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-800">{service.title}</h4>
              <p className="text-gray-600">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="mt-32 px-4 text-center mb-20">
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-semibold mb-8 text-gray-800"
        >
          About Us
        </motion.h3>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto bg-white rounded-3xl p-10 shadow-lg"
        >
          <p className="text-gray-700 text-lg leading-relaxed">
            NSA Maintenance is a trusted maintenance service provider delivering excellence
            in plumbing, electrical, and carpentry services. Our team ensures quality, reliability,
            and customer satisfaction in every project.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
