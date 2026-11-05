"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Avatar,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const initialReviews = [
  {
    id: 1,
    initial: "M",
    name: "Mitali Singh",
    country: "India",
    rating: 5,
    title: "Great Craftsmanship",
    body: "The quality is better than expected. I thought it might be flimsy, but it's very sturdy.",
    date: "2026-07-15",
  },
  {
    id: 2,
    initial: "A",
    name: "Ayesha Rehman",
    country: "India",
    rating: 5,
    title: "Good Symbolism",
    body: "It's romantic without being over the top. I wear it daily.",
    date: "2026-07-10",
  },
  {
    id: 3,
    initial: "C",
    name: "Charvi Patel",
    country: "India",
    rating: 5,
    title: "Unique Dual-Tone Look",
    body: "The silver heart inside the gold one is a cute concept—absolutely love it.",
    date: "2026-07-01",
  },
];

const CustomerReviews = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [activeTab, setActiveTab] = useState("reviews");
  const [sortBy, setSortBy] = useState("recent");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  // New review form state
  const [newReview, setNewReview] = useState({
    name: "",
    country: "India",
    rating: 5,
    title: "",
    body: "",
  });

  // Question form state
  const [newQuestion, setNewQuestion] = useState({
    name: "",
    email: "",
    question: "",
  });

  const handleAddReview = () => {
    if (
      !newReview.name.trim() ||
      !newReview.title.trim() ||
      !newReview.body.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    const createdReview = {
      id: Date.now(),
      initial: newReview.name.charAt(0).toUpperCase(),
      name: newReview.name,
      country: newReview.country || "India",
      rating: newReview.rating,
      title: newReview.title,
      body: newReview.body,
      date: new Date().toISOString().split("T")[0],
    };
    setReviews([createdReview, ...reviews]);
    setIsWriteModalOpen(false);
    setNewReview({
      name: "",
      country: "India",
      rating: 5,
      title: "",
      body: "",
    });
  };

  const handleAddQuestion = () => {
    if (!newQuestion.name.trim() || !newQuestion.question.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    alert("Thank you! Your question has been submitted successfully.");
    setIsQuestionModalOpen(false);
    setNewQuestion({ name: "", email: "", question: "" });
  };

  return (
    <Box sx={{ width: "90%", mt: 6, pt: 4, pb: 4, mx: "auto" }}>
      <Divider sx={{ mb: 4 }} />

      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        {/* Left Rating Info */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "20px", md: "24px" },
              color: "#111111",
              mb: 1,
            }}
          >
            Customer Reviews
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "18px",
                color: "#111111",
              }}
            >
              4.5
            </Typography>
            <Typography
              sx={{
                fontSize: "13px",
                color: "#666666",
              }}
            >
              {reviews.length} reviews
            </Typography>

            {/* Verified Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: "#E6F7F5",
                color: "#0A6C60",
                px: 1.2,
                py: 0.3,
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
              Verified
            </Box>
          </Box>
        </Box>

        {/* Right Action Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            disableRipple
            variant="contained"
            onClick={() => setIsWriteModalOpen(true)}
            sx={{
              height: 42,
              px: 3,
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 600,
              textTransform: "none",
              backgroundColor: "#1C0D0D",
              color: "#ffffff",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#333333",
                boxShadow: "none",
              },
            }}
          >
            Write a review
          </Button>

          <Button
            disableRipple
            variant="outlined"
            onClick={() => setIsQuestionModalOpen(true)}
            sx={{
              height: 42,
              px: 3,
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 600,
              textTransform: "none",
              borderColor: "#111111",
              color: "#111111",
              "&:hover": {
                borderColor: "#111111",
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Ask a question
          </Button>
        </Box>
      </Box>

      {/* Tabs and Filter Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #E0E0E0",
          mb: 4,
          pb: 0.5,
        }}
      >
        {/* Left Sub-Tabs */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box
            onClick={() => setActiveTab("reviews")}
            sx={{
              cursor: "pointer",
              pb: 1,
              borderBottom:
                activeTab === "reviews" ? "2px solid #111111" : "none",
              fontWeight: activeTab === "reviews" ? 600 : 500,
              fontSize: "13px",
              color: activeTab === "reviews" ? "#111111" : "#666666",
            }}
          >
            Reviews ({reviews.length})
          </Box>
          <Box
            onClick={() => setActiveTab("questions")}
            sx={{
              cursor: "pointer",
              pb: 1,
              borderBottom:
                activeTab === "questions" ? "2px solid #111111" : "none",
              fontWeight: activeTab === "questions" ? 600 : 500,
              fontSize: "13px",
              color: activeTab === "questions" ? "#111111" : "#666666",
            }}
          >
            Questions (0)
          </Box>
        </Box>

        {/* Right Filter & Sort */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            sx={{
              minWidth: 36,
              width: 36,
              height: 36,
              borderRadius: "4px",
              border: "1px solid #E0E0E0",
              color: "#333333",
              p: 0,
            }}
          >
            <FilterListIcon sx={{ fontSize: 18 }} />
          </Button>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="small"
            sx={{
              height: 36,
              fontSize: "12px",
              borderRadius: "4px",
              "& .MuiSelect-select": {
                py: 0.8,
                px: 1.5,
              },
            }}
          >
            <MenuItem value="recent" sx={{ fontSize: "12px" }}>
              Most recent
            </MenuItem>
            <MenuItem value="highest" sx={{ fontSize: "12px" }}>
              Highest rating
            </MenuItem>
            <MenuItem value="lowest" sx={{ fontSize: "12px" }}>
              Lowest rating
            </MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Reviews List */}
      {activeTab === "reviews" ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {reviews.map((rev) => (
            <Box key={rev.id}>
              <Box sx={{ display: "flex", gap: 2, mb: 1.5 }}>
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "#EBEBEB",
                    color: "#111111",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {rev.initial}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#111111",
                      lineHeight: 1.2,
                    }}
                  >
                    {rev.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#777777",
                      mt: 0.3,
                    }}
                  >
                    {rev.country}
                  </Typography>
                </Box>
              </Box>

              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "#111111",
                  mb: 0.8,
                }}
              >
                {rev.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: "13.5px",
                  color: "#444444",
                  lineHeight: 1.6,
                  maxWidth: "800px",
                }}
              >
                {rev.body}
              </Typography>

              <Divider sx={{ mt: 3 }} />
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography sx={{ color: "#777777", fontSize: "13px" }}>
            No questions asked yet. Be the first to ask a question!
          </Typography>
        </Box>
      )}

      {/* Write a Review Modal */}
      <Dialog
        open={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "18px" }}>
          Write a Review
        </DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
          >
            <Box>
              <Typography sx={{ fontSize: "13px", fontWeight: 500, mb: 0.5 }}>
                Rating
              </Typography>
              <Rating
                value={newReview.rating}
                onChange={(e, val) =>
                  setNewReview((prev) => ({ ...prev, rating: val || 5 }))
                }
              />
            </Box>

            <TextField
              label="Your Name *"
              fullWidth
              size="small"
              value={newReview.name}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, name: e.target.value }))
              }
            />

            <TextField
              label="Location / Country"
              fullWidth
              size="small"
              value={newReview.country}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, country: e.target.value }))
              }
            />

            <TextField
              label="Review Title *"
              fullWidth
              size="small"
              value={newReview.title}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, title: e.target.value }))
              }
            />

            <TextField
              label="Your Review *"
              fullWidth
              multiline
              rows={4}
              size="small"
              value={newReview.body}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, body: e.target.value }))
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setIsWriteModalOpen(false)}
            sx={{ color: "#666", textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAddReview}
            sx={{
              backgroundColor: "#111111",
              color: "#ffffff",
              textTransform: "none",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ask a Question Modal */}
      <Dialog
        open={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "18px" }}>
          Ask a Question
        </DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
          >
            <TextField
              label="Your Name *"
              fullWidth
              size="small"
              value={newQuestion.name}
              onChange={(e) =>
                setNewQuestion((prev) => ({ ...prev, name: e.target.value }))
              }
            />

            <TextField
              label="Email Address"
              fullWidth
              size="small"
              type="email"
              value={newQuestion.email}
              onChange={(e) =>
                setNewQuestion((prev) => ({ ...prev, email: e.target.value }))
              }
            />

            <TextField
              label="Your Question *"
              fullWidth
              multiline
              rows={4}
              size="small"
              value={newQuestion.question}
              onChange={(e) =>
                setNewQuestion((prev) => ({
                  ...prev,
                  question: e.target.value,
                }))
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setIsQuestionModalOpen(false)}
            sx={{ color: "#666", textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAddQuestion}
            sx={{
              backgroundColor: "#111111",
              color: "#ffffff",
              textTransform: "none",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            Submit Question
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerReviews;
