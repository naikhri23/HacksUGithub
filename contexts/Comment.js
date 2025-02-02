"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";

export const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState({});
  const [commentUpvotes, setCommentUpvotes] = useState({});

  // Load from local storage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const savedComments = JSON.parse(localStorage.getItem("comments")) || {};
        const savedUpvotes = JSON.parse(localStorage.getItem("commentUpvotes")) || {};
        setComments(savedComments);
        setCommentUpvotes(savedUpvotes);
      } catch (error) {
        console.error("Error loading from localStorage:", error);
        setComments({});
        setCommentUpvotes({});
      }
    };

    loadFromStorage();

    // Set up storage event listener for real-time updates
    const handleStorageChange = (event) => {
      if (event.key === "comments") {
        setComments(JSON.parse(event.newValue) || {});
      } else if (event.key === "commentUpvotes") {
        setCommentUpvotes(JSON.parse(event.newValue) || {});
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Persist to local storage when state updates
  const saveToStorage = useCallback((key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(comments).length > 0) {
      saveToStorage("comments", comments);
    }
  }, [comments, saveToStorage]);

  useEffect(() => {
    if (Object.keys(commentUpvotes).length > 0) {
      saveToStorage("commentUpvotes", commentUpvotes);
    }
  }, [commentUpvotes, saveToStorage]);

  const addComment = useCallback((slideIndex, newComment) => {
    setComments((prev) => {
      // Check if comment already exists to prevent duplicates
      const existingComments = prev[slideIndex] || [];
      if (existingComments.includes(newComment)) {
        return prev; // Return unchanged state if comment already exists
      }

      return {
        ...prev,
        [slideIndex]: [...(prev[slideIndex] || []), newComment]
      };
    });

    setCommentUpvotes((prevUpvotes) => ({
      ...prevUpvotes,
      [slideIndex]: [...(prevUpvotes[slideIndex] || []), 0]
    }));
  }, []);

  const upvoteComment = useCallback((slideIndex, commentIndex) => {
    setCommentUpvotes((prevUpvotes) => ({
      ...prevUpvotes,
      [slideIndex]: (prevUpvotes[slideIndex] || []).map(
        (upvote, i) => (i === commentIndex ? upvote + 1 : upvote)
      )
    }));
  }, []);

  return (
    <CommentContext.Provider value={{ 
      comments, 
      commentUpvotes, 
      addComment, 
      upvoteComment 
    }}>
      {children}
    </CommentContext.Provider>
  );
};