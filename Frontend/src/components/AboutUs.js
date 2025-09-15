import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  VerifiedUser as VerifiedIcon,
  AdminPanelSettings as AdminIcon,
  SupervisedUserCircle as SuperAdminIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  TrendingUp as GrowthIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Group as TeamIcon
} from '@mui/icons-material';

const AboutUs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const stats = [
    { number: '1000+', label: 'Verified Professionals', icon: <VerifiedIcon /> },
    { number: '50+', label: 'Cities Covered', icon: <LocationIcon /> },
    { number: '5000+', label: 'Successful Connections', icon: <WorkIcon /> },
    { number: '4.8', label: 'Average Rating', icon: <StarIcon /> }
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      description: 'Passionate about connecting people with the right professionals.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      description: 'Leading our technical innovation and platform development.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Operations',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      description: 'Ensuring smooth operations and exceptional user experience.'
    }
  ];

  const values = [
    {
      icon: <SecurityIcon sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: 'primary.main' }} />,
      title: 'Trust & Security',
      description: 'We prioritize the safety and security of our users with thorough verification processes.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: 'success.main' }} />,
      title: 'Efficiency',
      description: 'Quick and easy connections between users and verified professionals.'
    },
    {
      icon: <SupportIcon sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: 'info.main' }} />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to assist you with any queries.'
    },
    {
      icon: <GrowthIcon sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: 'warning.main' }} />,
      title: 'Continuous Growth',
      description: 'Constantly expanding our network of professionals and improving our platform.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 4, sm: 6, md: 8 },
          mb: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant={isMobile ? 'h3' : 'h2'} 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                About ProFinder
              </Typography>
              <Typography 
                variant={isMobile ? 'h6' : 'h5'} 
                paragraph 
                sx={{ 
                  opacity: 0.9,
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
                }}
              >
                Connecting you with trusted professionals across the globe
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  opacity: 0.8, 
                  mb: 3,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                ProFinder is your premier platform for discovering and connecting with verified professionals. 
                We bridge the gap between skilled experts and those who need their services, ensuring quality, 
                reliability, and trust in every connection.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop"
                  alt="Professional Team"
                  style={{
                    width: '100%',
                    maxWidth: isMobile ? '100%' : '500px',
                    height: 'auto',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Card elevation={2} sx={{ 
                textAlign: 'center', 
                p: { xs: 2, sm: 2.5, md: 3 },
                height: '100%'
              }}>
                <Box sx={{ color: 'primary.main', mb: 1 }}>
                  {React.cloneElement(stat.icon, { 
                    sx: { fontSize: { xs: 24, sm: 28, md: 32 } } 
                  })}
                </Box>
                <Typography 
                  variant={isMobile ? 'h5' : 'h4'} 
                  component="div" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'primary.main',
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' } }}
                >
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Mission & Vision */}
      <Container maxWidth="lg" sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ 
              height: '100%', 
              p: { xs: 3, sm: 3.5, md: 4 }
            }}>
              <Typography 
                variant={isMobile ? 'h5' : 'h4'} 
                component="h2" 
                gutterBottom 
                sx={{ 
                  color: 'primary.main', 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                }}
              >
                Our Mission
              </Typography>
              <Typography 
                variant="body1" 
                paragraph
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                To create a trusted ecosystem where professionals can showcase their expertise and users can 
                find reliable services with confidence. We believe in the power of verified connections and 
                quality service delivery.
              </Typography>
              <Typography 
                variant="body1"
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                Our platform serves as a bridge between skilled professionals and individuals seeking their 
                expertise, ensuring transparency, reliability, and satisfaction in every interaction.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ 
              height: '100%', 
              p: { xs: 3, sm: 3.5, md: 4 }
            }}>
              <Typography 
                variant={isMobile ? 'h5' : 'h4'} 
                component="h2" 
                gutterBottom 
                sx={{ 
                  color: 'primary.main', 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                }}
              >
                Our Vision
              </Typography>
              <Typography 
                variant="body1" 
                paragraph
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                To become the world's most trusted platform for professional connections, setting industry 
                standards for verification, quality, and user experience.
              </Typography>
              <Typography 
                variant="body1"
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                We envision a future where finding the right professional is as simple as a few clicks, 
                with complete confidence in the quality and reliability of every service provider.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Values Section */}
      <Container maxWidth="lg" sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        <Typography 
          variant={isMobile ? 'h4' : 'h3'} 
          component="h2" 
          textAlign="center" 
          gutterBottom 
          sx={{ 
            mb: { xs: 3, sm: 4 },
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
          }}
        >
          Our Core Values
        </Typography>
        <Grid container spacing={{ xs: 1, sm: 4, md: 4  }} width="100%">
          {values.map((value, index) => (
            <Grid item xs={2} sm={2} md={2} key={index}>
              <Card elevation={2} sx={{ 
                height: '100%', 
                textAlign: 'center', 
                p: { xs: 2.5, sm: 3 },
                justifyContent:'space-between'
              }}>
                <Box sx={{ mb: 2 }}>
                  {value.icon}
                </Box>
                <Typography 
                  variant={isMobile ? 'subtitle1' : 'h6'} 
                  component="h3" 
                  gutterBottom
                  sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } ,
                
                }}
                >
                  {value.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  {value.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        <Typography 
          variant={isMobile ? 'h4' : 'h3'} 
          component="h2" 
          textAlign="center" 
          gutterBottom 
          sx={{ 
            mb: { xs: 3, sm: 4 },
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
          }}
        >
          Meet Our Team
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card elevation={3} sx={{ 
                textAlign: 'center', 
                p: { xs: 2.5, sm: 3 },
                height: '100%'
              }}>
                <Avatar
                  src={member.avatar}
                  sx={{ 
                    width: { xs: 80, sm: 100, md: 120 }, 
                    height: { xs: 80, sm: 100, md: 120 }, 
                    mx: 'auto', 
                    mb: 2 
                  }}
                />
                <Typography 
                  variant={isMobile ? 'subtitle1' : 'h6'} 
                  component="h3" 
                  gutterBottom
                  sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
                >
                  {member.name}
                </Typography>
                <Chip 
                  label={member.role} 
                  color="primary" 
                  variant="outlined" 
                  sx={{ 
                    mb: 2,
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                  }}
                />
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  {member.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works */}
      <Container maxWidth="lg" sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        <Typography 
          variant={isMobile ? 'h4' : 'h3'} 
          component="h2" 
          textAlign="center" 
          gutterBottom 
          sx={{ 
            mb: { xs: 3, sm: 4 },
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
          }}
        >
          How ProFinder Works
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ textAlign: 'center', p: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ 
                width: { xs: 50, sm: 55, md: 60 }, 
                height: { xs: 50, sm: 55, md: 60 }, 
                borderRadius: '50%', 
                backgroundColor: 'primary.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <Typography variant={isMobile ? 'h5' : 'h4'}>1</Typography>
              </Box>
              <Typography 
                variant={isMobile ? 'subtitle1' : 'h6'} 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
              >
                Search
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Browse through our extensive database of verified professionals in your area.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ textAlign: 'center', p: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ 
                width: { xs: 50, sm: 55, md: 60 }, 
                height: { xs: 50, sm: 55, md: 60 }, 
                borderRadius: '50%', 
                backgroundColor: 'success.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <Typography variant={isMobile ? 'h5' : 'h4'}>2</Typography>
              </Box>
              <Typography 
                variant={isMobile ? 'subtitle1' : 'h6'} 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
              >
                Connect
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Reach out to professionals through our secure messaging system.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ textAlign: 'center', p: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ 
                width: { xs: 50, sm: 55, md: 60 }, 
                height: { xs: 50, sm: 55, md: 60 }, 
                borderRadius: '50%', 
                backgroundColor: 'info.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <Typography variant={isMobile ? 'h5' : 'h4'}>3</Typography>
              </Box>
              <Typography 
                variant={isMobile ? 'subtitle1' : 'h6'} 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
              >
                Collaborate
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Work together with your chosen professional to achieve your goals.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2} sx={{ textAlign: 'center', p: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ 
                width: { xs: 50, sm: 55, md: 60 }, 
                height: { xs: 50, sm: 55, md: 60 }, 
                borderRadius: '50%', 
                backgroundColor: 'warning.main', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <Typography variant={isMobile ? 'h5' : 'h4'}>4</Typography>
              </Box>
              <Typography 
                variant={isMobile ? 'subtitle1' : 'h6'} 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
              >
                Review
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                Share your experience and help others make informed decisions.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Contact CTA */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 4, sm: 5, md: 6 },
          mt: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant={isMobile ? 'h4' : 'h3'} 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}
          >
            Ready to Get Started?
          </Typography>
          <Typography 
            variant={isMobile ? 'body1' : 'h6'} 
            textAlign="center" 
            sx={{ 
              opacity: 0.9, 
              mb: 3,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
            }}
          >
            Join thousands of users who trust ProFinder for their professional needs
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Chip 
              icon={<TeamIcon />}
              label="Join Our Community" 
              sx={{ 
                backgroundColor: 'white', 
                color: 'primary.main',
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                padding: { xs: '8px 16px', sm: '10px 20px', md: '12px 24px' }
              }}
            />
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};
export default AboutUs;