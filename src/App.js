// src/App.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import BookTable from './components/BookTable';

function App() {
  return (
    <div className="App">
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <BookTable />
        </Box>
      </Container>
    </div>
  );
}

export default App;
