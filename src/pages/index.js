import React from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { blue, red, grey, black } from "@mui/material/colors";


const AdminPanel = () => {
  return (
    <Box sx={{ padding: "20px", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header Section */}
      <Box sx={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>Bazaar 💸 Admin Panel</div>
        <Box sx={{ display: 'flex', gap: '20px' }}>
          <div>Admin Dashboard</div>
        </Box>
      </Box>

      {/* Buttons Section */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "10px", marginBottom: "20px" }}>
        <Box sx={{ display: 'flex', width: '100%', gap: '10px' }}>
          <Button variant="contained" sx={{ flex: 1, height: '40px', backgroundColor: '#6200EE', '&:hover': { backgroundColor: '#5300B9' } }}>Import Users</Button>
          <Button variant="contained" sx={{ flex: 1, height: '40px', backgroundColor: '#6200EE', '&:hover': { backgroundColor: '#5300B9' } }}>Disable Users</Button>
          <Button variant="contained" sx={{ flex: 1, height: '40px', backgroundColor: '#212121', color: 'white', '&:hover': { backgroundColor: '#000000' } }}>Delete Users</Button>
        </Box>
        <Box sx={{ display: 'flex', width: '100%', gap: '10px' }}>
          <Button variant="contained" sx={{ flex: 1, height: '40px', backgroundColor: '#3F51B5', '&:hover': { backgroundColor: '#303F9F' } }}>Assign Money</Button>
          <Button variant="contained" sx={{ flex: 1, height: '40px', backgroundColor: '#212121', color: 'white', '&:hover': { backgroundColor: '#000000' } }}>Enable Users</Button>
          <Button variant="contained" sx={{ flex: 1, height: '40px', backgroundColor: '#6200EE', '&:hover': { backgroundColor: '#5300B9' } }}>Start/Stop Randomizer</Button>
        </Box>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} sx={{ backgroundColor: 'background.paper', borderRadius: 2, boxShadow: '0 3px 5px rgba(0,0,0,0.1)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { name: "Alice Johnson", email: "alice@example.com", status: "Active" },
              { name: "Bob Smith", email: "bob@example.com", status: "Inactive" },
              { name: "Charlie Davis", email: "charlie@example.com", status: "Active" },
            ].map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.name}</TableCell>
                <TableCell>
                  <a href={`mailto:${user.email}`} style={{ color: blue[700], textDecoration: 'none' }}>{user.email}</a>
                </TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <Button variant="contained" sx={{ marginRight: 1, padding: '5px 10px', fontSize: '0.75rem', backgroundColor: '#6200EE', '&:hover': { backgroundColor: '#5300B9' } }}>
                    {user.status === "Active" ? "Disable" : "Enable"}
                  </Button>
                  <Button variant="contained" sx={{ marginRight: 1, padding: '5px 10px', fontSize: '0.75rem', backgroundColor: '#212121', color: 'white', '&:hover': { backgroundColor: '#000000' } }}>
                    Delete
                  </Button>
                  <Button variant="contained" sx={{ padding: '5px 10px', fontSize: '0.75rem', backgroundColor: '#3F51B5', '&:hover': { backgroundColor: '#303F9F' } }}>
                    Assign Money
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminPanel;