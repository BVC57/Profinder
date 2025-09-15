import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  Stack,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  VerifiedUser as VerifiedIcon
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const footerSections = [
    {
      title: 'ProFinder',
      description: 'Connecting you with verified professionals for all your service needs. Trust, quality, and convenience in one platform.',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Success Stories', href: '/success-stories' },
        { name: 'Press & Media', href: '/press' }
      ]
    },
    {
      title: 'Services',
      links: [
        { name: 'Find Professionals', href: '/search' },
        { name: 'Become a Professional', href: '/register' },
        { name: 'Enterprise Solutions', href: '/enterprise' },
        { name: 'API Access', href: '/api' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Safety Guidelines', href: '/safety' },
        { name: 'Terms of Service', href: '/terms' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'GDPR Compliance', href: '/gdpr' }
      ]
    }
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, href: '#', label: 'Facebook' },
    { icon: <TwitterIcon />, href: '#', label: 'Twitter' },
    { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
    { icon: <LinkedInIcon />, href: '#', label: 'LinkedIn' }
  ];

  return (
    <Box
      sx={{
        backgroundColor: 'grey.900',
        color: 'white',
        pt: { xs: 6, md: 8 },
        pb: { xs: 4, md: 6 }
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VerifiedIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  ProFinder
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'grey.400', lineHeight: 1.6, mb: 3 }}>
                {footerSections[0].description}
              </Typography>

              {/* Contact Info */}
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ fontSize: 20, color: 'primary.main', mr: 2 }} />
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    support@profinder.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ fontSize: 20, color: 'primary.main', mr: 2 }} />
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    +1 (555) 123-4567
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ fontSize: 20, color: 'primary.main', mr: 2 }} />
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    New York, NY 10001, USA
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Footer Links */}
          {footerSections.slice(1).map((section, index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  mb: 3,
                  color: 'white'
                }}
              >
                {section.title}
              </Typography>
              <Stack spacing={1.5}>
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    sx={{
                      color: 'grey.400',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: 'grey.700', mb: 4 }} />

        {/* Bottom Section */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', md: 'flex-start' },
          gap: 2
        }}>
          {/* Copyright */}
          <Typography variant="body2" sx={{ color: 'grey.400' }}>
            © 2025 ProFinder. All rights reserved.
          </Typography>

          {/* Social Links */}
          <Stack direction="row" spacing={2}>
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                sx={{
                  color: 'grey.400',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'primary.main',
                    transform: 'translateY(-2px)'
                  }
                }}
                aria-label={social.label}
              >
                {social.icon}
              </Link>
            ))}
          </Stack>
        </Box>

        {/* Additional Info */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'grey.500' }}>
            ProFinder is committed to connecting you with verified professionals.
            All professionals undergo thorough verification processes to ensure quality and reliability.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;