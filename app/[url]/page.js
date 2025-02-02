'use client'

import React, { useState, useContext, useEffect, useMemo } from 'react';
import { CommentContext } from "@/contexts/Comment.js";
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI('AIzaSyAJOLBIgUl6XpUvOXEJ2WhermvnptOhMOk');

function CommentBox() {
  const [caption, setCaption] = useState([]);
  const { comments, addComment, commentUpvotes, upvoteComment } = useContext(CommentContext);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageUrls = [
    "https://press.rebus.community/app/uploads/sites/144/h5p/content/2/images/file-5e346c3c2a370.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/4/4e/Barlow_assisted_migration_lecture_2015_at_Michigan_Tech.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/2/2b/Modell_der_Mehrdimensionalen_Interaktivität.PNG"
  ];

  // Memoized sorted comments
  const getSortedComments = useMemo(() => {
    const slideComments = comments[currentImageIndex] || [];
    const slideUpvotes = commentUpvotes[currentImageIndex] || [];
    
    return slideComments
      .map((cmt, index) => ({ 
        text: cmt, 
        upvotes: slideUpvotes[index] || 0, 
        index 
      }))
      .sort((a, b) => b.upvotes - a.upvotes);
  }, [comments, currentImageIndex, commentUpvotes]);

  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  const getBase64Image = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image to Base64:", error);
      return null;
    }
  };

  const generateCaption = async (difficulty = 'standard') => {
    try {
      setCaption([]);
      const base64Image = await getBase64Image(imageUrls[currentImageIndex]);
      if (!base64Image) {
        setCaption(["Failed to process image."]);
        return;
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Adjust the prompt based on difficulty
      const prompt = difficulty === 'harder' 
        ? "Please generate 1 challenging question that would be helpful for an advanced exam/final test based on the selected image. Focus on deeper analysis, critical thinking, or complex relationships between concepts. Format it as a comprehensive exam question to challenge understanding of the slide. Don't introduce the question and try to keep it short/medium, non multi part, and maybe up to a maximum of 6 lines"
        : "Please generate 1 question that would be helpful as a study guide based on the selected image. Format it as similar to a comprehensive midterm/quiz like question a teacher may provide to ensure understanding of the slide. Don't introduce the question and try to keep it short/medium, non multi part, and maybe up to a maximum of 6 lines";

      const result = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: prompt }] },
          { role: "user", parts: [{ inline_data: { mime_type: "image/jpeg", data: base64Image } }] }
        ]
      });

      const captionText = result.response.text();
      const cleanedCaption = captionText
        .split(/(?=\d+\.)/)
        .map((question, index) => <p key={index}>{question.trim()}</p>);

      setCaption(cleanedCaption);
    } catch (error) {
      console.error("Error generating caption:", error);
      setCaption(["Failed to generate a caption."]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(currentImageIndex, comment.trim());
      setComment('');
      // Show comments after posting
      setShowComments(true);
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageNavigation = (direction) => {
    setCurrentImageIndex((prevIndex) => {
      const totalImages = imageUrls.length;
      if (direction === 'next') {
        return prevIndex === totalImages - 1 ? 0 : prevIndex + 1;
      }
      return prevIndex === 0 ? totalImages - 1 : prevIndex - 1;
    });
    setCaption([]);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        handleImageNavigation('prev');
      } else if (event.key === 'ArrowRight') {
        handleImageNavigation('next');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
      <div className="h-screen w-screen flex flex-col mt-12">
        <div className="flex flex-row h-[60%]">
          <div className={`transition-all duration-300 ${showComments ? 'w-[60%]' : 'w-full'} relative flex justify-center items-center h-full overflow-hidden`}>
            {/* Add a fixed-dimension container */}
            <div className="w-full h-full flex justify-center items-center bg-gray-50">
              <div className="relative w-full h-full flex justify-center items-center">
                <img
                  src={imageUrls[currentImageIndex]}
                  alt={`Slide ${currentImageIndex + 1}`}
                  className="max-w-[90%] max-h-[90%] object-contain absolute"
                  loading="lazy"
                  style={{
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                />
              </div>
            </div>
          </div>

        {showComments && (
          <div className="w-[40%] h-full p-4 overflow-y-auto">
            <h2 className="text-lg font-bold mb-2">Questions</h2>
            <div className="flex flex-col gap-3">
              {getSortedComments.map(({ text, upvotes, index }) => (
                <div key={`${currentImageIndex}-${index}`} className={`flex justify-between p-3 rounded-lg shadow ${index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-200'}`}>
                  <p>{text}</p>
                  <button
                    onClick={() => upvoteComment(currentImageIndex, index)}
                    className="text-blue-500 font-bold"
                  >
                    {upvotes} 👍
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end mb-2 p-6">
        {comments[currentImageIndex]?.length > 0 ? (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-blue-500 font-semibold"
          >
            {showComments ? 'Hide Questions' : 'Show Questions'}
          </button>
        ): <button
        className="font-semibold text-white"
      >
        hihi
      </button>}
      </div>

      <div className="h-[40%] w-full flex flex-col gap-12 p-6">
        <div className='flex flex-col gap-2'>
          <div className={`w-full ${caption.length > 0 ? 'h-full' : 'h-[60px]'} p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}>
            {caption}
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
              onClick={() => generateCaption('standard')}
            >
              Generate Standard Question
            </button>
            <button
              className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-md shadow-md hover:bg-purple-600"
              onClick={() => generateCaption('harder')}
            >
              Generate Harder Question
            </button>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-3 mb-12 pb-16">
          <textarea
            value={comment}
            onChange={handleInputChange}
            placeholder="Write a question..."
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={isSubmitting || !comment.trim()}
          >
            Post Question
          </button>
        </form>   
      </div>
    </div>
  );
}

export default CommentBox;