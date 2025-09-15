import React from "react";
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
  useMediaQuery,
} from "@mui/material";
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
  Group as TeamIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const AboutUs = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const MotionCard = motion(Card);

  const stats = [
    {
      number: "1000+",
      label: "Verified Professionals",
      icon: <VerifiedIcon />,
    },
    { number: "5000+", label: " All Register Users", icon: <WorkIcon /> },
    { number: "10M+", label: "Services Completed", icon: <SpeedIcon /> },
    { number: "200+", label: "Multiples Categories", icon: <TeamIcon /> },
    { number: "50+", label: "Cities Covered", icon: <LocationIcon /> },
    { number: "4.8", label: "Users Average Rating", icon: <StarIcon /> },
  ];

  const teamMembers = [
    {
      name: "Umesh Sarvaiya",
      role: "Founder & CEO",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      description:
        "Passionate about connecting people with the right professionals.",
    },
    {
      name: "Chauhan Bhadresh",
      role: "Founder & CEO",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      description: "Leading our technical innovation and platform development.",
    },
  ];

  const values = [
    {
      icon: (
        <SecurityIcon
          sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: "primary.main" }}
        />
      ),
      title: "Trust & Security",
      description:
        "We prioritize the safety and security of our users with thorough verification processes.",
    },
    {
      icon: (
        <SpeedIcon
          sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: "success.main" }}
        />
      ),
      title: "Efficiency",
      description:
        "Quick and easy connections between users and verified professionals.",
    },
    {
      icon: (
        <SupportIcon
          sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: "info.main" }}
        />
      ),
      title: "24/7 Support",
      description:
        "Round-the-clock customer support to assist you with any queries.",
    },
    {
      icon: (
        <GrowthIcon
          sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: "warning.main" }}
        />
      ),
      title: "Continuous Growth",
      description:
        "Constantly expanding our network of professionals and improving our platform.",
    },
  ];

  const handleRedirect = () => {
    navigate("/register");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          minHeight: "100vh", // 🔑 full screen height
          display: "flex", // 🔑 flexbox for centering
          alignItems: "center", // 🔑 vertical center
          justifyContent: "center", // 🔑 horizontal center
          textAlign: "center",
          px: 2, // small horizontal padding for mobile
        }}
      >
        <Container maxWidth="md">
          {/* Heading */}
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2.5rem", md: "4rem" },
            }}
          >
            About Us
          </Typography>

          {/* Subheading */}
          <Typography
            variant="h5"
            paragraph
            sx={{
              opacity: 0.9,
              fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.6rem" },
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            Connecting you with trusted professionals across the globe
          </Typography>

          {/* Body Text */}
          <Typography
            variant="body1"
            sx={{
              opacity: 0.85,
              fontSize: { xs: "12px", sm: "15px" },
              maxWidth: "800px",
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            ProFinder is your premier platform for discovering and connecting
            with verified professionals. We bridge the gap between skilled
            experts and those who need their services, ensuring quality,
            reliability, and trust in every connection.
          </Typography>
        </Container>
      </Paper>

      {/* Stats Section */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          p: 2,
          marginTop: 10,
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center" mb={6}>
            <Typography
              variant={isMobile ? "h4" : "h1"}
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                mb: 1,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Our Achievements
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: "600px",
                mx: "auto",
                fontSize: { xs: "12px", md: "18px" },
              }}
            >
              We are proud to showcase the milestones we’ve reached with the
              help of our clients and team. These numbers reflect our journey
              and commitment.
            </Typography>
          </Box>
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 14 }}
            justifyContent="center"
          >
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    textAlign: "center",
                    p: { xs: 2, sm: 3 },
                    height: "200px",
                    width: "100%",
                    borderRadius: 3,
                    position: "relative",
                    overflow: "hidden",
                    "&::before, &::after": {
                      content: '""',
                      position: "absolute",
                      width: "0%",
                      height: "2px",
                      bgcolor: "primary.main",
                      transition: "all 0.5s ease",
                    },
                    "&::before": {
                      top: 0,
                      left: 0,
                    },
                    "&::after": {
                      bottom: 0,
                      right: 0,
                    },
                    "&:hover::before, &:hover::after": {
                      width: "100%",
                    },
                    "&:hover": {
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {/* Card Content */}
                  <Box sx={{ color: "primary.main", mb: 1 }}>
                    {React.cloneElement(stat.icon, {
                      sx: { fontSize: { xs: 30, sm: 36, md: 40 } },
                    })}
                  </Box>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    sx={{
                      fontWeight: "bold",
                      color: "primary.main",
                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Mission & Vision */}
      <Container
        maxWidth="lg"
        sx={{ mb: { xs: 6, sm: 8, md: 10 }, marginTop: 10 }}
      >
        <Grid container spacing={{ xs: 3, sm: 4, md: 6 }}>
          {/* Our Mission */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={4}
              sx={{
                height: "100%",
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: "20px",
                background: "linear-gradient(135deg, #f9f9f9 0%, #eef2f7 100%)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h2"
                gutterBottom
                sx={{
                  color: "primary.main",
                  fontWeight: "bold",
                  mb: 2,
                  fontSize: { xs: "1.6rem", sm: "1.8rem", md: "2rem" },
                }}
              >
                Our Mission
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem" },
                  color: "text.secondary",
                  lineHeight: 1.7,
                }}
              >
                To create a trusted ecosystem where professionals can showcase
                their expertise and users can find reliable services with
                confidence. We believe in the power of verified connections and
                quality service delivery.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem" },
                  color: "text.secondary",
                  lineHeight: 1.7,
                }}
              >
                Our platform serves as a bridge between skilled professionals
                and individuals seeking their expertise, ensuring transparency,
                reliability, and satisfaction in every interaction.
              </Typography>
            </Card>
          </Grid>

          {/* Our Vision */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={4}
              sx={{
                height: "100%",
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: "20px",
                background: "linear-gradient(135deg, #eef7f4 0%, #f9fcfb 100%)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h2"
                gutterBottom
                sx={{
                  color: "primary.main",
                  fontWeight: "bold",
                  mb: 2,
                  fontSize: { xs: "1.6rem", sm: "1.8rem", md: "2rem" },
                }}
              >
                Our Vision
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem" },
                  color: "text.secondary",
                  lineHeight: 1.7,
                }}
              >
                To become the world's most trusted platform for professional
                connections, setting industry standards for verification,
                quality, and user experience.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem" },
                  color: "text.secondary",
                  lineHeight: 1.7,
                }}
              >
                We envision a future where finding the right professional is as
                simple as a few clicks, with complete confidence in the quality
                and reliability of every service provider.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Values Section */}
      <Container maxWidth="lg" sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        {/* Title */}
        <Typography
          variant={isMobile ? "h4" : "h3"}
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{
            mb: { xs: 3, sm: 4 },
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Our Core Values
        </Typography>

        {/* Cards Grid */}
        <Grid
          container
          spacing={{ xs: 2, sm: 4, md: 4 }}
          justifyContent="center"
          width="100%"
        >
          {values.map((value, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <MotionCard
                elevation={4}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                sx={{
                  height: "100%",
                  textAlign: "center",
                  p: { xs: 3, sm: 3.5 },
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: "50%",
                    bgcolor: theme.palette.grey[100],
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {value.icon}
                </Box>

                {/* Title */}
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  component="h3"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  {value.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
                >
                  {value.description}
                </Typography>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container
        maxWidth="lg"
        sx={{ mb: { xs: 4, sm: 5, md: 6 }, marginTop: 10 }}
      >
        {/* Title */}
        <Typography
          variant={isMobile ? "h4" : "h3"}
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{
            mb: { xs: 3, sm: 4 },
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Meet Our Team
        </Typography>

        {/* Cards */}
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          justifyContent="center"
        >
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <MotionCard
                elevation={4}
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1, delay: index * 0.1 }}
                viewport={{ once: true }}
                sx={{
                  textAlign: "center",
                  p: { xs: 3, sm: 3.5 },
                  height: "100%",
                  borderRadius: 4,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "linear-gradient(135deg, #ffffff, #f9f9f9)",
                  transition: "all 0.1s ease-in-out",
                }}
              >
                {/* Avatar */}
                <Box
                  sx={{
                    position: "relative",
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={member.avatar}
                    sx={{
                      width: { xs: 90, sm: 110, md: 130 },
                      height: { xs: 90, sm: 110, md: 130 },
                      border: `4px solid ${theme.palette.primary.main}`,
                    }}
                  />
                </Box>

                {/* Name */}
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  component="h3"
                  gutterBottom
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" },
                    fontWeight: 600,
                  }}
                >
                  {member.name}
                </Typography>

                {/* Role */}
                <Chip
                  label={member.role}
                  color="primary"
                  sx={{
                    mb: 2,
                    fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "8px",
                  }}
                />

                {/* Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    lineHeight: 1.6,
                  }}
                >
                  {member.description}
                </Typography>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact CTA */}
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: { xs: 4, sm: 5, md: 6 },
          mt: { xs: 2, sm: 3, md: 4 },
          borderRadius: "16px", // rounded border for Paper
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant={isMobile ? "h4" : "h3"}
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" } }}
          >
            Ready to Get Started?
          </Typography>

          <Typography
            variant={isMobile ? "body1" : "h6"}
            textAlign="center"
            sx={{
              opacity: 0.9,
              mb: 3,
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
            }}
          >
            Join thousands of users who trust ProFinder for their professional
            needs
          </Typography>

          <Box sx={{ textAlign: "center" }}>
            <Chip
              icon={<TeamIcon />}
              label="Join Our Community"
              clickable
              onClick={handleRedirect}
              sx={{
                backgroundColor: "white",
                color: "primary.main",
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                padding: { xs: "8px 16px", sm: "10px 20px", md: "25px" },
                border: "2px solid", // border added
                borderColor: "primary.main",
                borderRadius: "30px", // rounded button look
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: "white",
                },
              }}
            />
          </Box>
        </Container>
      </Paper>

      // Footer
      <Footer />
    </Box>
  );
};
export default AboutUs;
