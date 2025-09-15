import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import axios from "../api/axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Button,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Avatar,
  IconButton,
  Grid,
  Chip,
  Slider,
  Alert,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from "@mui/material";
import {
  Palette,
  Person,
  Notifications,
  Security,
  Save,
  Cancel,
  PhotoCamera,
  Visibility,
  VisibilityOff,
  ColorLens,
  RestartAlt,
  Analytics,
  TrendingUp,
  Assessment,
  BarChart,
  PieChart,
  Timeline,
  AttachMoney,
  Star,
  Visibility as ViewIcon,
  Download
} from "@mui/icons-material";

// Theme color options
const themeColors = [
  { name: "Primary Blue", value: "#1976d2", label: "Blue" },
  { name: "Green", value: "#2e7d32", label: "Green" },
  { name: "Purple", value: "#7b1fa2", label: "Purple" },
  { name: "Orange", value: "#f57c00", label: "Orange" },
  { name: "Red", value: "#d32f2f", label: "Red" },
  { name: "Teal", value: "#00796b", label: "Teal" }
];

// Project default primary color (matches brand indigo in `src/theme.js`)
const PROJECT_DEFAULT_PRIMARY = "#667eea";

const ProfileSettings = () => {
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    bio: "Professional admin with 5+ years of experience",
    avatar: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileData(prev => ({ ...prev, avatar: URL.createObjectURL(file) }));
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Person /> Profile Settings
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={profileData.avatar}
              sx={{ width: 120, height: 120, border: '3px solid #e0e0e0' }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
              >
                Change Photo
              </Button>
            </label>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={profileData.firstName}
                onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={profileData.lastName}
                onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={3}
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

const ThemeSettings = ({ onSettingsChange }) => {
  const { themeSettings, updateThemeSettings } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(themeSettings.primaryColor);
  const [fontSize, setFontSize] = useState(themeSettings.fontSize);
  const [darkMode, setDarkMode] = useState(themeSettings.darkMode);

  // Update local state when theme settings change
  useEffect(() => {
    setSelectedTheme(themeSettings.primaryColor);
    setFontSize(themeSettings.fontSize);
    setDarkMode(themeSettings.darkMode);
  }, [themeSettings]);

  // Notify parent component of changes
  useEffect(() => {
    onSettingsChange({
      primaryColor: selectedTheme,
      fontSize: fontSize,
      darkMode: darkMode
    });
  }, [selectedTheme, fontSize, darkMode, onSettingsChange]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Palette /> Theme & Appearance
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Primary Color</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            {themeColors.map((color) => (
              <Chip
                key={color.value}
                label={color.label}
                sx={{
                  backgroundColor: color.value,
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8
                  },
                  ...(selectedTheme === color.value && {
                    border: '2px solid #000',
                    fontWeight: 'bold'
                  })
                }}
                onClick={() => setSelectedTheme(color.value)}
              />
            ))}
            <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ColorLens />}
                onClick={() => setSelectedTheme(PROJECT_DEFAULT_PRIMARY)}
              >
                Apply Default Color
              </Button>
              <Button
                variant="text"
                size="small"
                startIcon={<RestartAlt />}
                onClick={() => setSelectedTheme(themeSettings.primaryColor)}
              >
                Reset Color
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Font Size</Typography>
          <Slider
            value={fontSize}
            onChange={(e, newValue) => setFontSize(newValue)}
            min={12}
            max={20}
            marks
            valueLabelDisplay="auto"
            sx={{ width: '100%' }}
          />
          <Typography variant="body2" color="text.secondary">
            Current size: {fontSize}px
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
            }
            label="Dark Mode"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Preview</Typography>
          <Box 
            sx={{ 
              p: 2, 
              border: '1px solid #e0e0e0', 
              borderRadius: 1,
              backgroundColor: darkMode ? '#1e1e1e' : '#fff',
              color: darkMode ? '#fff' : '#222'
            }}
          >
            <Typography variant="h6" sx={{ color: selectedTheme, mb: 1 }}>
              Sample Heading
            </Typography>
            <Typography variant="body1" sx={{ fontSize: `${fontSize}px` }}>
              This is a preview of how your text will look with the selected font size ({fontSize}px).
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 1, backgroundColor: selectedTheme }}
            >
              Sample Button
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Notifications /> Notification Preferences
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={notifications.email}
                onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
              />
            }
            label="Email Notifications"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={notifications.push}
                onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
              />
            }
            label="Push Notifications"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={notifications.sms}
                onChange={(e) => setNotifications(prev => ({ ...prev, sms: e.target.checked }))}
              />
            }
            label="SMS Notifications"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={notifications.marketing}
                onChange={(e) => setNotifications(prev => ({ ...prev, marketing: e.target.checked }))}
              />
            }
            label="Marketing Communications"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const SecuritySettings = () => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Security /> Security Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
              />
            }
            label="Two-Factor Authentication"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Session Timeout (minutes)</Typography>
          <Slider
            value={sessionTimeout}
            onChange={(e, newValue) => setSessionTimeout(newValue)}
            min={15}
            max={120}
            marks
            valueLabelDisplay="auto"
            sx={{ width: '100%' }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const AnalyticsSettings = () => {
  const [selectedReport, setSelectedReport] = useState("platform");
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    profileAnalytics: null,
    requestStats: null,
    earningsReport: null,
    performanceMetrics: null,
    platformStats: null
  });

  // Fetch real analytics data
  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/superadmin/analytics?timeRange=${timeRange}`);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to mock data if API fails
      setAnalyticsData({
        profileAnalytics: {
          profileViews: 1247,
          profileViewsChange: 12.5,
          contactClicks: 89,
          contactClicksChange: 8.2,
          rating: 4.8,
          totalReviews: 156,
          responseRate: 94.2,
          avgResponseTime: "2.3 hours"
        },
        requestStats: {
          totalRequests: 234,
          completedRequests: 198,
          pendingRequests: 23,
          cancelledRequests: 13,
          completionRate: 84.6,
          avgCompletionTime: "3.2 days",
          monthlyRequests: [45, 52, 38, 67, 89, 76, 82, 91, 78, 85, 92, 88]
        },
        earningsReport: {
          totalEarnings: 15420,
          monthlyEarnings: 2840,
          avgPerRequest: 78.5,
          topEarningMonth: "December",
          paymentMethods: {
            "Bank Transfer": 65,
            "Digital Wallet": 25,
            "Cash": 10
          },
          monthlyBreakdown: [
            { month: "Jan", earnings: 2100 },
            { month: "Feb", earnings: 1850 },
            { month: "Mar", earnings: 2300 },
            { month: "Apr", earnings: 1950 },
            { month: "May", earnings: 2800 },
            { month: "Jun", earnings: 3200 }
          ]
        },
        performanceMetrics: {
          customerSatisfaction: 4.7,
          responseTime: "2.1 hours",
          completionRate: 94.2,
          repeatCustomers: 67,
          referralRate: 23.5,
          qualityScore: 92.8
        },
        platformStats: {
          totalUsers: 1250,
          totalAdmins: 89,
          totalRequests: 2340,
          totalEarnings: 154200,
          activeUsers: 890,
          newUsersThisMonth: 45,
          pendingVerifications: 12,
          platformRating: 4.6
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const handleReportChange = (event) => {
    setSelectedReport(event.target.value);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const renderProfileAnalytics = () => {
    const data = analyticsData.profileAnalytics;
    if (!data) return <Typography>No profile analytics data available</Typography>;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ViewIcon /> Profile Views
              </Typography>
              <Typography variant="h4" sx={{ color: 'primary.main', mb: 1 }}>
                {data.profileViews?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                +{data.profileViewsChange || 0}% from last month
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={75} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star /> Rating & Reviews
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ color: 'warning.main', mr: 1 }}>
                  {data.rating || 0}
                </Typography>
                <Star sx={{ color: 'warning.main', fontSize: 32 }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {data.totalReviews || 0} total reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Response Metrics</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary.main">
                      {data.responseRate || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Response Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary.main">
                      {data.avgResponseTime || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Response Time
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary.main">
                      {data.contactClicks || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Contact Clicks
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary.main">
                      +{data.contactClicksChange || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click Growth
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderRequestStatistics = () => {
    const data = analyticsData.requestStats;
    if (!data) return <Typography>No request statistics data available</Typography>;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Request Overview</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main">
                      {data.totalRequests || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Requests
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {data.completedRequests || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {data.pendingRequests || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="error.main">
                      {data.cancelledRequests || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cancelled
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Performance Metrics</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Completion Rate
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={data.completionRate || 0} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {data.completionRate || 0}%
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Avg Completion Time: {data.avgCompletionTime || 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Monthly Request Trends</Typography>
              <Box sx={{ display: 'flex', alignItems: 'end', gap: 1, height: 200 }}>
                {(data.monthlyRequests || []).map((value, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      height: `${(value / 100) * 100}%`,
                      backgroundColor: 'primary.main',
                      borderRadius: '4px 4px 0 0',
                      minHeight: 20,
                      display: 'flex',
                      alignItems: 'end',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'white', mb: 0.5 }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                  <Typography key={month} variant="caption" color="text.secondary">
                    {month}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderEarningsReport = () => {
    const data = analyticsData.earningsReport;
    if (!data) return <Typography>No earnings report data available</Typography>;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney /> Total Earnings
              </Typography>
              <Typography variant="h3" sx={{ color: 'success.main', mb: 1 }}>
                ₹{data.totalEarnings?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Lifetime earnings from {analyticsData.requestStats?.totalRequests || 0} requests
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  This Month: ₹{data.monthlyEarnings?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg per request: ₹{data.avgPerRequest || '0'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Payment Methods</Typography>
              <Box sx={{ mb: 2 }}>
                {data.paymentMethods && Object.entries(data.paymentMethods).map(([method, percentage]) => (
                  <Box key={method} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{method}</Typography>
                      <Typography variant="body2">{percentage}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={percentage} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Monthly Earnings Breakdown</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell align="right">Earnings (₹)</TableCell>
                      <TableCell align="right">Requests</TableCell>
                      <TableCell align="right">Avg per Request</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.monthlyBreakdown && data.monthlyBreakdown.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell align="right">₹{row.earnings?.toLocaleString() || '0'}</TableCell>
                        <TableCell align="right">
                          {data.avgPerRequest ? Math.round(row.earnings / data.avgPerRequest) : 0}
                        </TableCell>
                        <TableCell align="right">₹{data.avgPerRequest || '0'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderPerformanceMetrics = () => {
    const data = analyticsData.performanceMetrics;
    if (!data) return <Typography>No performance metrics data available</Typography>;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Customer Satisfaction</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h3" sx={{ color: 'warning.main', mr: 1 }}>
                  {data.customerSatisfaction || 0}
                </Typography>
                <Star sx={{ color: 'warning.main', fontSize: 40 }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Based on {analyticsData.profileAnalytics?.totalReviews || 0} reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Quality Score</Typography>
              <Typography variant="h3" sx={{ color: 'success.main', mb: 1 }}>
                {data.qualityScore || 0}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={data.qualityScore || 0} 
                sx={{ height: 12, borderRadius: 6 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Overall performance rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Key Performance Indicators</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary.main">
                      {data.responseTime || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Response Time
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="success.main">
                      {data.completionRate || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completion Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="info.main">
                      {data.repeatCustomers || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Repeat Customers
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="warning.main">
                      {data.referralRate || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Referral Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderPlatformAnalytics = () => {
    const data = analyticsData.platformStats;
    if (!data) return <Typography>No platform analytics data available</Typography>;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp /> Platform Overview
              </Typography>
              <Typography variant="h3" sx={{ color: 'primary.main', mb: 1 }}>
                {data.totalUsers?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Total Registered Users
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Active Users: {data.activeUsers?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  New This Month: {data.newUsersThisMonth || '0'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment /> Professional Stats
              </Typography>
              <Typography variant="h3" sx={{ color: 'success.main', mb: 1 }}>
                {data.totalAdmins?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Verified Professionals
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="warning.main" sx={{ mb: 1 }}>
                  Pending Verifications: {data.pendingVerifications || '0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Platform Rating: {data.platformRating || '0'}/5
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Platform Performance</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary.main">
                      {data.totalRequests?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Requests
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="success.main">
                      ₹{data.totalEarnings?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Earnings
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="info.main">
                      {data.activeUsers?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Users
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="warning.main">
                      {data.platformRating || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Platform Rating
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderReportContent = () => {
    if (!analyticsData || Object.keys(analyticsData).length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No analytics data available
          </Typography>
        </Box>
      );
    }

    switch (selectedReport) {
      case "profile":
        return renderProfileAnalytics();
      case "requests":
        return renderRequestStatistics();
      case "earnings":
        return renderEarningsReport();
      case "performance":
        return renderPerformanceMetrics();
      case "platform":
        return renderPlatformAnalytics();
      default:
        return renderPlatformAnalytics();
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Analytics /> Analytics & Reports
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={selectedReport}
              label="Report Type"
              onChange={handleReportChange}
            >
              <MenuItem value="platform">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp fontSize="small" />
                  Platform Analytics
                </Box>
              </MenuItem>
              <MenuItem value="profile">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person fontSize="small" />
                  Profile Analytics
                </Box>
              </MenuItem>
              <MenuItem value="requests">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assessment fontSize="small" />
                  Request Statistics
                </Box>
              </MenuItem>
              <MenuItem value="earnings">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney fontSize="small" />
                  Earnings Report
                </Box>
              </MenuItem>
              <MenuItem value="performance">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChart fontSize="small" />
                  Performance Metrics
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
              <MenuItem value="1y">Last Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="outlined"
            onClick={fetchAnalyticsData}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <RestartAlt />}
            fullWidth
            sx={{ height: 56 }}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography>Loading analytics...</Typography>
          </Box>
        </Box>
      ) : (
        <>
          {renderReportContent()}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" startIcon={<Download />}>
              Export Report
            </Button>
            <Button variant="contained" startIcon={<Assessment />}>
              Generate PDF
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

const Settings = ({ open, onClose }) => {
  const [tab, setTab] = useState(0);
  const [saved, setSaved] = useState(false);
  const [pendingThemeSettings, setPendingThemeSettings] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const { updateThemeSettings } = useTheme();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleThemeSettingsChange = (newSettings) => {
    setPendingThemeSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    // Apply theme settings if they were changed
    if (pendingThemeSettings) {
      updateThemeSettings(pendingThemeSettings);
      setPendingThemeSettings(null);
    }
    
    setHasChanges(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 2000);
  };

  const handleCancel = () => {
    // Reset pending changes
    setPendingThemeSettings(null);
    setHasChanges(false);
    onClose();
  };

  const renderTabContent = () => {
    switch (tab) {
      case 0:
        return <ProfileSettings />;
      case 1:
        return <ThemeSettings onSettingsChange={handleThemeSettingsChange} />;
      case 2:
        return <NotificationSettings />;
      case 3:
        return <SecuritySettings />;
      case 4:
        return <AnalyticsSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '600px'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Settings
        </Typography>
        {saved && (
          <Alert severity="success" sx={{ py: 0 }}>
            Settings saved!
          </Alert>
        )}
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                textTransform: 'none',
                fontSize: '0.9rem'
              }
            }}
          >
            <Tab label="Profile" icon={<Person />} iconPosition="start" />
            <Tab label="Theme" icon={<Palette />} iconPosition="start" />
            <Tab label="Notifications" icon={<Notifications />} iconPosition="start" />
            <Tab label="Security" icon={<Security />} iconPosition="start" />
            <Tab label="Analytics" icon={<Analytics />} iconPosition="start" />
          </Tabs>
        </Box>
        
        <Box sx={{ p: 2 }}>
          {renderTabContent()}
        </Box>
      </DialogContent>

      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {hasChanges && (
          <Typography variant="body2" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Alert severity="info" sx={{ py: 0, px: 1 }}>
              Changes pending
            </Alert>
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button 
            onClick={handleCancel} 
            variant="outlined"
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            startIcon={<Save />}
            disabled={!hasChanges}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default Settings; 