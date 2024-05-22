import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TableSortLabel, Paper } from '@mui/material';
import { fetchBooks } from '../services/api';

const BookTable = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');

  useEffect(() => {
    loadBooks();
  }, [page, rowsPerPage, order, orderBy]);

  const loadBooks = async () => {
    const data = await fetchBooks('subject:fiction', page + 1, rowsPerPage);
    setBooks(data.docs);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'ratings_average'}
                  direction={orderBy === 'ratings_average' ? order : 'asc'}
                  onClick={() => handleRequestSort('ratings_average')}
                >
                  Ratings Average
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'author_name'}
                  direction={orderBy === 'author_name' ? order : 'asc'}
                  onClick={() => handleRequestSort('author_name')}
                >
                  Author Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleRequestSort('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'first_publish_year'}
                  direction={orderBy === 'first_publish_year' ? order : 'asc'}
                  onClick={() => handleRequestSort('first_publish_year')}
                >
                  First Publish Year
                </TableSortLabel>
              </TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Author Birth Date</TableCell>
              <TableCell>Author Top Work</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.key}>
                <TableCell>{book.ratings_average}</TableCell>
                <TableCell>{book.author_name}</TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.first_publish_year}</TableCell>
                <TableCell>{book.subject}</TableCell>
                <TableCell>{book.author_birth_date}</TableCell>
                <TableCell>{book.author_top_work}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 50, 100]}
          component="div"
          count={books.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Paper>
  );
};

export default BookTable;
