import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
const SuperAdminSimpleBarChart = ({ data, labels, colors }) => (
  <Box sx={{ mt: 3, p: 2 }}>
    <Typography variant="h6" gutterBottom>
      Statistics Overview
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'end', gap: 2, height: 200, mt: 2 }}>
      {data.map((value, index) => (
        <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              width: '80%',
              height: `${(value / Math.max(...data)) * 150}px`,
              backgroundColor: colors[index],
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.5s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            {value}
          </Box>
          <Typography variant="caption" sx={{ mt: 1, textAlign: 'center', fontSize: '0.7rem' }}>
            {labels[index]}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
)
export default SuperAdminSimpleBarChart;