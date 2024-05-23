import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  fetchBooks,
  fetchAuthorDetails,
  fetchAuthorTopwork,
} from "../services/api";

const BookTable = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("title");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBooks();
  }, [page, rowsPerPage]);

  useEffect(() => {
    setPage(0);
  }, [order, orderBy]);

  const loadBooks = async () => {
    setLoading(true);
    const data = await fetchBooks("subject:fiction", page + 1, rowsPerPage);
    const booksWithAuthors = await Promise.all(
      data.docs.map(async (book) => {
        if (book.author_key && book.author_key.length > 0) {
          try {
            const authorDetails = await fetchAuthorDetails(book.author_key[0]);
            const authorTopwork = await fetchAuthorTopwork(book.author_key[0]);
            console.log(authorTopwork);
            return {
              ...book,
              author_name: authorDetails.name,
              author_birth_date: authorDetails.birth_date,
              author_top_work: authorTopwork,
            };
          } catch (error) {
            console.error(
              `Error fetching details for author ${book.author_key[0]}:`,
              error
            );
            return {
              ...book,
              author_name: "Unknown",
              author_birth_date: "Unknown",
              author_top_work: "Unknown",
            };
          }
        }
        return book;
      })
    );
    setBooks(booksWithAuthors);
    setLoading(false);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedBooks = books.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === "asc" ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const convertToCSV = (data) => {
    const headers = [
      "ratings_average",
      "author_name",
      "title",
      "first_publish_year",
      "subject",
      "author_birth_date",
      "author_top_work",
    ];
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(","));

    // Add data rows
    data.forEach((book) => {
      const row = headers
        .map((header) => {
          const value = book[header];
          return value ? `"${value.toString().replace(/"/g, '""')}"` : "";
        })
        .join(",");
      csvRows.push(row);
    });

    return csvRows.join("\n");
  };

  const handleDownloadCSV = () => {
    const csvData = convertToCSV(books);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "books.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Button variant="contained" color="primary" onClick={handleDownloadCSV}>
          Download CSV
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "ratings_average"}
                  direction={orderBy === "ratings_average" ? order : "asc"}
                  onClick={() => handleRequestSort("ratings_average")}
                >
                  <strong>Ratings Average</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "author_name"}
                  direction={orderBy === "author_name" ? order : "asc"}
                  onClick={() => handleRequestSort("author_name")}
                >
                  <strong>Author Name</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "title"}
                  direction={orderBy === "title" ? order : "asc"}
                  onClick={() => handleRequestSort("title")}
                >
                  <strong>Title</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "first_publish_year"}
                  direction={orderBy === "first_publish_year" ? order : "asc"}
                  onClick={() => handleRequestSort("first_publish_year")}
                >
                  <strong>First Publish Year</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "subject"}
                  direction={orderBy === "subject" ? order : "asc"}
                  onClick={() => handleRequestSort("subject")}
                >
                  <strong>Subject</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "author_birth_date"}
                  direction={orderBy === "author_birth_date" ? order : "asc"}
                  onClick={() => handleRequestSort("author_birth_date")}
                >
                  <strong>Author Birth Date</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "author_top_work"}
                  direction={orderBy === "author_top_work" ? order : "asc"}
                  onClick={() => handleRequestSort("author_top_work")}
                >
                  <strong>Author Top Work</strong>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              sortedBooks.map((book) => (
                <TableRow key={book.key}>
                  <TableCell>{book.ratings_average}</TableCell>
                  <TableCell>{book.author_name}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.first_publish_year}</TableCell>
                  <TableCell>{book.subject?.join(", ")}</TableCell>
                  <TableCell>{book.author_birth_date}</TableCell>
                  <TableCell>{book.author_top_work}</TableCell>
                </TableRow>
              ))
            )}
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
