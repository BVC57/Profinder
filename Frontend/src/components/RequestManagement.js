import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  CircularProgress,
  Grid,
  Avatar,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  InputAdornment,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Rating,
} from "@mui/material";
import {
  AccessTime,
  Work,
  LocationOn,
  Email,
  Done,
  HourglassEmpty,
  CheckCircle,
  Cancel,
  Search,
} from "@mui/icons-material";
import axios from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

const statusConfig = {
  pending: {
    color: "warning",
    label: "Pending",
    icon: <HourglassEmpty fontSize="small" />,
  },
  approved: {
    color: "info",
    label: "Approved",
    icon: <CheckCircle fontSize="small" />,
  },
  rejected: {
    color: "error",
    label: "Rejected",
    icon: <Cancel fontSize="small" />,
  },
  in_progress: {
    color: "primary",
    label: "In Progress",
    icon: <AccessTime fontSize="small" />,
  },
  completed: {
    color: "success",
    label: "Completed",
    icon: <Done fontSize="small" />,
  },
};

const RequestManagement = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Admin action dialog state
  const [actionDialog, setActionDialog] = useState({
    open: false,
    type: "",
    request: null,
  });
  const [actionForm, setActionForm] = useState({
    startDate: "",
    endDate: "",
    adminNotes: "",
    status: "",
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [rateDialog, setRateDialog] = useState({ open: false, request: null });
  const [userRating, setUserRating] = useState({ stars: 0, feedback: "" });
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState("");
  const [userRateDialog, setUserRateDialog] = useState({
    open: false,
    request: null,
  });
  const [adminRating, setAdminRating] = useState({ stars: 0, feedback: "" });
  const [userRateLoading, setUserRateLoading] = useState(false);
  const [userRateError, setUserRateError] = useState("");
  const [detailsDialog, setDetailsDialog] = useState({
    open: false,
    request: null,
  });

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
        setRequests(res?.data || []);
      } catch (err) {
        setError("Failed to fetch requests.");
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "user" || user?.role === "admin") fetchRequests();
  }, [user]);

  // 🔎 Filtered requests
  const filteredRequests = requests.filter((req) => {
    const titleMatch = req.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const dateMatch =
      req.createdAt &&
      new Date(req.createdAt)
        .toLocaleDateString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return titleMatch || dateMatch;
  });

  // Open dialog for approve/reject or status update
  const openActionDialog = (type, request) => {
    setActionForm({
      startDate: "",
      endDate: "",
      adminNotes: "",
      status: type === "status" ? "in_progress" : "",
    });
    setActionError("");
    setActionDialog({ open: true, type, request });
  };
  const closeActionDialog = () =>
    setActionDialog({ open: false, type: "", request: null });

  // Handle admin action (approve/reject/status)
  const handleActionSubmit = async () => {
    setActionLoading(true);
    setActionError("");
    try {
      if (actionDialog.type === "approve") {
        if (!actionForm.startDate || !actionForm.endDate) {
          setActionError("Start and end dates are required.");
          setActionLoading(false);
          return;
        }
        await axios.put(
          `/api/user-requests/admin-response/${actionDialog.request._id}`,
          {
            status: "approved",
            adminNotes: actionForm.adminNotes,
            startDate: actionForm.startDate,
            endDate: actionForm.endDate,
          }
        );
      } else if (actionDialog.type === "reject") {
        await axios.put(
          `/api/user-requests/admin-response/${actionDialog.request._id}`,
          {
            status: "rejected",
            adminNotes: actionForm.adminNotes,
          }
        );
      } else if (actionDialog.type === "status") {
        await axios.put(
          `/api/user-requests/update-status/${actionDialog.request._id}`,
          {
            status: actionForm.status,
            adminNotes: actionForm.adminNotes,
          }
        );
      }
      // Refresh requests
      const res = await axios.get("/api/user-requests/admin-requests");
      setRequests(res.data);
      closeActionDialog();
    } catch (err) {
      setActionError(err.response?.data?.message || "Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!requests.length) {
    return (
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {user?.role === "user"
            ? "You haven't made any requests yet."
            : "No incoming requests yet."}
        </Typography>
        {user?.role === "user" && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start by searching for professionals and requesting their services.
          </Typography>
        )}
        {user?.role === "admin" && (
          <Typography variant="body1" color="text.secondary">
            When users request your services, they will appear here.
          </Typography>
        )}
      </Box>
    );
  }

  // USER VIEW
  if (user?.role === "user") {
    return (
      <Box>
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: "bold",
            textalign: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {user?.name} Your Requests
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            fontWeight: "bold",
            textalign: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          All the requests you have sent to admins are listed below.
        </Typography>

        {/* 🔎 Search Box */}
        <Box display="flex" justifyContent="center" mb={3}>
          {/* 🔍 Search box */}
          <TextField
            placeholder="Search by title or date (dd/mm/yyyy)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              mb: 3,
              width: "22%",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Request Cards */}
        <Grid container spacing={3}>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => {
              const status = statusConfig[req.status] || {
                color: "default",
                label: req.status,
              };
              const adminName =
                req.admin?.userId?.name || req.admin?.name || "Admin";
              const showRateButton =
                req.status === "completed" &&
                (!req.userRating || !req.userRating.stars);

              return (
                <Grid item xs={12} sm={6} md={4} key={req._id} display="flex">
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      minHeight: 340,
                    }}
                    onClick={() =>
                      setDetailsDialog({ open: true, request: req })
                    }
                  >
                    {/* Header */}
                    <Box sx={{ position: "relative", mb: 1 }}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid
                          item
                          xs={2}
                          display="flex"
                          justifyContent="center"
                        >
                          <Avatar
                            sx={{ bgcolor: "primary.main", fontWeight: "bold" }}
                          >
                            {adminName.charAt(0).toUpperCase()}
                          </Avatar>
                        </Grid>
                        <Grid item xs={10} zeroMinWidth>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              fontSize: 18,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {req.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {adminName}{" "}
                            {req.admin?.profession &&
                              `(${req.admin?.profession})`}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Chip
                        label={status.label}
                        color={status.color}
                        icon={status.icon}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          height: 28,
                          minWidth: 70,
                          borderRadius: 2,
                          fontWeight: "bold",
                          fontSize: 12,
                        }}
                      />
                    </Box>

                    {/* Admin info */}
                    {(req.admin?.profession ||
                      req.admin?.city ||
                      req.admin?.pincode) && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {req.admin?.profession && (
                          <>
                            <Work
                              sx={{
                                fontSize: 18,
                                mr: 0.5,
                                verticalAlign: "middle",
                              }}
                            />{" "}
                            {req.admin?.profession}
                          </>
                        )}
                        {(req.admin?.city || req.admin?.pincode) && (
                          <>
                            <LocationOn
                              sx={{
                                fontSize: 18,
                                ml: 2,
                                mr: 0.5,
                                verticalAlign: "middle",
                              }}
                            />{" "}
                            {req.admin?.city}
                            {req.admin?.pincode
                              ? `, ${req.admin?.pincode}`
                              : ""}
                          </>
                        )}
                      </Typography>
                    )}

                    {/* Description */}
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {req.description}
                    </Typography>

                    {/* Timeline */}
                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      {req.timeline?.estimatedDays && (
                        <Grid item>
                          <Chip
                            icon={<AccessTime />}
                            label={`Estimated: ${req.timeline.estimatedDays} days`}
                            size="small"
                            sx={{ minWidth: 140 }}
                          />
                        </Grid>
                      )}
                      <Grid item>
                        <Chip
                          icon={<AccessTime />}
                          label={`Start: ${
                            req.timeline?.startDate
                              ? new Date(
                                  req.timeline.startDate
                                ).toLocaleDateString()
                              : "Not provided"
                          }`}
                          size="small"
                          sx={{ minWidth: 140 }}
                        />
                      </Grid>
                      <Grid item>
                        <Chip
                          icon={<AccessTime />}
                          label={`End: ${
                            req.timeline?.endDate
                              ? new Date(
                                  req.timeline.endDate
                                ).toLocaleDateString()
                              : "Not provided"
                          }`}
                          size="small"
                          sx={{ minWidth: 140 }}
                        />
                      </Grid>
                    </Grid>

                    {/* Notes */}
                    {req.adminNotes && (
                      <Alert
                        severity="info"
                        sx={{ mb: 1, maxHeight: 48, overflow: "hidden" }}
                      >
                        <strong>Admin Notes:</strong> {req.adminNotes}
                      </Alert>
                    )}

                    {/* Date */}
                    <Typography variant="caption" color="text.secondary">
                      Requested on{" "}
                      {new Date(req.createdAt).toLocaleDateString()}
                    </Typography>

                    {/* Rate button */}
                    <Box sx={{ mt: 2, width: "100%" }}>
                      {showRateButton ? (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            width: "100%",
                            fontWeight: "bold",
                            fontSize: 16,
                            py: 1.2,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserRateDialog({ open: true, request: req });
                          }}
                        >
                          Rate Admin
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            width: "100%",
                            fontWeight: "bold",
                            fontSize: 16,
                            py: 1.2,
                            visibility: "hidden",
                          }}
                          disabled
                        >
                          Rate Admin
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              );
            })
          ) : (
            <Typography sx={{ m: 3 }}>No requests found</Typography>
          )}
        </Grid>

        {/* User rates admin dialog */}
        <Dialog
          open={userRateDialog.open}
          onClose={() => setUserRateDialog({ open: false, request: null })}
        >
          <DialogTitle>Rate the Admin</DialogTitle>
          <DialogContent>
            {userRateError && <Alert severity="error">{userRateError}</Alert>}
            <Box sx={{ my: 2 }}>
              <Typography>
                How would you rate your experience with this admin?
              </Typography>
              <Rating
                value={adminRating.stars}
                onChange={(e, newValue) =>
                  setAdminRating((r) => ({ ...r, stars: newValue }))
                }
              />
              <TextField
                label="Feedback (optional)"
                fullWidth
                multiline
                minRows={2}
                value={adminRating.feedback}
                onChange={(e) =>
                  setAdminRating((r) => ({ ...r, feedback: e.target.value }))
                }
                sx={{ mt: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setUserRateDialog({ open: false, request: null })}
              disabled={userRateLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setUserRateLoading(true);
                setUserRateError("");
                try {
                  await axios.post(
                    `/api/user-requests/${userRateDialog.request._id}/rate-admin`,
                    {
                      stars: adminRating.stars,
                      feedback: adminRating.feedback,
                    }
                  );
                  // Refresh requests
                  const res = await axios.get(
                    "/api/user-requests/user-requests"
                  );
                  setRequests(res.data);
                  setUserRateDialog({ open: false, request: null });
                  setAdminRating({ stars: 0, feedback: "" });
                } catch (err) {
                  setUserRateError(
                    "Failed to submit rating. Please try again."
                  );
                } finally {
                  setUserRateLoading(false);
                }
              }}
              variant="contained"
              disabled={userRateLoading || !adminRating.stars}
            >
              {userRateLoading ? "Submitting..." : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
        {/* User request details dialog */}
        <Dialog
          open={detailsDialog.open}
          onClose={() => setDetailsDialog({ open: false, request: null })}
          maxWidth="sm"
          fullWidth
        >
          {detailsDialog.request && (
            <Box
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                p: 3,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  fontWeight: "bold",
                  fontSize: 28,
                  bgcolor: "white",
                  color: "primary.main",
                }}
              >
                {detailsDialog.request.admin?.name?.charAt(0)?.toUpperCase() ||
                  "A"}
              </Avatar>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  {detailsDialog.request.admin?.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "white", opacity: 0.85 }}
                >
                  {detailsDialog.request.admin?.profession}
                </Typography>
              </Box>
            </Box>
          )}
          <DialogTitle sx={{ pb: 0, fontWeight: "bold", fontSize: 22 }}>
            Request Details
          </DialogTitle>
          <DialogContent>
            {detailsDialog.request && (
              <Box sx={{ my: 1 }}>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    <LocationOn
                      sx={{ fontSize: 18, mr: 0.5, verticalAlign: "middle" }}
                    />
                    {detailsDialog.request.admin?.city},{" "}
                    {detailsDialog.request.admin?.pincode}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mt: 1 }}
                  >
                    {detailsDialog.request.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {detailsDialog.request.description}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Chip
                      label={`Status: ${detailsDialog.request.status}`}
                      color={
                        statusConfig[detailsDialog.request.status]?.color ||
                        "default"
                      }
                    />
                    <Chip
                      icon={<AccessTime />}
                      label={`Estimated: ${detailsDialog.request.timeline?.estimatedDays} days`}
                      size="small"
                    />
                  </Stack>
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Chip
                      icon={<AccessTime />}
                      label={`Start: ${detailsDialog.request.timeline?.startDate ? new Date(detailsDialog.request.timeline.startDate).toLocaleDateString() : "-"}`}
                      size="small"
                    />
                    <Chip
                      icon={<AccessTime />}
                      label={`End: ${detailsDialog.request.timeline?.endDate ? new Date(detailsDialog.request.timeline.endDate).toLocaleDateString() : "-"}`}
                      size="small"
                    />
                  </Stack>
                  {detailsDialog.request.adminNotes && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <strong>Admin Notes:</strong>{" "}
                      {detailsDialog.request.adminNotes}
                    </Alert>
                  )}
                  {detailsDialog.request.userRating &&
                    detailsDialog.request.userRating.stars && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          border: "1px solid",
                          borderColor: "grey.200",
                          borderRadius: 2,
                          background: "grey.50",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold", mb: 1 }}
                        >
                          Your Rating
                        </Typography>
                        <Rating
                          value={detailsDialog.request.userRating.stars}
                          readOnly
                        />
                        {detailsDialog.request.userRating.feedback && (
                          <Typography
                            variant="body2"
                            sx={{ mt: 1, color: "text.secondary" }}
                          >
                            Feedback:{" "}
                            {detailsDialog.request.userRating.feedback}
                          </Typography>
                        )}
                      </Box>
                    )}
                </Stack>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDetailsDialog({ open: false, request: null })}
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2 }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // ADMIN VIEW
  if (user?.role === "admin") {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Incoming Requests
        </Typography>
        <Grid container spacing={3}>
          {requests.map((req) => {
            const status = statusConfig[req.status] || {
              color: "default",
              label: req.status,
            };
            const userName = req.user?.name || "User";
            return (
              <Grid item xs={12} sm={6} md={4} key={req._id} display="flex">
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    minHeight: 340,
                  }}
                >
                  <Box sx={{ position: "relative", mb: 1 }}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={2} display="flex" justifyContent="center">
                        <Avatar
                          sx={{ bgcolor: "secondary.main", fontWeight: "bold" }}
                        >
                          {userName.charAt(0).toUpperCase()}
                        </Avatar>
                      </Grid>
                      <Grid item xs={10} zeroMinWidth>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            fontSize: 18,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {req.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {userName} {req.user?.email && `(${req.user?.email})`}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Chip
                      label={status.label}
                      color={status.color}
                      icon={status.icon}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        height: 28,
                        minWidth: 70,
                        width: "auto",
                        borderRadius: 2,
                        fontWeight: "bold",
                        fontSize: 12,
                        display: "flex",
                        alignItems: "center",
                        p: 0,
                        backgroundColor: status.color ? undefined : "#e0e0e0",
                        color: status.color ? undefined : "#333",
                        textTransform: "capitalize",
                        letterSpacing: 0.5,
                        whiteSpace: "nowrap",
                        overflow: "visible",
                        textOverflow: "clip",
                        zIndex: 2,
                      }}
                    />
                  </Box>
                  {req.user?.email && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Email
                        sx={{ fontSize: 18, mr: 0.5, verticalAlign: "middle" }}
                      />{" "}
                      {req.user?.email}
                    </Typography>
                  )}
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {req.description}
                  </Typography>
                  {/* Timeline section: always show chips, fallback to Not provided, fixed width */}
                  <Grid container spacing={1} sx={{ mb: 1 }}>
                    {req.timeline && req.timeline.estimatedDays ? (
                      <Grid item>
                        <Chip
                          icon={<AccessTime />}
                          label={`Estimated: ${req.timeline.estimatedDays} days`}
                          size="small"
                          sx={{ minWidth: 140 }}
                        />
                      </Grid>
                    ) : null}
                    <Grid item>
                      <Chip
                        icon={<AccessTime />}
                        label={`Start: ${req.timeline && req.timeline.startDate ? new Date(req.timeline.startDate).toLocaleDateString() : "Not provided"}`}
                        size="small"
                        sx={{ minWidth: 140 }}
                      />
                    </Grid>
                    <Grid item>
                      <Chip
                        icon={<AccessTime />}
                        label={`End: ${req.timeline && req.timeline.endDate ? new Date(req.timeline.endDate).toLocaleDateString() : "Not provided"}`}
                        size="small"
                        sx={{ minWidth: 140 }}
                      />
                    </Grid>
                  </Grid>
                  {req.adminNotes && req.adminNotes.trim() && (
                    <Alert
                      severity="info"
                      sx={{
                        mt: 1,
                        mb: 1,
                        maxHeight: 48,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      <strong>Notes:</strong> {req.adminNotes}
                    </Alert>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Requested on {new Date(req.createdAt).toLocaleDateString()}
                  </Typography>
                  {/* Action buttons: always reserve space for consistent card height */}
                  <Box sx={{ mt: 2, width: "100%" }}>
                    {req.status === "pending" && (
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="success"
                          sx={{
                            width: "50%",
                            fontWeight: "bold",
                            fontSize: 16,
                            py: 1.2,
                          }}
                          onClick={() => openActionDialog("approve", req)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          sx={{
                            width: "50%",
                            fontWeight: "bold",
                            fontSize: 16,
                            py: 1.2,
                          }}
                          onClick={() => openActionDialog("reject", req)}
                        >
                          Reject
                        </Button>
                      </Stack>
                    )}
                    {req.status === "approved" && (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          width: "100%",
                          fontWeight: "bold",
                          fontSize: 16,
                          py: 1.2,
                        }}
                        onClick={() => openActionDialog("status", req)}
                      >
                        Update Status
                      </Button>
                    )}
                    {req.status === "in_progress" && (
                      <Button
                        variant="contained"
                        color="success"
                        sx={{
                          width: "100%",
                          fontWeight: "bold",
                          fontSize: 16,
                          py: 1.2,
                        }}
                        onClick={() =>
                          setRateDialog({ open: true, request: req })
                        }
                      >
                        Mark as Completed
                      </Button>
                    )}
                    {/* Always reserve space for consistent height */}
                    {!(
                      req.status === "pending" ||
                      req.status === "approved" ||
                      req.status === "in_progress"
                    ) && <Box sx={{ height: 48 }} />}
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
        {/* Action Dialog */}
        <Dialog
          open={actionDialog.open}
          onClose={closeActionDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {actionDialog.type === "approve" && "Approve Request"}
            {actionDialog.type === "reject" && "Reject Request"}
            {actionDialog.type === "status" && "Update Request Status"}
          </DialogTitle>
          <DialogContent>
            {actionError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {actionError}
              </Alert>
            )}
            {actionDialog.type === "approve" && (
              <>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  value={actionForm.startDate}
                  onChange={(e) =>
                    setActionForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                  sx={{ mt:2  }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
                  value={actionForm.endDate}
                  onChange={(e) =>
                    setActionForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                  sx={{ mt:2  }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Notes (optional)"
                  fullWidth
                  multiline
                  minRows={2}
                  value={actionForm.adminNotes}
                  onChange={(e) =>
                    setActionForm((f) => ({ ...f, adminNotes: e.target.value }))
                  }
                />
              </>
            )}
            {actionDialog.type === "reject" && (
              <TextField
                label="Rejection Notes (optional)"
                fullWidth
                multiline
                minRows={2}
                value={actionForm.adminNotes}
                onChange={(e) =>
                  setActionForm((f) => ({ ...f, adminNotes: e.target.value }))
                }
              />
            )}
            {actionDialog.type === "status" && (
              <>
                <TextField
                  select
                  label="Status"
                  fullWidth
                  value={actionForm.status}
                  onChange={(e) =>
                    setActionForm((f) => ({ ...f, status: e.target.value }))
                  }
                  sx={{ mt:2 }}
                >
                  {actionDialog.request.status === "approved" && (
                    <MenuItem value="in_progress">In Progress</MenuItem>
                  )}
                  {actionDialog.request.status === "in_progress" && (
                    <MenuItem value="completed">Completed</MenuItem>
                  )}
                </TextField>
                <TextField
                  label="Notes (optional)"
                  fullWidth
                  multiline
                  minRows={2}
                  value={actionForm.adminNotes}
                  onChange={(e) =>
                    setActionForm((f) => ({ ...f, adminNotes: e.target.value }))
                  }
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeActionDialog} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleActionSubmit}
              variant="contained"
              disabled={actionLoading}
            >
              {actionLoading ? "Processing..." : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Admin rates user dialog */}
        <Dialog
          open={rateDialog.open}
          onClose={() => setRateDialog({ open: false, request: null })}
        >
          <DialogTitle>Rate the User</DialogTitle>
          <DialogContent>
            {rateError && <Alert severity="error">{rateError}</Alert>}
            <Box sx={{ my: 2 }}>
              <Typography>
                How would you rate your experience with this user?
              </Typography>
              <Rating
                value={userRating.stars}
                onChange={(e, newValue) =>
                  setUserRating((r) => ({ ...r, stars: newValue }))
                }
              />
              <TextField
                label="Feedback (optional)"
                fullWidth
                multiline
                minRows={2}
                value={userRating.feedback}
                onChange={(e) =>
                  setUserRating((r) => ({ ...r, feedback: e.target.value }))
                }
                sx={{ mt: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setRateDialog({ open: false, request: null })}
              disabled={rateLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setRateLoading(true);
                setRateError("");
                try {
                  // 1. Mark as completed
                  await axios.put(
                    `/api/user-requests/update-status/${rateDialog.request._id}`,
                    {
                      status: "completed",
                    }
                  );
                  // 2. Save admin's rating for user
                  await axios.post(
                    `/api/user-requests/${rateDialog.request._id}/rate-user`,
                    {
                      stars: userRating.stars,
                      feedback: userRating.feedback,
                    }
                  );
                  // 3. Refresh requests
                  const res = await axios.get(
                    "/api/user-requests/admin-requests"
                  );
                  setRequests(res.data);
                  setRateDialog({ open: false, request: null });
                  setUserRating({ stars: 0, feedback: "" });
                } catch (err) {
                  setRateError(
                    "Failed to complete and rate. Please try again."
                  );
                } finally {
                  setRateLoading(false);
                }
              }}
              variant="contained"
              disabled={rateLoading || !userRating.stars}
            >
              {rateLoading ? "Submitting..." : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // Default fallback
  return null;
};

export default RequestManagement;
