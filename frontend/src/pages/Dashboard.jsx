import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FiMenu } from "react-icons/fi";

import Card from "@mui/material/Card";

import CardContent from "@mui/material/CardContent";

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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import Cookies from "js-cookie";
import ButtonBox from "../components/Button";
import api from "../utils/apiInterceptor";
import { endPoints } from "../utils/endpoints";

const Dashboard = () => {
  const userRole = Cookies.get("role");
  const id = Cookies.get("id");
  const [role, setRole] = useState(userRole);
  const [userid, setUserId] = useState(id);
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // 'add' or 'edit'
  const [empdetail, setEmpDetail] = useState();
  const [formData, setFormData] = useState({
    departmentName: "",
    categoryName: "",
    location: "",
    salary: "",
  });
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await api.get(endPoints.allEmployees);

      setEmployees(response?.data?.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchEmpDetail = async () => {
    try {
      const response = await api.get(`${endPoints.allEmployees}?id=${userid}`);

      setEmpDetail(response?.data?.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchEmpDetail();
    fetchEmployees();
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOpenDialog = (mode = "add", department = null) => {
    setDialogMode(mode);
    let assignEmp = department?.Users?.map((e) => e.id);
    setOpenDialog(true);

    if (department) {
      setSelectedDepartmentId(department.id);
      setFormData({
        departmentName: department.departmentName,
        categoryName: department.categoryName,
        location: department.location,
        salary: department.salary,
      });
      setAssignedEmployees(assignEmp);
      setSelectedEmployees(assignEmp);
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

  const handleSave = async () => {
    if (dialogMode === "add") {
      try {
        const crDepartment = await api.post(
          `${endPoints.createDept}`,
          {
            departmentName: formData?.departmentName,
            categoryName: formData?.categoryName,
            location: formData?.location,
            salary: formData?.salary,
            managerId : userid
          }
        );

        if (crDepartment?.data?.statusCode == 200 || 201) {
          fetchDepartments();
          alert("Department Created Successfully");
        }
      } catch (error) {
        console.log("error::", error);
      }
    } else if (dialogMode === "edit" && selectedDepartmentId) {
      try {
        const uptDepartment = await api.put(
          `${endPoints.updateDept}?departmentId=${selectedDepartmentId}`,
          {
            departmentName: formData?.departmentName,
            categoryName: formData?.categoryName,
            location: formData?.location,
            salary: formData?.salary,
            employeeIds: selectedEmployees,
          }
        );

        if (uptDepartment?.data?.statusCode == 200) {
          fetchDepartments();
          alert("Department Updated Successfully");
        }
      } catch (error) {
        console.log("error::", error);
      }
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
    const employeeId = parseInt(value, 10); // Ensure the value is a number

    setSelectedEmployees((prev) =>
      checked ? [...prev, employeeId] : prev.filter((id) => id !== employeeId)
    );
  };

  const handleAssignSubmit = () => {
    setOpenAssignDialog(false);
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    navigate("/");
  };

  const fetchDepartments = async () => {
    setLoading(true);
    const response = await api.get(
      `${endPoints.allDepartments}?page=${page}&limit=${rowsPerPage}`
    );

    setDepartments(response?.data?.data?.data);
    setTotalRows(response?.data?.data?.totalItems);
    setLoading(false);
  };

  useEffect(() => {
    fetchDepartments();
  }, [page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDelete = async (id) => {
    try {
      const data = await api.delete(
        `${endPoints.deleteDept}?departmentId=${id}`
      );

      if (data?.data?.statusCode == 200) {
        alert("department deleted");
        setTimeout(() => {
          fetchDepartments();
        }, 500);
      }
    } catch (error) {
      console.log("data");
    }
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
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleDelete(department.id)}
                            >
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
               <FormControl fullWidth margin="dense" variant="standard">
        <InputLabel>Category</InputLabel>
        <Select
          name="categoryName"
          value={formData.categoryName}
          onChange={handleChange}
          label="Category"
        >
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="IT">IT</MenuItem>
          <MenuItem value="Sales">Sales</MenuItem>
          <MenuItem value="Product">Product</MenuItem>
          <MenuItem value="Marketing">Marketing</MenuItem>
        </Select>
      </FormControl>
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
              {employees.map((emp) => (
                <Box
                  key={emp.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography>
                    {emp?.firstName} {emp?.lastName}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedEmployees.includes(emp.id)}
                        value={emp.id} // Ensure this is a number
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
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 24 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {empdetail?.firstName} {empdetail?.lastName}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {empdetail?.email}
                    {/* be{bull}nev{bull}o{bull}lent */}
                  </Typography>
                  <table>
                    <thead>
                      <tr>
                        <th>Department Name</th>
                        <th>Catergory</th>
                        <th>Location</th>
                        <th>Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empdetail?.Departments?.map((e) => {
                        return (
                          <>
                            <tr>
                              <td>{e.departmentName}</td>
                              <td>{e.categoryName}</td>
                              <td>{e.location}</td>
                              <td>{e.salary}</td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
