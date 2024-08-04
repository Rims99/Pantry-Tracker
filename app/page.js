"use client";

import React, { useState, useEffect } from "react";
import { Container, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, TablePagination, List, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { db } from "../lib/firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

const Home = () => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [recipes, setRecipes] = useState([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);

  // Fetch pantry items
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pantry"), (querySnapshot) => {
      const itemsList = [];
      querySnapshot.forEach((doc) => {
        itemsList.push({ id: doc.id, ...doc.data() });
      });
      setItems(itemsList);
    });

    return () => unsubscribe();
  }, []);

  // Fetch recipes in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "recipes"), (querySnapshot) => {
      const recipesList = [];
      querySnapshot.forEach((doc) => {
        recipesList.push({ id: doc.id, ...doc.data() });
      });
      setRecipes(recipesList);
    });

    return () => unsubscribe();
  }, []);

  const capitalizeFirstLetter = (string) => {
    if (!string) return ""; // Return empty string if input is empty
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const addItem = async () => {
    console.log("Adding item:", itemName, quantity); // Log input values
    if (itemName.trim() && quantity.trim()) {
      const capitalizedItemName = capitalizeFirstLetter(itemName);
      console.log("Capitalized item name:", capitalizedItemName); // Log capitalized name
      await addDoc(collection(db, "pantry"), { name: capitalizedItemName, quantity: parseInt(quantity) });
      setItemName("");
      setQuantity("");
    }
  };

  const updateItem = async () => {
    console.log("Updating item:", itemName, quantity); // Log input values
    if (itemName.trim() && quantity.trim() && editingItem) {
      const capitalizedItemName = capitalizeFirstLetter(itemName);
      console.log("Capitalized item name:", capitalizedItemName); // Log capitalized name
      await updateDoc(doc(db, "pantry", editingItem.id), { name: capitalizedItemName, quantity: parseInt(quantity) });
      setItemName("");
      setQuantity("");
      setEditingItem(null);
    }
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "pantry", id));
  };

  const startEditing = (item) => {
    setEditingItem(item);
    setItemName(item.name);
    setQuantity(item.quantity);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const suggestRecipes = () => {
    const pantryItems = items.map(item => item.name.toLowerCase());
    console.log("Pantry Items:", pantryItems); // Log pantry items

    const suggested = recipes.filter(recipe =>
      recipe.ingredients.every(ingredient => pantryItems.includes(ingredient.toLowerCase()))
    );

    console.log("Suggested Recipes:", suggested); // Log suggested recipes
    setSuggestedRecipes(suggested);
  };

  return (
    <Container>
      <Typography variant="h4" style={{ textAlign: "center", fontWeight: "bold", marginTop: 100, marginBottom: 40 }} gutterBottom>
        Welcome To Pantry Tracker
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        style={{ marginBottom: 10 }}
      />
      <Typography variant="h5" style={{ marginTop: 20, marginBottom: 10 }}>
        Add New Item
      </Typography>
      <TextField
        label="Item Name"
        variant="outlined"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        fullWidth
        style={{ marginBottom: 10 }}
      />
      <TextField
        label="Quantity"
        variant="outlined"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        fullWidth
        style={{ marginBottom: 10 }}
      />
      <Button
        onClick={editingItem ? updateItem : addItem}
        variant="contained"
        color="primary"
        style={{ marginBottom: 20 }}
      >
        {editingItem ? "Update Item" : "Add Item"}
      </Button>
      {/* <Button
        onClick={suggestRecipes}
        variant="contained"
        color="secondary"
        style={{ marginBottom: 20 }}
      >
        Suggest Recipes
      </Button> */}
      <TableContainer component={Paper} style={{ marginTop: 20, maxHeight: 400, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ fontWeight: 'bold' }}>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <IconButton edge="end" aria-label="edit" onClick={() => startEditing(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* <Typography variant="h5" style={{ marginTop: 40, marginBottom: 10 }}>
        Suggested Recipes
      </Typography>
      <List>
        {suggestedRecipes.length > 0 ? (
          suggestedRecipes.map((recipe, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={recipe.name}
                secondary={`Ingredients: ${recipe.ingredients.join(", ")}`}
              />
            </ListItem>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No recipes can be made with the current pantry items.
          </Typography>
        )}
      </List> */}
    </Container>
  );
};

export default Home;
