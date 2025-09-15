import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from '../api/axios';

const periodOptions = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' }
];

// Mock data generator
const getMockData = (type, period) => {
  if (type === 'users') {
    if (period === 'day') {
      // Generate date strings for the current month
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth(); // 0-indexed
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(year, month, i + 1);
        const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD
        return { name: dateStr, value: Math.floor(Math.random() * 15) + 1 };
      });
    } else if (period === 'week') {
      return [
        { name: 'Mon', value: 5 },
        { name: 'Tue', value: 8 },
        { name: 'Wed', value: 4 },
        { name: 'Thu', value: 7 },
        { name: 'Fri', value: 6 },
        { name: 'Sat', value: 10 },
        { name: 'Sun', value: 3 }
      ];
    } else if (period === 'month') {
      return [
        { name: 'Week 1', value: 22 },
        { name: 'Week 2', value: 18 },
        { name: 'Week 3', value: 25 },
        { name: 'Week 4', value: 20 }
      ];
    } else {
      return [
        { name: 'Jan', value: 100 },
        { name: 'Feb', value: 120 },
        { name: 'Mar', value: 90 },
        { name: 'Apr', value: 110 },
        { name: 'May', value: 130 },
        { name: 'Jun', value: 80 },
        { name: 'Jul', value: 140 },
        { name: 'Aug', value: 100 },
        { name: 'Sep', value: 120 },
        { name: 'Oct', value: 110 },
        { name: 'Nov', value: 90 },
        { name: 'Dec', value: 150 }
      ];
    }
  } else {
    // admins
    if (period === 'day') {
      // Generate date strings for the current month
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth(); // 0-indexed
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(year, month, i + 1);
        const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD
        return { name: dateStr, value: Math.floor(Math.random() * 5) + 1 };
      });
    } else if (period === 'week') {
      return [
        { name: 'Mon', value: 2 },
        { name: 'Tue', value: 1 },
        { name: 'Wed', value: 3 },
        { name: 'Thu', value: 2 },
        { name: 'Fri', value: 4 },
        { name: 'Sat', value: 1 },
        { name: 'Sun', value: 2 }
      ];
    } else if (period === 'month') {
      return [
        { name: 'Week 1', value: 5 },
        { name: 'Week 2', value: 7 },
        { name: 'Week 3', value: 6 },
        { name: 'Week 4', value: 8 }
      ];
    } else {
      return [
        { name: 'Jan', value: 20 },
        { name: 'Feb', value: 18 },
        { name: 'Mar', value: 25 },
        { name: 'Apr', value: 22 },
        { name: 'May', value: 30 },
        { name: 'Jun', value: 15 },
        { name: 'Jul', value: 28 },
        { name: 'Aug', value: 24 },
        { name: 'Sep', value: 19 },
        { name: 'Oct', value: 21 },
        { name: 'Nov', value: 23 },
        { name: 'Dec', value: 27 }
      ];
    }
  }
};

const TimeSeriesLineChart = ({ title, type, color, total }) => {
  const [period, setPeriod] = useState('week');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/superadmin/stats/${type}?period=${period}`);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setData(response.data);
        } else {
          setData(getMockData(type, period));
        }
      } catch (error) {
        setData(getMockData(type, period));
        console.warn('Using mock data for chart due to API error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, period]);

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            Total: {total}
          </Typography>
          <Typography variant="h6">{title}</Typography>
        </Box>
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={(_, val) => val && setPeriod(val)}
          size="small"
        >
          {periodOptions.map(opt => (
            <ToggleButton key={opt.value} value={opt.value}>{opt.label}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      <ResponsiveContainer width="100%" height={250}>
        {loading ? (
          <Box display="flex" alignItems="center" justifyContent="center" height={250}>
            <Typography variant="body2">Loading...</Typography>
          </Box>
        ) : (
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <RechartsTooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </Paper>
  );
};

export default TimeSeriesLineChart; 