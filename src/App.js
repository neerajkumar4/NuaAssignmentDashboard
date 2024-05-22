// src/App.js
import React from 'react';
import { Container, Box } from '@mui/material';
import BookTable from './components/BookTable';

function App() {
  return (
    <div className="App">
      <Container>
        <Box sx={{ my: 4 }}>
          <BookTable />
        </Box>
      </Container>
    </div>
  );
}

export default App;
