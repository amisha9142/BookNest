import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Card, CardContent, CardActions, Typography, Grid, Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { deleteBookThunk, fetchBooksThunk } from "../redux/bookSlice";
import { FaTrashAlt } from "react-icons/fa";

// Styled component for Card shadow and hover effect
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  position: "relative", 
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[10],
  },
}));

const BookList = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state?.book?.books);
  const [selectedBook, setSelectedBook] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBooksThunk());
  }, [dispatch]);

  // Discount calculation
  const calculateDiscount = (mrp, sellPrice) => {
    return Math.round(((mrp - sellPrice) / mrp) * 100);
  };

  const handleDeleteOpen = (book) => {
    setSelectedBook(book);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedBook) {
      // Dispatch deleteBookThunk action to delete the book
      await dispatch(deleteBookThunk(selectedBook._id));
      setDeleteDialogOpen(false); // Close the dialog
      setSelectedBook(null); // Reset selected book
    }
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false); // Close the dialog without deleting
    setSelectedBook(null); // Reset selected book
  };

  if (!books) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Book List</h2>
      </div>

      <Grid container spacing={3} justifyContent="center">
        {books.length > 0 ? (
          books.map((book) => {
            const discount = calculateDiscount(book.mrp, book.sellPrice);
            return (
              <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
                <StyledCard>
                  {/* Delete Icon */}
                  <div className="absolute top-2 right-2">
                    <FaTrashAlt
                      onClick={() => handleDeleteOpen(book)} // Open delete dialog
                      className="text-red-500 cursor-pointer"
                    />
                  </div>

                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: "#333" }}>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ color: "#555" }}>
                      Author: {book.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ color: "#555" }}>
                      Description : {book.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginTop: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ color: "#777", textDecoration: "line-through" }}>
                        ₹{book.mrp}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ color: "#f50057", fontWeight: "bold" }}>
                          ₹{book.sellPrice}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ color: "#4caf50", marginLeft: 1 }}>
                          ({discount}% OFF)
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            );
          })
        ) : (
          <div>No books found.</div>
        )}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this book?</Typography>
        </DialogContent>
        <DialogActions>
          <button onClick={handleDeleteClose} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
          <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookList;
