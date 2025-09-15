import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WorkIcon from "@mui/icons-material/Work";
import TimelineIcon from "@mui/icons-material/Timeline";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import InsightsIcon from "@mui/icons-material/Insights";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate } from "react-router-dom";

const steps = [
  "Sign up and create your professional profile with your expertise.",
  "Upload documents and verify your credentials & certifications.",
  "Get instantly matched with clients who need your services.",
  "Collaborate using our integrated chat and video call tools.",
  "Receive secure payments directly into your account.",
  "Build long-term relationships and grow your reputation.",
];

const advantages = [
  "Access to a wide global client base across industries.",
  "Flexible working hours – work anytime, anywhere.",
  "Secure payments with buyer protection and escrow.",
  "Transparent feedback and rating system.",
  "Boost your professional visibility and brand presence.",
  "Opportunities for repeat business and long-term projects.",
];

const features = [
  "Easy-to-use professional dashboard with insights.",
  "Real-time notifications for job offers & updates.",
  "Detailed analytics and monthly performance reports.",
  "Built-in calendar & task manager for organization.",
  "AI-powered client matching for better opportunities.",
  "Dedicated 24/7 customer support for professionals.",
];

const services = [
  {
    title: "Client Matching",
    description:
      "We connect you with clients that match your expertise and goals.",
    icon: <WorkIcon color="primary" fontSize="large" />,
  },
  {
    title: "Growth Tracking",
    description:
      "Track your performance, earnings, and client feedback in real-time.",
    icon: <TimelineIcon color="secondary" fontSize="large" />,
  },
  {
    title: "24/7 Support",
    description: "Our team is available round-the-clock to help you succeed.",
    icon: <SupportAgentIcon color="success" fontSize="large" />,
  },
  {
    title: "Advanced Insights",
    description:
      "Get detailed reports and AI-driven insights to improve efficiency.",
    icon: <InsightsIcon color="info" fontSize="large" />,
  },
  {
    title: "Secure Platform",
    description:
      "Work confidently with advanced security and verified clients.",
    icon: <SecurityIcon color="error" fontSize="large" />,
  },
];

export default function ProfesionalPage() {
    const navigate = useNavigate();
  return (
    <Box sx={{ bgcolor: "#fafafa" }}>
      {/* Hero Section - Full Height */}
      <Paper
        elevation={0}
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h1"
            gutterBottom
            color="white"
            sx={{ fontWeight: "bold", mb: 2, lineHeight: 2 }}
          >
            Why Join Us as a Professional?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: "white" }}>
            Join Profiner to connect with high-value clients, showcase your
            expertise, and build long-term professional relationships. With
            advanced tools and secure support, we help you focus on your growth.
          </Typography>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/admin-form")}
            sx={{
              borderColor: "white",
              color: "white",
              borderRadius: "30px",
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              animation: "pulse 2s infinite",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255,255,255,0.1)",
                transform: "scale(1.08)",
                transition: "0.3s",
              },
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.1)" },
                "100%": { transform: "scale(1)" },
              },
            }}
          >
            Join As a Professional
          </Button>
         
        </Container>
      </Paper>

      {/* Steps Section (Timeline Style) */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          color="primary.main"
          sx={{
            mb: 5,
            fontWeight: "bold",
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          How It Works
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {steps.map((step, idx) => (
            <Grid item xs={12} md={10} key={idx}>
              <Card
                elevation={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 3,
                  mb: 2,
                  borderLeft: "6px solid #667eea",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mr: 2, color: "primary.main" }}
                >
                  {idx + 1}.
                </Typography>
                <Typography variant="body1">{step}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Advantages & Features Section */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 6, md: 8 }, marginRight: 6, textAlign: "center" }}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              gutterBottom
              color="primary.main"
              sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}
            >
              Advantages
            </Typography>
            <List>
              {advantages.map((adv, idx) => (
                <ListItem key={idx}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={adv} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              gutterBottom
              color="secondary.main"
              sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}
            >
              Features
            </Typography>
            <List>
              {features.map((feat, idx) => (
                <ListItem key={idx}>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={feat} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Container>

      {/* Services Section */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 6, md: 8 }, textAlign: "center" }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            mb: 5,
            fontWeight: "bold",
            fontSize: { xs: "2rem", md: "3rem" },
            color: "primary.main",
          }}
        >
          Our Services
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {services.map((service, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  textAlign: "center",
                  p: 3,
                }}
              >
                <Box sx={{ fontSize: 50, mb: 2 }}>{service.icon}</Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 🔹 Final Thanks Section */}
      <Box
        sx={{
          py: 8,
          textAlign: "center",
          background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
          color: "white",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mb: 2,
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          Thanks for Joining Us!
        </Typography>
        <Typography
          variant="h6"
          sx={{ maxWidth: "700px", mx: "auto", opacity: 0.9 }}
        >
          Together, we are building a stronger professional community. Your
          journey with Profiner starts here 🚀
        </Typography>
      </Box>
    </Box>
  );
}
