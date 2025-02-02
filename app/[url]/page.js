'use client'

import React, { useState, useEffect } from 'react';

function CommentBox() {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false); // Controls visibility

  // Load comments from localStorage when component mounts
  useEffect(() => {
    const savedComments = JSON.parse(localStorage.getItem('comments')) || [];
    setComments(savedComments);
  }, []);

  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const updatedComments = [...comments, comment];
      setComments(updatedComments);
      localStorage.setItem('comments', JSON.stringify(updatedComments)); // Save to localStorage
      setComment('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-bold mb-4">Questions</h2>
        <form onSubmit={handleFormSubmit} className="mb-4">
          <textarea
            value={comment}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Write a question..."
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Post Question
          </button>
        </form>

        {/* Toggle Button */}
        {comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="mb-3 text-blue-500 hover:underline"
          >
            {showComments ? 'Hide Questions' : 'Show Quesitons'}
          </button>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-2">
            {comments.map((cmt, index) => (
              <div key={index} className="p-3 bg-gray-100 rounded-lg">
                <p>{cmt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentBox;
