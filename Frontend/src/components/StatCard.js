import React from 'react';
import { Card, CardContent, Box, Typography, useTheme, useMediaQuery } from '@mui/material';

const StatCard = ({ title, value, icon, color, onClick, loading }) => {
  const theme = useTheme();
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        },
        background: `linear-gradient(135deg, ${color}15, ${color}25)`,
        border: `1px solid ${color}30`
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 'bold', 
                color: color,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
              }}
            >
              {loading ? '...' : value}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              {title}
            </Typography>
          </Box>
          <Box 
            sx={{ 
              p: { xs: 1.5, sm: 2 }, 
              borderRadius: '50%', 
              backgroundColor: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {React.cloneElement(icon, { 
              sx: { 
                ...icon.props.sx,
                fontSize: isExtraSmallScreen ? '1.25rem' : '1.5rem' 
              } 
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;