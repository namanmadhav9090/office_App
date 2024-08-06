import React from 'react';
import { Drawer, Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Dashboard
        </Typography>
        <Divider />
        <List>
          <ListItem button component={Link} to="/dashboard">
            <ListItemText primary="Dashboard Overview" />
          </ListItem>
          {/* <ListItem button component={Link} to="/departments">
            <ListItemText primary="Departments" />
          </ListItem>
          <ListItem button component={Link} to="/employees">
            <ListItemText primary="Employees" />
          </ListItem>
          <ListItem button component={Link} to="/assign-employees">
            <ListItemText primary="Assign Employees" />
          </ListItem> */}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
