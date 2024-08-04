"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const buttonStyles = {
  addNewItem: {
    backgroundColor: '#2F4F4F', 
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1c442f',
    },
  },
  removeItem: {
    backgroundColor: '#662914', 
    color: '#fff',
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  },
  addItem: {
    backgroundColor: '#a6c942',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#006400',
    },
  },
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(''); 
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item, qty) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    const quantity = parseInt(qty, 10) || 1; 
    
    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data();
      await setDoc(docRef, { quantity: existingQuantity + quantity }, { merge: true });
    } else {
      await setDoc(docRef, { quantity });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      sx={{
        backgroundImage: 'url("https://static.vecteezy.com/system/resources/previews/017/476/220/original/grocery-store-flat-color-illustration-supermarket-sections-retail-business-fully-editable-2d-simple-cartoon-interior-with-wooden-shelves-with-vegetables-and-bread-on-background-vector.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Header */}
      <Box
        width="100%"
        height="80px"
        bgcolor="#8d5125"
        display="flex"
        justifyContent="center"
        alignItems="center"
        color="#fff"
      >
        <Typography variant="h3" sx={{ fontFamily: 'Times New Roman' }}>
          The Pantry
        </Typography>
      </Box>

      <Box
        flex={1} 
        display="flex"
        flexDirection="column" 
        gap={2} 
        justifyContent="center"
        alignItems="center"
      >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={'column'} spacing={2}>
              <TextField
                id="item-name"
                label="Item Name"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <TextField
                id="quantity"
                label="Quantity (default is 1)"
                variant="outlined"
                fullWidth
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName, quantity);
                  setItemName('');
                  setQuantity('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        {/* Search Bar */}
        <TextField
          id="search-bar"
          label="🔍 Search Inventory"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            maxWidth: '800px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderWidth: '3px',
              },
              '&:hover fieldset': {
                borderWidth: '5px', 
              },
              '&.Mui-focused fieldset': {
                borderWidth: '3px', 
              },
            },
          }}
        />

        <Button variant="contained" sx={buttonStyles.addNewItem} onClick={handleOpen}>
          Add New Item
        </Button>

        <Box border={'1px solid #333'}>
          <Box
            width="800px"
            height="70px"
            bgcolor={'#f4b18a'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Typography variant={'h4'} color={'#333'} textAlign={'center'} sx={{ fontFamily: 'Times New Roman' }}>
            🛒 Inventory Items
            </Typography>
          </Box>
          <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="60px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#F5F5F5'}
                paddingX={5}
              >
                <Typography variant={'h6'} color={'#333'} textAlign={'center'} sx={{ fontFamily: 'Times New Roman' }}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'h6'} color={'#333'} textAlign={'center'} sx={{ fontFamily: 'Times New Roman' }}>
                  Quantity: {quantity}
                </Typography>
                <Button variant="contained" sx={buttonStyles.removeItem} onClick={() => removeItem(name)}>
                  Remove
                </Button>
                <Button variant="contained" sx={buttonStyles.addItem} onClick={() => addItem(name, 1)}>
                  Add
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}