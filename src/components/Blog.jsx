import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import '../styles/blog.css';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/blogs`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBlogs(data);
        }
      })
      .catch((err) => console.log('Error fetching blogs', err));
  }, []);

  // Simple Markdown-like formatter for blog posts
  const formatContent = (content) => {
    if (!content) return null;
    return content.split('\n\n').map((block, idx) => {
      // Headers
      if (block.startsWith('### ')) {
        return <h3 key={idx}>{block.replace('### ', '')}</h3>;
      }
      if (block.startsWith('#### ')) {
        return <h4 key={idx}>{block.replace('#### ', '')}</h4>;
      }
      // Lists (numbered or bullets)
      if (block.startsWith('1. ') || block.startsWith('- ') || block.includes('\n- ') || block.includes('\n1. ')) {
        const lines = block.split('\n');
        const isNumbered = lines[0].match(/^[0-9]+\./);
        const ListTag = isNumbered ? 'ol' : 'ul';
        return (
          <ListTag key={idx}>
            {lines.map((line, i) => (
              <li key={i}>{line.replace(/^[0-9\-]+\.\s*|^-\s*/, '')}</li>
            ))}
          </ListTag>
        );
      }
      // Code blocks
      if (block.startsWith('```')) {
        const codeText = block.replace(/```[a-zA-Z]*\n|```/g, '');
        return (
          <pre key={idx}>
            <code>{codeText}</code>
          </pre>
        );
      }
      // Standard paragraph
      return <p key={idx}>{block}</p>;
    });
  };

  if (blogs.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="blog" id="blog">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Blog</h2>
          <div className="underline"></div>
        </motion.div>

        <motion.div
          className="blog-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              className="blog-card"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedBlog(blog)}
            >
              <div className="blog-meta">
                <span className="blog-category">{blog.category}</span>
                <span>{blog.readTime} min read</span>
              </div>
              <h3>{blog.title}</h3>
              <p className="blog-summary">{blog.summary}</p>
              <span className="blog-read-more">
                Read Article
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* BLOG DETAIL MODAL */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            className="blog-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              className="blog-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close-btn" onClick={() => setSelectedBlog(null)}>&times;</button>
              
              <div className="blog-modal-header">
                <h3 className="blog-modal-title">{selectedBlog.title}</h3>
                <div className="blog-modal-meta">
                  <span className="blog-category">{selectedBlog.category}</span>
                  <span>&bull;</span>
                  <span>{selectedBlog.readTime} min read</span>
                  <span>&bull;</span>
                  <span>{new Date(selectedBlog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="blog-modal-content">
                {formatContent(selectedBlog.content)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
