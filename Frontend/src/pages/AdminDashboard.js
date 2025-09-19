import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Container,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Fab,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  VerifiedUser as VerifiedIcon,
  PendingActions as PendingIcon,
} from "@mui/icons-material";
import {
  Dashboard as DashboardIcon,
  Assignment as RequestIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  Visibility,
  Star as StarIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";
import RequestManagement from "../components/RequestManagement";
import axios from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import StatCard from "../components/StatCard";
import AdminUserComplatedRequestList from "./Admin/AdminUserComplatedRequestList";
import { AdminUserPendingRequestList } from "./Admin/AdminUserPendingRequestList";
import ProPlanSection from "../components/ProPlanSection";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [adminRequest, setAdminRequest] = useState(null);
  const [totalAdminRequest, setTotalAdminRequest] = useState([]);
  const [totalUserPendingRequest, setTotalUserPendingRequest] = useState([]);
  const [totalUserCompletedRequest, setTotalUserCompletedRequest] = useState(
    []
  );
  const [userApprovedRequest, setUserApprovedRequest] = useState(0);
  const [statusFilter, setStatusFilter] = useState(null);
  console.log(totalUserCompletedRequest, "completed request");
  console.log("pending request", totalUserPendingRequest);

  console.log("AdminDashboard rendered", totalAdminRequest);
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isUpSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const { user } = useAuth();
  // Handle state from navigation (e.g., from notifications)
  useEffect(() => {
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
      if (!sidebarOpen) toggleSidebar();
      // Clear the state to prevent it from persisting
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, sidebarOpen, toggleSidebar, navigate, location.pathname]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError("");
        let res;
        if (user?.role === "user") {
          res = await axios.get("/api/user-requests/user-requests");
        } else if (user?.role === "admin") {
          res = await axios.get("/api/user-requests/admin-requests");
        }
        setTotalAdminRequest(Array.isArray(res?.data) ? res.data : []);
        setTotalUserPendingRequest(
          Array.isArray(res?.data)
            ? res.data.filter((req) => req.status === "pending")
            : []
        );
        setTotalUserCompletedRequest(
          Array.isArray(res?.data)
            ? res.data.filter((req) => req.status === "completed")
            : []
        );
        setUserApprovedRequest(
          res?.data?.filter((req) => req.status === "approved")
        );
      } catch (err) {
        setError("Failed to fetch requests.");
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "user" || user?.role === "admin") fetchRequests();
  }, [user]);
  console.log("total pending request", totalUserPendingRequest);
  const fetchAdmin = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/admin/profile");
      setAdmin(res.data);
    } catch (err) {
      console.error("Error loading profile:", err);
      if (err.response?.status === 403) {
        navigate("/admin-form");
        return;
      }
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, [navigate]);

  // Ensure sidebar is open and requests section is active if path is /requests
  useEffect(() => {
    if (location.pathname === "/requests") {
      if (!sidebarOpen) toggleSidebar();
      setActiveSection("requests");
    }
  }, [location.pathname, sidebarOpen, toggleSidebar]);

  // Sidebar items
  const sidebarItems = [
    { id: "dashboard", text: "Dashboard", icon: <DashboardIcon /> },
    { id: "requests", text: "Requests", icon: <RequestIcon /> },
    {
      id: "Complated Requests",
      text: "Completed Requests",
      icon: <VerifiedIcon />,
    },
    { id: "Pending Requests", text: "Pending Requests", icon: <PendingIcon /> },
    // Pro Plan menu item
    {
      id: "pro-plan",
      text: "Subscribe Plan",
      icon: <StarIcon color="warning" />,
    },
  ];

  // Section header text
  const sectionTitle =
    sidebarItems.find((item) => item.id === activeSection)?.text || "Dashboard";

  // Section content
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Box
            sx={{
              mt: 3,
              mb: 4,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Dashboard Summary Section */}
            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                background: "linear-gradient(135deg, #ffffff, #f5f5f5)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                >
                  Dashboard Overview
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={`Last updated: ${new Date().toLocaleTimeString()}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      setLoading(true);
                      // Fetch requests again
                      const fetchRequests = async () => {
                        try {
                          let res;
                          if (user?.role === "user") {
                            res = await axios.get(
                              "/api/user-requests/user-requests"
                            );
                          } else if (user?.role === "admin") {
                            res = await axios.get(
                              "/api/user-requests/admin-requests"
                            );
                          }
                          setTotalAdminRequest(
                            Array.isArray(res?.data) ? res.data : []
                          );
                          setTotalUserPendingRequest(
                            Array.isArray(res?.data)
                              ? res.data.filter(
                                  (req) => req.status === "pending"
                                )
                              : []
                          );
                          setTotalUserCompletedRequest(
                            Array.isArray(res?.data)
                              ? res.data.filter(
                                  (req) => req.status === "completed"
                                )
                              : []
                          );
                          setUserApprovedRequest(
                            res?.data?.filter(
                              (req) => req.status === "approved"
                            )
                          );
                        } catch (err) {
                          setError("Failed to refresh data.");
                        } finally {
                          setLoading(false);
                        }
                      };
                      if (user?.role === "user" || user?.role === "admin")
                        fetchRequests();
                    }}
                    sx={{ ml: 1 }}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  color: "text.secondary",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Welcome back! Here's a summary of all service requests and their
                current status. You have
                <Box
                  component="span"
                  sx={{ fontWeight: "bold", color: theme.palette.warning.main }}
                >
                  {" "}
                  {loading ? "..." : totalUserPendingRequest.length} pending
                </Box>{" "}
                and
                <Box
                  component="span"
                  sx={{ fontWeight: "bold", color: theme.palette.success.main }}
                >
                  {" "}
                  {loading ? "..." : totalUserCompletedRequest.length} completed
                </Box>{" "}
                requests.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: { xs: 0.5, sm: 1 },
                }}
              >
                <Chip
                  size="small"
                  label={`Total: ${loading ? "..." : totalAdminRequest.length}`}
                  color="default"
                  sx={{
                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                    height: { xs: 24, sm: 32 },
                    m: 0.5,
                  }}
                />
                <Chip
                  size="small"
                  label={`Pending: ${loading ? "..." : totalUserPendingRequest.length}`}
                  color="warning"
                  sx={{
                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                    height: { xs: 24, sm: 32 },
                    m: 0.5,
                  }}
                />
                <Chip
                  size="small"
                  label={`In Progress: ${loading ? "..." : totalAdminRequest.filter((req) => req.status === "in_progress").length}`}
                  color="info"
                  sx={{
                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                    height: { xs: 24, sm: 32 },
                    m: 0.5,
                    display: { xs: "none", md: "flex" },
                  }}
                />
                <Chip
                  size="small"
                  label={`Completed: ${loading ? "..." : totalUserCompletedRequest.length}`}
                  color="success"
                  sx={{
                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                    height: { xs: 24, sm: 32 },
                    m: 0.5,
                  }}
                />
                <Chip
                  size="small"
                  label={`Approved: ${loading ? "..." : userApprovedRequest.length}`}
                  color="primary"
                  sx={{
                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                    height: { xs: 24, sm: 32 },
                    m: 0.5,
                    display: { xs: "none", md: "flex" },
                  }}
                />
                <Chip
                  size="small"
                  label={`Rejected: ${loading ? "..." : totalAdminRequest.filter((req) => req.status === "rejected").length}`}
                  color="error"
                  sx={{
                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                    height: { xs: 24, sm: 32 },
                    m: 0.5,
                    display: { xs: "none", md: "flex" },
                  }}
                />
              </Box>
            </Paper>

            {/* Stats Cards Row */}
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total User Requests"
                  value={loading ? "" : totalAdminRequest.length}
                  icon={<RequestIcon sx={{ color: "#673AB7" }} />}
                  color="#673AB7"
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Pending Requests"
                  value={loading ? "" : totalUserPendingRequest.length}
                  icon={<PendingIcon sx={{ color: "#FF9800" }} />}
                  color="#FF9800"
                  loading={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={() => setActiveSection("Complated Requests")}
                >
                  <StatCard
                    title="Completed Requests"
                    value={loading ? "" : totalUserCompletedRequest.length}
                    icon={<VerifiedIcon sx={{ color: "#4CAF50" }} />}
                    color="#4CAF50"
                    loading={loading}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Approved Requests"
                  value={loading ? "" : userApprovedRequest.length}
                  icon={<VerifiedIcon sx={{ color: "#2196F3" }} />}
                  color="#2196F3"
                  loading={loading}
                />
              </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mt: 2 }} display="block">
              {/* Request Status Distribution (Pie Chart) */}
              <Grid item xs={12} md={6} lg={4} paddingBottom={5}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: 400, // fixed height
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
                    boxShadow: "0 4px 24px 0 rgba(60,72,100,0.08)",
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      Request Status Distribution
                    </Typography>
                    <Chip
                      label={`Last updated: ${new Date().toLocaleTimeString()}`}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ height: "85%" }}>
                    {loading ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                      >
                        <CircularProgress size={40} />
                      </Box>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Pending",
                                value: totalUserPendingRequest.length,
                                fill: "#FF9800",
                              },
                              {
                                name: "Completed",
                                value: totalUserCompletedRequest.length,
                                fill: "#4CAF50",
                              },
                              {
                                name: "Approved",
                                value: userApprovedRequest.length,
                                fill: "#2196F3",
                              },
                              {
                                name: "In Progress",
                                value: totalAdminRequest.filter(
                                  (req) => req.status === "in_progress"
                                ).length,
                                fill: "#9C27B0",
                              },
                              {
                                name: "Rejected",
                                value: totalAdminRequest.filter(
                                  (req) => req.status === "rejected"
                                ).length,
                                fill: "#F44336",
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius="80%"
                            dataKey="value"
                            label={({ name, percent }) =>
                              percent > 0.08
                                ? `${name}: ${(percent * 100).toFixed(0)}%`
                                : ""
                            }
                            isAnimationActive
                          >
                            {[
                              { fill: "#FF9800" },
                              { fill: "#4CAF50" },
                              { fill: "#2196F3" },
                              { fill: "#9C27B0" },
                              { fill: "#F44336" },
                            ].map((entry, idx) => (
                              <Cell key={idx} {...entry} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="middle"
                            wrapperStyle={{ fontSize: 13 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Request Status Breakdown (Bar Chart) */}
              <Grid item xs={12} md={6} lg={4} paddingBottom={5}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: 400,
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
                    boxShadow: "0 4px 24px 0 rgba(60,72,100,0.08)",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    mb={2}
                  >
                    Request Status Breakdown
                  </Typography>
                  <Box sx={{ height: "85%" }}>
                    {loading ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                      >
                        <CircularProgress size={40} />
                      </Box>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              name: "Pending",
                              value: totalUserPendingRequest.length,
                              fill: "#FF9800",
                            },
                            {
                              name: "In Progress",
                              value: totalAdminRequest.filter(
                                (req) => req.status === "in_progress"
                              ).length,
                              fill: "#9C27B0",
                            },
                            {
                              name: "Completed",
                              value: totalUserCompletedRequest.length,
                              fill: "#4CAF50",
                            },
                            {
                              name: "Approved",
                              value: userApprovedRequest.length,
                              fill: "#2196F3",
                            },
                            {
                              name: "Rejected",
                              value: totalAdminRequest.filter(
                                (req) => req.status === "rejected"
                              ).length,
                              fill: "#F44336",
                            },
                          ]}
                          margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
                          barSize={32}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: 13 }} />
                          <Bar
                            dataKey="value"
                            name="Requests"
                            isAnimationActive
                          >
                            {[
                              { fill: "#FF9800" },
                              { fill: "#9C27B0" },
                              { fill: "#4CAF50" },
                              { fill: "#2196F3" },
                              { fill: "#F44336" },
                            ].map((entry, idx) => (
                              <Cell key={idx} {...entry} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Request Timeline (Vertical Bar Chart) */}
              <Grid item xs={12} md={12} lg={4}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: 600,
                    width: "100%",
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
                    boxShadow: "0 4px 24px 0 rgba(60,72,100,0.08)",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    mb={2}
                  >
                    Request Timeline
                  </Typography>
                  <Box sx={{ height: "85%" }}>
                    {loading ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                      >
                        <CircularProgress size={40} />
                      </Box>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={[
                            {
                              name: "Last 24 Hours",
                              value: totalAdminRequest.filter(
                                (req) =>
                                  new Date(req.createdAt) >
                                  new Date(Date.now() - 24 * 60 * 60 * 1000)
                              ).length,
                              fill: "#2196F3",
                            },
                            {
                              name: "Last Week",
                              value: totalAdminRequest.filter(
                                (req) =>
                                  new Date(req.createdAt) >
                                  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                              ).length,
                              fill: "#4CAF50",
                            },
                            {
                              name: "Last Month",
                              value: totalAdminRequest.filter(
                                (req) =>
                                  new Date(req.createdAt) >
                                  new Date(
                                    Date.now() - 30 * 24 * 60 * 60 * 1000
                                  )
                              ).length,
                              fill: "#FF9800",
                            },
                            {
                              name: "All Time",
                              value: totalAdminRequest.length,
                              fill: "#9C27B0",
                            },
                          ]}
                          margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
                          barSize={28}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: 13 }} />
                          <Bar
                            dataKey="value"
                            name="Requests"
                            isAnimationActive
                          >
                            {[
                              { fill: "#2196F3" },
                              { fill: "#4CAF50" },
                              { fill: "#FF9800" },
                              { fill: "#9C27B0" },
                            ].map((entry, idx) => (
                              <Cell key={idx} {...entry} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Recent Requests Table */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                background: "linear-gradient(135deg, #ffffff, #f5f5f5)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                >
                  Recent Requests
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: { xs: 0.5, sm: 1 },
                    alignItems: "center",
                  }}
                >
                  <FilterListIcon
                    fontSize="small"
                    color="action"
                    sx={{ mr: 1 }}
                  />
                  <Button
                    size="small"
                    variant={!statusFilter ? "contained" : "outlined"}
                    onClick={() => setStatusFilter(null)}
                    title="Show all requests"
                    sx={{
                      fontSize: { xs: "0.7rem", sm: "0.8rem" },
                      py: { xs: 0.5, sm: 0.75 },
                      px: { xs: 1, sm: 2 },
                    }}
                  >
                    All
                  </Button>
                  <Button
                    size="small"
                    variant={
                      statusFilter === "pending" ? "contained" : "outlined"
                    }
                    color="warning"
                    onClick={() => setStatusFilter("pending")}
                    title="Show only pending requests"
                    sx={{
                      fontSize: { xs: "0.7rem", sm: "0.8rem" },
                      py: { xs: 0.5, sm: 0.75 },
                      px: { xs: 1, sm: 2 },
                    }}
                  >
                    Pending
                    {totalAdminRequest.filter((req) => req.status === "pending")
                      .length > 0 && (
                      <Box
                        component="span"
                        sx={{
                          ml: 0.5,
                          fontSize: { xs: "0.65rem", sm: "0.75rem" },
                          bgcolor: "warning.main",
                          color: "white",
                          borderRadius: "50%",
                          width: { xs: 16, sm: 18 },
                          height: { xs: 16, sm: 18 },
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {
                          totalAdminRequest.filter(
                            (req) => req.status === "pending"
                          ).length
                        }
                      </Box>
                    )}
                  </Button>
                  <Button
                    size="small"
                    variant={
                      statusFilter === "in_progress" ? "contained" : "outlined"
                    }
                    color="info"
                    onClick={() => setStatusFilter("in_progress")}
                    title="Show only in-progress requests"
                    sx={{
                      fontSize: { xs: "0.7rem", sm: "0.8rem" },
                      py: { xs: 0.5, sm: 0.75 },
                      px: { xs: 1, sm: 2 },
                    }}
                  >
                    {isSmallScreen ? "In Prog." : "In Progress"}
                    {totalAdminRequest.filter(
                      (req) => req.status === "in_progress"
                    ).length > 0 && (
                      <Box
                        component="span"
                        sx={{
                          ml: 0.5,
                          fontSize: { xs: "0.65rem", sm: "0.75rem" },
                          bgcolor: "info.main",
                          color: "white",
                          borderRadius: "50%",
                          width: { xs: 16, sm: 18 },
                          height: { xs: 16, sm: 18 },
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {
                          totalAdminRequest.filter(
                            (req) => req.status === "in_progress"
                          ).length
                        }
                      </Box>
                    )}
                  </Button>
                  <Button
                    size="small"
                    variant={
                      statusFilter === "completed" ? "contained" : "outlined"
                    }
                    color="success"
                    onClick={() => setStatusFilter("completed")}
                    title="Show only completed requests"
                    sx={{
                      fontSize: { xs: "0.7rem", sm: "0.8rem" },
                      py: { xs: 0.5, sm: 0.75 },
                      px: { xs: 1, sm: 2 },
                    }}
                  >
                    Completed
                    {totalAdminRequest.filter(
                      (req) => req.status === "completed"
                    ).length > 0 && (
                      <Box
                        component="span"
                        sx={{
                          ml: 0.5,
                          fontSize: { xs: "0.65rem", sm: "0.75rem" },
                          bgcolor: "success.main",
                          color: "white",
                          borderRadius: "50%",
                          width: { xs: 16, sm: 18 },
                          height: { xs: 16, sm: 18 },
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {
                          totalAdminRequest.filter(
                            (req) => req.status === "completed"
                          ).length
                        }
                      </Box>
                    )}
                  </Button>
                </Box>
              </Box>
              {loading ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  p={4}
                >
                  <CircularProgress size={40} />
                </Box>
              ) : totalAdminRequest.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No requests found.
                </Alert>
              ) : totalAdminRequest.filter((request) =>
                  statusFilter ? request.status === statusFilter : true
                ).length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No {statusFilter} requests found.{" "}
                  <Button size="small" onClick={() => setStatusFilter(null)}>
                    View all requests
                  </Button>
                </Alert>
              ) : (
                <TableContainer
                  component={Paper}
                  sx={{ mt: 2, boxShadow: "none", overflowX: "auto" }}
                >
                  <Table sx={{ minWidth: { xs: 300, sm: 500, md: 650 } }}>
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: theme.palette.primary.main }}
                      >
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            padding: { xs: 1, sm: 2 },
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          User
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            padding: { xs: 1, sm: 2 },
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            display: { xs: "none", sm: "table-cell" },
                          }}
                        >
                          Service Details
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            padding: { xs: 1, sm: 2 },
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            display: { xs: "none", md: "table-cell" },
                          }}
                        >
                          Request Date
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            padding: { xs: 1, sm: 2 },
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            padding: { xs: 1, sm: 2 },
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {totalAdminRequest
                        .filter((request) =>
                          statusFilter ? request.status === statusFilter : true
                        )
                        .slice(0, 5)
                        .map((request) => (
                          <TableRow
                            key={request._id}
                            hover
                            sx={{
                              "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                              },
                            }}
                          >
                            <TableCell sx={{ padding: { xs: 1, sm: 2 } }}>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Box
                                  sx={{
                                    width: { xs: 28, sm: 35 },
                                    height: { xs: 28, sm: 35 },
                                    borderRadius: "50%",
                                    bgcolor: theme.palette.primary.light,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontWeight: "bold",
                                    mr: 1,
                                    fontSize: { xs: "0.7rem", sm: "0.875rem" },
                                  }}
                                >
                                  {(
                                    request.user?.name?.charAt(0) ||
                                    request.userName?.charAt(0) ||
                                    "U"
                                  ).toUpperCase()}
                                </Box>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: "medium",
                                      fontSize: {
                                        xs: "0.7rem",
                                        sm: "0.875rem",
                                      },
                                    }}
                                  >
                                    {request.user?.name ||
                                      request.userName ||
                                      "Unknown User"}
                                  </Typography>
                                  {request.user?.email && (
                                    <Typography
                                      variant="caption"
                                      display="block"
                                      color="text.secondary"
                                      sx={{
                                        fontSize: {
                                          xs: "0.6rem",
                                          sm: "0.75rem",
                                        },
                                      }}
                                    >
                                      {request.user.email}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: { xs: 1, sm: 2 },
                                display: { xs: "none", sm: "table-cell" },
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: { xs: "0.7rem", sm: "0.875rem" },
                                }}
                              >
                                {request.title ||
                                  request.serviceType ||
                                  "General Service"}
                              </Typography>
                              {request.description && (
                                <Typography
                                  variant="caption"
                                  display="block"
                                  color="text.secondary"
                                  sx={{
                                    maxWidth: { xs: 100, sm: 200 },
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    fontSize: { xs: "0.6rem", sm: "0.75rem" },
                                  }}
                                >
                                  {request.description}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: { xs: 1, sm: 2 },
                                display: { xs: "none", md: "table-cell" },
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: { xs: "0.7rem", sm: "0.875rem" },
                                }}
                              >
                                {new Date(
                                  request.createdAt
                                ).toLocaleDateString()}
                              </Typography>
                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                                sx={{
                                  fontSize: { xs: "0.6rem", sm: "0.75rem" },
                                }}
                              >
                                {new Date(request.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ padding: { xs: 1, sm: 2 } }}>
                              <Chip
                                label={
                                  request.status.charAt(0).toUpperCase() +
                                  request.status.slice(1).replace("_", " ")
                                }
                                size="small"
                                sx={{
                                  fontWeight: "medium",
                                  minWidth: { xs: 65, sm: 85 },
                                  height: { xs: 22, sm: 28 },
                                  textAlign: "center",
                                  fontSize: { xs: "0.6rem", sm: "0.75rem" },
                                }}
                                color={
                                  request.status === "completed"
                                    ? "success"
                                    : request.status === "pending"
                                      ? "warning"
                                      : request.status === "approved"
                                        ? "primary"
                                        : request.status === "in_progress"
                                          ? "info"
                                          : request.status === "rejected"
                                            ? "error"
                                            : "default"
                                }
                              />
                            </TableCell>
                            <TableCell sx={{ padding: { xs: 1, sm: 2 } }}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={
                                  <Visibility
                                    sx={{
                                      fontSize: { xs: "0.8rem", sm: "1rem" },
                                    }}
                                  />
                                }
                                onClick={() => {
                                  setActiveSection("requests");
                                  // Store the selected request ID in sessionStorage for highlighting
                                  sessionStorage.setItem(
                                    "selectedRequestId",
                                    request._id
                                  );
                                }}
                                sx={{
                                  fontSize: { xs: "0.6rem", sm: "0.75rem" },
                                  padding: { xs: "1px 6px", sm: "4px 10px" },
                                  minWidth: { xs: 55, sm: 70 },
                                }}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {totalAdminRequest.filter((request) =>
                statusFilter ? request.status === statusFilter : true
              ).length > 5 && (
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="text"
                    onClick={() => {
                      setActiveSection("requests");
                      // Store the current filter in sessionStorage
                      if (statusFilter) {
                        sessionStorage.setItem(
                          "requestStatusFilter",
                          statusFilter
                        );
                      } else {
                        sessionStorage.removeItem("requestStatusFilter");
                      }
                    }}
                    endIcon={<ChevronRightIcon />}
                  >
                    View All{" "}
                    {statusFilter
                      ? statusFilter.charAt(0).toUpperCase() +
                        statusFilter.slice(1)
                      : ""}{" "}
                    Requests
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>
        );
      case "pro-plan":
        return <ProPlanSection />;
      case "requests":
        return <RequestManagement />;
      case "Complated Requests":
        return <AdminUserComplatedRequestList />;
      case "Pending Requests":
        return <AdminUserPendingRequestList />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", position: "relative" }}>
      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={sidebarOpen}
        onClose={isMobile ? toggleSidebar : toggleSidebar}
        sx={{
          width: sidebarOpen ? { xs: 200, sm: 240 } : { xs: 80, sm: 100 },
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? { xs: 200, sm: 240 } : { xs: 60, sm: 80 },
            overflowX: "hidden",
            transition: "width 0.2s ease-in-out",
            backgroundColor: theme.palette.primary.main,
            color: "white",
            borderRight: "none",
            boxShadow: theme.shadows[8],
            [theme.breakpoints.down("md")]: {
              width: { xs: 200, sm: 240 },
            },
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: "bold",
              opacity: sidebarOpen ? 1 : 0,
              transition: "opacity 0.2s ease-in-out",
              flexGrow: 1,
              textAlign: "center",
            }}
          >
            Admin
          </Typography>
          {!isMobile && (
            <Box
              sx={{
                position: "absolute",
                top: "4%", // Center vertically
                left: sidebarOpen ? "auto" : "50%", // Adjust depending on sidebar state
                right: sidebarOpen ? 0 : "auto", // Keep close icon inside open sidebar
                transform: sidebarOpen
                  ? "translateY(-50%)"
                  : "translate(-50%, -50%)", // Center when closed
                zIndex: 2000, // Ensure it’s above content
              }}
            >
              <IconButton
                onClick={toggleSidebar}
                sx={{
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.5)",
                  },
                }}
              >
                {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </Box>
          )}
        </Box>
        <List sx={{ mt: 1, px: { xs: 1, sm: 1.5 } }}>
          {sidebarItems.map((item) => (
            <ListItem
              button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (isMobile) {
                  toggleSidebar();
                }
              }}
              sx={{
                backgroundColor:
                  activeSection === item.id
                    ? "rgba(255,255,255,0.2)"
                    : "transparent",
                color: "white",
                mb: { xs: 0.5, sm: 1 },
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor:
                    activeSection === item.id
                      ? "rgba(255,255,255,0.3)"
                      : "rgba(255,255,255,0.1)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: { xs: 30, sm: 40 },
                  opacity: activeSection === item.id ? 1 : 0.8,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: sidebarOpen ? 1 : 0,
                  transition: "opacity 0.2s ease-in-out",
                  "& .MuiListItemText-primary": {
                    fontWeight: activeSection === item.id ? "bold" : "normal",
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: { xs: 1, sm: 2, md: 3 },
            backgroundColor: theme.palette.background.paper,
            borderRadius: { xs: 0, md: 2 },
            m: { xs: 0, md: 2 },
            boxShadow: theme.shadows[1],
          }}
        >
          {/* Section Header */}
          <Box
            sx={{
              mb: { xs: 2, sm: 3 },
              pb: { xs: 1, sm: 2 },
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Box
              sx={{
                width: { xs: 3, sm: 4 },
                height: { xs: 20, sm: 24 },
                backgroundColor: theme.palette.primary.main,
                borderRadius: 2,
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: theme.palette.primary.main,
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
              }}
            >
              {sectionTitle}
            </Typography>
          </Box>
          {renderContent()}
        </Box>
      </Box>
      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="toggle sidebar"
          onClick={toggleSidebar}
          size={isExtraSmallScreen ? "small" : "medium"}
          sx={{
            position: "fixed",
            bottom: { xs: 12, sm: 16 },
            left: { xs: 12, sm: 16 },
            zIndex: 1000,
            boxShadow: theme.shadows[8],
            "&:hover": {
              boxShadow: theme.shadows[12],
            },
          }}
        >
          {sidebarOpen ? (
            <ChevronLeftIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          ) : (
            <MenuIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          )}
        </Fab>
      )}
    </Box>
  );
};

export default AdminDashboard;
