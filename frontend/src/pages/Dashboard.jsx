import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMenu } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import Cookies from "js-cookie";
import ButtonBox from "../components/Button";
import api from "../utils/apiInterceptor";
import { endPoints } from "../utils/endpoints";

const dummyDepartments = [
  {
    id: 1,
    departmentName: "HR",
    categoryName: "Administration",
    location: "New York",
    salary: 60000,
    assignedEmployees: [1, 2],
  },
  {
    id: 2,
    departmentName: "Engineering",
    categoryName: "Tech",
    location: "San Francisco",
    salary: 80000,
    assignedEmployees: [2, 3],
  },
  {
    id: 3,
    departmentName: "Marketing",
    categoryName: "Sales",
    location: "Chicago",
    salary: 55000,
    assignedEmployees: [4],
  },
  {
    id: 4,
    departmentName: "Finance",
    categoryName: "Finance",
    location: "Austin",
    salary: 75000,
    assignedEmployees: [],
  },
  {
    id: 5,
    departmentName: "Legal",
    categoryName: "Legal",
    location: "Seattle",
    salary: 70000,
    assignedEmployees: [5],
  },
];

// const dummyEmployees = [
//   { id: 1, name: 'Alice Johnson' },
//   { id: 2, name: 'Bob Smith' },
//   { id: 3, name: 'Charlie Davis' },
//   { id: 4, name: 'Diana Evans' },
//   { id: 5, name: 'Edward Lee' }
// ];

const dummyEmployees = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Employee",
    department: { name: "Engineering" },
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Manager",
    department: { name: "Marketing" },
  },
  {
    id: 3,
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    role: "Employee",
    department: { name: "HR" },
  },
  {
    id: 4,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Employee",
    department: null,
  },
  {
    id: 5,
    name: "Linda Davis",
    email: "linda.davis@example.com",
    role: "Manager",
    department: { name: "Sales" },
  },
];

const Dashboard = () => {
  const userRole = Cookies.get("role");
  // console.log("userRole", userRole);
  const [role, setRole] = useState(userRole);
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    departmentName: "",
    categoryName: "",
    location: "",
    salary: "",
  });
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [employees, setEmployees] = useState([]);

 

  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     try {
  //       const response = await axios.get('/api/employees'); // Adjust the endpoint as needed
  //       setEmployees(response.data); // Adjust based on the actual data structure
  //     } catch (error) {
  //       console.error('Error fetching employees:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchEmployees();
  // }, []);
  useEffect(() => {
    // Simulate data fetching
    const fetchEmployees = () => {
      setTimeout(() => {
        setEmployees(dummyEmployees);
        setLoading(false);
      }, 1000); // Simulate a network delay
    };

    fetchEmployees();
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOpenDialog = (mode = "add", department = null) => {
    setDialogMode(mode);
    if (department) {
      setSelectedDepartmentId(department.id);
      setFormData({
        departmentName: department.departmentName,
        categoryName: department.categoryName,
        location: department.location,
        salary: department.salary,
      });
      setAssignedEmployees(department.assignedEmployees); // Set preselected employees
      setSelectedEmployees(department.assignedEmployees); // Initialize selected employees
    } else {
      setFormData({
        departmentName: "",
        categoryName: "",
        location: "",
        salary: "",
      });
      setSelectedDepartmentId(null);
      setAssignedEmployees([]);
      setSelectedEmployees([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (dialogMode === "add") {
      // Add new department
      setDepartments([
        ...departments,
        {
          id: departments.length + 1, // Simulate an ID generation
          ...formData,
          assignedEmployees: selectedEmployees, // Assign employees when adding
        },
      ]);
    } else if (dialogMode === "edit" && selectedDepartmentId) {
      // Edit existing department
      setDepartments(
        departments.map((department) =>
          department.id === selectedDepartmentId
            ? {
                ...department,
                ...formData,
                assignedEmployees: selectedEmployees,
              }
            : department
        )
      );
    }
    setOpenDialog(false);
  };

  const handleOpenAssignDialog = () => {
    setOpenAssignDialog(true);
  };

  const handleCloseAssignDialog = () => {
    setOpenAssignDialog(false);
  };

  const handleEmployeeChange = (event) => {
    const { value, checked } = event.target;
    setSelectedEmployees((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleAssignSubmit = () => {
    // Handle assignment logic here
    console.log("Selected Employees:", selectedEmployees);
    setOpenAssignDialog(false);
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    navigate("/");
  };

  const fetchDepartments = async() => {
    setLoading(true);
    const response = await api.get(`${endPoints.allDepartments}?page=${page}&limit=${rowsPerPage}`);
    console.log(response?.data?.data);
    setDepartments(response?.data?.data?.data);
    setTotalRows(response?.data?.data?.totalItems);
    // Simulate API call
    // setTimeout(() => {
    //   setDepartments(
    //     dummyDepartments.slice(
    //       page * rowsPerPage,
    //       page * rowsPerPage + rowsPerPage
    //     )
    //   );
    //   setLoading(false);
    // }, 1000); // Simulate a network delay
  };


  useEffect(() => {
    
    fetchDepartments();
  }, [page]);

  const handleChangePage = (event, newPage) => {
    console.log('event',event);
    console.log(newPage);
    setPage(newPage);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed">
        <Toolbar className="flex flex-row justify-between items-center">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleSidebarToggle}
          >
            <FiMenu />
          </IconButton>
          <ButtonBox
            label={"Logout"}
            color="danger"
            variant="contined"
            onClick={handleLogout}
          />
        </Toolbar>
      </AppBar>
      <Sidebar open={sidebarOpen} onClose={handleSidebarToggle} />

      {role === "Manager" ? (
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h4">Departments</Typography>
            <Button variant="contained" onClick={() => handleOpenDialog("add")}>
              Add Department
            </Button>
          </Box>

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            {loading ? (
              <CircularProgress
                sx={{ display: "block", margin: "auto", padding: 2 }}
              />
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Department Name</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Salary</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {departments?.map((department) => (
                        <TableRow key={department.id}>
                          <TableCell>{department.departmentName}</TableCell>
                          <TableCell>{department.categoryName}</TableCell>
                          <TableCell>{department.location}</TableCell>
                          <TableCell>{department.salary}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() =>
                                handleOpenDialog("edit", department)
                              }
                            >
                              Edit
                            </Button>
                            <Button variant="outlined" color="error">
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {departments?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography>No departments available</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Pagination
                  count={Math.ceil(totalRows / rowsPerPage)}
                  page={page}
                  onChange={handleChangePage}
                  sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                />
              </>
            )}
          </Paper>

          {/* Add/Edit Department Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>
              {dialogMode === "add" ? "Add Department" : "Edit Department"}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Department Name"
                type="text"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                label="Category"
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                label="Location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                label="Salary"
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                fullWidth
                variant="standard"
              />
              <Button
                onClick={handleOpenAssignDialog}
                variant="contained"
                sx={{ mt: 2 }}
              >
                Assign Employees
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSave}>
                {dialogMode === "add" ? "Save" : "Update"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Assign Employees Dialog */}
          <Dialog
            open={openAssignDialog}
            onClose={handleCloseAssignDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Assign Employees</DialogTitle>
            <DialogContent sx={{ height: "400px", overflowY: "auto" }}>
              {dummyEmployees.map((employee) => (
                <Box
                  key={employee.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography>{employee.name}</Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedEmployees.includes(employee.id)}
                        value={employee.id}
                        onChange={handleEmployeeChange}
                      />
                    }
                    label=""
                  />
                </Box>
              ))}
            </DialogContent>
            <DialogActions
              sx={{
                position: "sticky",
                bottom: 0,
                backgroundColor: "#fff",
                padding: 2,
              }}
            >
              <Button onClick={handleCloseAssignDialog}>Cancel</Button>
              <Button onClick={handleAssignSubmit}>Submit</Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : (
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Typography variant="h4">Employees</Typography>
          {loading ? (
            <CircularProgress
              sx={{ display: "block", margin: "auto", padding: 2 }}
            />
          ) : (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Assigned Department</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.length > 0 ? (
                      employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>{employee.name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.role}</TableCell>
                          <TableCell>
                            {employee.department
                              ? employee.department.name
                              : "None"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography>No employees available</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
