import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  Card,
  CardContent,
  Avatar,
  AccordionSummary,
  AccordionDetails,
  Accordion,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Send as SendIcon,
  ContactSupport as ContactIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import PageDownArrow from "../components/PageDownArrow";

const ContactUsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // FAQ data
  const faqs = [
    {
      question: "How does ProFinder work?",
      answer:
        "ProFinder connects you with verified professionals in your area. Simply search for the service you need, browse profiles, and contact the professional that best fits your requirements.",
    },
    {
      question: "How do I become a professional on ProFinder?",
      answer:
        'To become a professional on ProFinder, register an account, select "Admin" as your role, and complete the verification process by providing your professional details and documentation.',
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Yes, we take data security seriously. Your personal information is encrypted and only shared with professionals when you initiate contact.",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await axios.post("/api/contact/submit", formData);
      setSnackbar({
        open: true,
        message: "Your message has been sent successfully!",
        severity: "success",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to send message. Please try again later.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        // ✅ only 5% space left and right
        width: "100%", // ✅ occupy rest of the page
        height: "100vh", // ✅ full height
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          p: { xs: 3, md: 25 },
          height: "100%",
          color: theme.palette.text.primary,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(102, 126, 234, 0.25)",
          width: "100%",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <Typography
            variant="h2"
            component="h1"
            color="white"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Get In Touch With Us
          </Typography>

          <Typography
            variant="h6"
            color="white"
            sx={{
              fontWeight: 400,
              mb: 4,
              maxWidth: { md: "60%" },
              mx: "auto",
              opacity: 0.9,
            }}
          >
            Have questions about ProFinder? We're here to help! Fill out the
            form below and our team will get back to you as soon as possible.
          </Typography>

          {/* Centered details */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              mt: 4,
              textAlign: "center",
            }}
          >
            {/* Email */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
                <EmailIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                  Email Us At
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  connectprofinder@gmail.com
                </Typography>
              </Box>
            </Box>

            {/* Phone */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
                <PhoneIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                  Call Us At
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  +91 9727841757
                </Typography>
              </Box>
            </Box>

            {/* Working Hours */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
                <TimeIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                  Working Hours
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Mon-Fri: 9AM - 6PM
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <PageDownArrow/>

       
      </Box>

      <Grid
        container
        spacing={4}
        sx={{ textAlign: "center", p: 4, justifyContent: "center" }}
      >
        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
              height: "100%",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 600,
                position: "relative",
                pb: 2,
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: 80,
                  height: 4,

                  borderRadius: 2,
                },
              }}
            >
              Send Us a Message
            </Typography>

            <Typography
              variant="body1"
              color="textSecondary"
              paragraph
              sx={{ mb: 4 }}
            >
              Fill out the form below and we'll get back to you as soon as
              possible.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3} width="100%">
                <Grid item xs={12} sm={6} width="100%">
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2 },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} width="100%">
                  <TextField
                    fullWidth
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2 },
                    }}
                  />
                </Grid>

                <Grid item xs={12} width="100%">
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    error={!!errors.subject}
                    helperText={errors.subject}
                    required
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2 },
                    }}
                  />
                </Grid>

                <Grid item xs={12} width="100%">
                  <TextField
                    fullWidth
                    label="Your Message"
                    name="message"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={errors.message}
                    required
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2 },
                    }}
                  />
                </Grid>

                <Grid item xs={12} width="100%">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    endIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SendIcon />
                      )
                    }
                    sx={{
                      mt: 2,
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      background:
                        "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                      "&:hover": {
                        boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                      },
                    }}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Contact Information & FAQs */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            {/* Contact Information Card */}
            {/* <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 3, md: 4 }, 
                mb: 4, 
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 3
                }}
              >
                Our Location
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <LocationIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Address
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    23 Sidsar <br />
                    Bhavnagar, Gujarat, Pin Code 364060
                  </Typography>
                </Box>
              </Box>
              
             
            </Paper> */}

            {/* FAQs */}
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                flexGrow: 1,
                width: "90%",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ContactIcon
                  sx={{ mr: 1, color: theme.palette.primary.main }}
                />
                Frequently Asked Questions
              </Typography>

              <Box sx={{ mt: 2 }}>
                {faqs.map((faq, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <Typography component="span">{faq.question}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>{faq.answer}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Testimonials Section */}
      <Box sx={{ mt: 8, mb: 6 }}>
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
          What Our Users Say
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color="textSecondary"
          sx={{ mb: 5, maxWidth: 700, mx: "auto", fontSize: "16px" }}
        >
          Discover why thousands of users and professionals choose ProFinder for
          their service needs.
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {[
            {
              name: "Bhadresh Chauhan",
              role: "Civil Enginear",
              text: "ProFinder made it incredibly easy to find a reliable plumber in my area. The verification process gave me confidence in my choice, and the service was excellent!",
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            {
              name: "Umesh Sarvaiya",
              role: "Software Enginear",
              text: "As a professional, ProFinder has helped me connect with new clients and grow my business. The platform is intuitive and the support team is always responsive.",
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            {
              name: "Vishal Chauhan",
              role: "Interior Designer",
              text: "The verification process was smooth, and I started receiving client requests within days of being approved. ProFinder has become an essential part of my business.",
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            },
          ].map((testimonial, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ fontStyle: "italic", color: "text.secondary" }}
                  >
                    "{testimonial.text}"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default ContactUsPage;
