"use client"

import React, { useState, useContext, useEffect, useRef } from 'react';
import { CommentContext } from "@/contexts/Comment.js";
import { MessageCircleQuestion } from "lucide-react";

function TeacherPage() {
  const { comments, commentUpvotes } = useContext(CommentContext);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasNewQuestions, setHasNewQuestions] = useState(false);
  const lastSeenCountsRef = useRef({});

  const imageUrls = [
    "https://press.rebus.community/app/uploads/sites/144/h5p/content/2/images/file-5e346c3c2a370.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/4/4e/Barlow_assisted_migration_lecture_2015_at_Michigan_Tech.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/2/2b/Modell_der_Mehrdimensionalen_Interaktivität.PNG"
  ];

  // Update last seen counts when questions are shown
  useEffect(() => {
    if (showQuestions) {
      const currentCounts = {};
      Object.keys(comments).forEach(slideIndex => {
        currentCounts[slideIndex] = comments[slideIndex]?.length || 0;
      });
      lastSeenCountsRef.current = currentCounts;
      setHasNewQuestions(false);
    }
  }, [showQuestions, comments]);

  // Check for new questions
  useEffect(() => {
    const currentCounts = {};
    Object.keys(comments).forEach(slideIndex => {
      currentCounts[slideIndex] = comments[slideIndex]?.length || 0;
    });

    const hasNew = Object.keys(currentCounts).some(slideIndex => 
      currentCounts[slideIndex] > (lastSeenCountsRef.current[slideIndex] || 0)
    );

    if (!showQuestions) {
      setHasNewQuestions(hasNew);
    }
  }, [comments, showQuestions]);

  const getSortedComments = () => {
    const slideComments = comments[currentImageIndex] || [];
    const slideUpvotes = commentUpvotes[currentImageIndex] || [];

    return slideComments
      .map((text, index) => ({
        text,
        upvotes: slideUpvotes[index] || 0,
        index,
      }))
      .sort((a, b) => b.upvotes - a.upvotes);
  };

  const handleImageNavigation = (direction) => {
    setCurrentImageIndex(prevIndex => {
      const totalImages = imageUrls.length;
      if (direction === 'next') {
        return prevIndex === totalImages - 1 ? 0 : prevIndex + 1;
      }
      return prevIndex === 0 ? totalImages - 1 : prevIndex - 1;
    });
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

  // Add real-time update listener
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "comments" || event.key === "commentUpvotes") {
        if (!showQuestions) {
          setHasNewQuestions(true);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [showQuestions]);

  return (
    <div className="h-screen w-screen flex flex-col relative">
      <div className="flex flex-row h-full">
        <div className={`transition-all duration-300 ${showQuestions ? 'w-[60%]' : 'w-full'} flex justify-center items-center h-full overflow-hidden`}>
          <img
            src={imageUrls[currentImageIndex]}
            alt={`Slide ${currentImageIndex + 1}`}
            className="max-w-full max-h-full object-contain p-6"
            loading="lazy"
          />
        </div>

        {showQuestions && (
          <div className="w-[40%] h-full p-4 overflow-y-auto mt-10">
            <h2 className="text-lg font-bold mb-2">
              {getSortedComments().length > 0 
                ? `Questions For Slide ${currentImageIndex + 1}`
                : 'No Questions Yet'}
            </h2>
            <div className="flex flex-col gap-3">
              {getSortedComments().map(({ text, upvotes, index }) => (
                <div 
                  key={`${currentImageIndex}-${index}`} 
                  className={`flex justify-between p-3 rounded-lg shadow ${
                    index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-200'
                  }`}
                >
                  <p>{text}</p>
                  <p className="text-blue-500 font-bold">
                    {upvotes} 👍
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-5 right-5 w-10 h-10">
        <button
          onClick={() => setShowQuestions(!showQuestions)}
          className="relative"
        >
          <MessageCircleQuestion className="w-10 h-10 text-gray-700" />
          {hasNewQuestions && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>
      </div>

      <div className="absolute bottom-5 left-5 bg-blue-100 p-3 rounded-lg flex items-center space-x-3 border border-gray-300/20">
        <span className="text-base font-medium text-gray-700">Class Join Code:</span>
        <span className="text-xl font-semibold text-gray-900">
          {window?.location?.pathname?.split('/')[1]}
        </span>
      </div>
    </div>
  );
}

export default TeacherPage;