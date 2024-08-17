"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  Stack,
  TextField,
  Typography,
  Button,
  Container,
  Autocomplete,
  FormControl,
} from "@mui/material";
import {
  collection,
  query,
  getDocs,
  getDoc,
  deleteDoc,
  setDoc,
  doc,
} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const  [search, setSearch] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (id) => {
    const docRef = doc(collection(firestore, "inventory"), id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };
  const removeItem = async (id) => {
    const docRef = doc(collection(firestore, "inventory"), id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box bgcolor="#333">
        <Container>

          {/* Main */}
          <Box
            height="100vh"
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            gap={2}
            bgcolor="#e0e0e0"
          >
            {/* Open Menu */}
            <Modal open={open} onClose={handleClose}>
              <Box
                position="absolute"
                top="50%"
                left="50%"
                width={400}
                bgcolor="white"
                border="2px solid black"
                boxShadow={24}
                p={4}
                display="flex"
                flexDirection="column"
                gap={3}
                sx={{
                  transform: "translate(-50%,-50%)",
                }}
              >
                <Typography variant="h6">Add Item</Typography>
                <Stack width="100%" direction="row" spacing={2}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={itemName}
                    onChange={(e) => {
                      setItemName(e.target.value);
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => {
                      addItem(itemName);
                      setItemName("");
                      handleClose();
                    }}
                  >
                    Add
                  </Button>
                </Stack>
              </Box>
            </Modal>

            {/* Button to Aceess Add Item */}
            <Button
              variant="contained"
              onClick={() => {
                handleOpen();
              }}
            >
              Add New Item
            </Button>

            {/* Display Inventory Item */}
            <Box border="1px solid black">
              {/* Title */}
              <Box width="800px" height="100px" bgcolor="#ADD8E6">
                <Typography
                  variant="h2"
                  color="#333"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  Inventory Item
                </Typography>
              </Box>

              {/* Search filter */}
              <Box alignItems="center" width="100%" display="flex" justifyContent='center'>
                {/* <Autocomplete
                freeSolo
                id="boxes"
                disableClearable
                options={inventory.map((option) => option.id)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search input"
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                    }}
                  />
                )}
                /> */}
                <FormControl sx={{ m: 1, width: "75ch" }} variant="outlined" >
                  <TextField
                    id="filled-basic"
                    label="Search"
                    variant="filled"
                    value={search}

                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Item"
                  />
                </FormControl>
              </Box>

              {/* Items Stack */}
              <Stack width="800px" height="300px" spacing={1} overflow="auto">
                {console.log(inventory)}
                {inventory.filter((item)=>{
                  return search.toLowerCase() === "" ? item:item.id.toLowerCase().includes(search.toLowerCase())
                }).map(({ id, quantity }) => (
                  <Box
                    key={id}
                    width="100%"
                    // minHeight="150px"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    // bgcolor="#f0f0f0"
                    padding={2}
                  >
                    {/* DataSet Value */}
                    <Typography variant="h6" color="#333" textAlign="center">
                      {id.charAt(0).toUpperCase() + id.slice(1)}
                    </Typography>

                    <Box width='50%' display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
                      <Typography color="#333" textAlign="center">
                        x {quantity}
                      </Typography>
                      {/* Add or Remove Button */}
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          onClick={() => {
                            addItem(id);
                          }}
                        >
                          + Add
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => {
                            removeItem(id);
                          }}
                        >
                          - Remove
                        </Button>
                      </Stack>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Inventory Summary */}
            <Box
              width="800px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
              bgcolor="#ADD8E6"
              padding={1}
            >
              <Typography variant="h6" color="#333">
                Inventory Summary:
              </Typography>
              <Typography color="#333">
                Total Items: {inventory.length}
              </Typography>
              <Typography color="#333">
                Total Quantity:{" "}
                {inventory.reduce((acc, item) => acc + item.quantity, 0)}
              </Typography>
            </Box>

          </Box>
          
        </Container>
      </Box>
    </>
  );
}
