import React from 'react';
import { Card, CardActionArea, CardContent, Typography, CardMedia, useTheme, useMediaQuery } from '@mui/material';

const ProfessionTypeCard = ({ profession, image, onClick }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  // Responsive size: 200x200px, but shrink on very small screens
  const cardSize = isXs ? 140 : 200;

  return (
    <Card
      elevation={6}
      sx={{
        borderRadius: theme.shape.borderRadius * 2,
        width: cardSize,
        height: cardSize,
        m: 'auto',
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[6],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        transition: 'box-shadow 0.3s, transform 0.3s',
        '&:hover': {
          boxShadow: theme.shadows[12],
          transform: 'translateY(-4px) scale(1.03)',
        },
        cursor: 'pointer',
        overflow: 'hidden',
        p: 0,
      }}
    >
      <CardActionArea
        onClick={() => onClick(profession)}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          p: 0,
          background: 'transparent',
        }}
      >
        <CardMedia
          component="img"
          image={image}
          alt={profession}
          sx={{
            width: '100%',
            height: '65%',
            objectFit: 'cover',
            borderTopLeftRadius: theme.shape.borderRadius * 2,
            borderTopRightRadius: theme.shape.borderRadius * 2,
          }}
        />
        <CardContent sx={{
          p: 1.5,
          width: '100%',
          height: '35%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              fontWeight: 700,
              fontSize: isXs ? '1rem' : '1.15rem',
              color: theme.palette.text.primary,
              letterSpacing: 0.2,
              textTransform: 'capitalize',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {profession}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProfessionTypeCard;
