import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
  FormHelperText,
  Avatar
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from '../api/axios';
// import LocationMap from './LocationMap';

const validationSchema = Yup.object().shape({
  profession: Yup.string().required('Profession is required'),
  experience: Yup.string().required('Experience is required'),
  city: Yup.string().required('City is required'),
  pincode: Yup.string().matches(/^[0-9]{6}$/, 'Pincode must be 6 digits').required('Pincode is required'),
  gender: Yup.string().required('Gender is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  profilePhoto: Yup.mixed().nullable(),
  aadharCard: Yup.mixed().nullable(),
  voterId: Yup.mixed().nullable(),
  latitude: Yup.mixed().notRequired(),
  longitude: Yup.mixed().notRequired(),
  village: Yup.string().required('Village is required'),
  taluka: Yup.string().required('Taluka is required'),
  district: Yup.string().required('District is required'),
});

const initialValues = {
  profession: '',
  experience: '',
  city: '',
  pincode: '',
  mobile_number: '',
  gender: '',
  email: '',
  profilePhoto: null,
  aadharCard: null,
  voterId: null,
  latitude: '',
  longitude: '',
  village: '',
  taluka: '',
  district: '',
};

// Commented out Google Maps API key - needs proper configuration
const GOOGLE_MAPS_API_KEY = 'AIzaSyCCRDdzC4-8aMliCT4at-LTN0bB12GwkA0';

const fetchAddressFromCoords = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    if (data.status === 'OK') {
      const addressComponents = data.results[0].address_components;
      let village = '', taluka = '', district = '';
      addressComponents.forEach(comp => {
        if (comp.types.includes('sublocality_level_1')) village = comp.long_name;
        if (comp.types.includes('administrative_area_level_2')) district = comp.long_name;
        if (comp.types.includes('locality')) taluka = comp.long_name;
      });
      return { village, taluka, district };
    }
  } catch (err) {
    toast.error('Failed to fetch address from location');
  }
  return {};
};

const AdminForm = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // const [selectedLocation, setSelectedLocation] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  // const handleLocationSelect = (location, setFieldValue) => {
  //   console.log('handleLocationSelect received:', location);
  //   setSelectedLocation(location);
  //   setFieldValue('latitude', location.lat);
  //   setFieldValue('longitude', location.lng);
  //   if (location.village) setFieldValue('village', location.village);
  //   if (location.taluka) setFieldValue('taluka', location.taluka);
  //   if (location.district) setFieldValue('district', location.district);
  // };

  const handleFileChange = (e, setFieldValue, field) => {
    const file = e.currentTarget.files[0] || null;
    setFieldValue(field, file);
    if (field === 'profilePhoto' && file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setMessage('');
    setError('');
    // Validate at least one identity document
    if (!values.aadharCard && !values.voterId) {
      toast.error('Please upload at least one identity document (Aadhar Card or Voter ID)');
      setLoading(false);
      setSubmitting(false);
      return;
    }
    try {
      const formDataToSend = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] && key !== 'profilePhoto' && key !== 'aadharCard' && key !== 'voterId') {
          formDataToSend.append(key, values[key]);
        }
      });
      if (values.profilePhoto) formDataToSend.append('profilePhoto', values.profilePhoto);
      if (values.aadharCard) formDataToSend.append('aadharCard', values.aadharCard);
      if (values.voterId) formDataToSend.append('voterId', values.voterId);
      const response = await axios.post('/api/admin/submit', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message || "Form submitted successfully!");
      resetForm();
      setProfilePreview(null);
      // setSelectedLocation(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit admin form');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleFetchLocation = async (setFieldValue) => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setFieldValue('latitude', latitude);
      setFieldValue('longitude', longitude);
      const address = await fetchAddressFromCoords(latitude, longitude);
      if (address.village) setFieldValue('village', address.village);
      if (address.taluka) setFieldValue('taluka', address.taluka);
      if (address.district) setFieldValue('district', address.district);
      toast.success('Location fetched and fields updated!');
    }, () => {
      toast.error('Unable to retrieve your location');
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Admin Verification Request
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Submit your professional information and identity documents for admin verification. Your request will be reviewed by a super admin.
        </Typography>
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form encType="multipart/form-data">
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Profession</InputLabel>
                <Field
                  as={Select}
                  name="profession"
                  label="Profession"
                  error={touched.profession && !!errors.profession}
                  required
                >
                  <MenuItem value="Doctor">Doctor</MenuItem>
                  <MenuItem value="Lawyer">Lawyer</MenuItem>
                  <MenuItem value="Engineer">Engineer</MenuItem>
                  <MenuItem value="Teacher">Teacher</MenuItem>
                  <MenuItem value="Accountant">Accountant</MenuItem>
                  <MenuItem value="Architect">Architect</MenuItem>
                  <MenuItem value="Consultant">Consultant</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Field>
                {touched.profession && errors.profession && (
                  <FormHelperText error>{errors.profession}</FormHelperText>
                )}
              </FormControl>
              <Field
                as={TextField}
                fullWidth
                label="Years of Experience"
                name="experience"
                margin="normal"
                required
                placeholder="e.g., 5 years"
                error={touched.experience && !!errors.experience}
                helperText={touched.experience && errors.experience}
              />
              <Field
                as={TextField}
                fullWidth
                label="City"
                name="city"
                margin="normal"
                required
                error={touched.city && !!errors.city}
                helperText={touched.city && errors.city}
              />
              <Field
                as={TextField}
                fullWidth
                label="Pincode"
                name="pincode"
                margin="normal"
                required
                inputProps={{ maxLength: 6 }}
                error={touched.pincode && !!errors.pincode}
                helperText={touched.pincode && errors.pincode}
              />
              <Field
                as={TextField}
                fullWidth
                label="Mobile Number"
                name="mobile"
                margin="normal"
            
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Gender</InputLabel>
                <Field
                  as={Select}
                  name="gender"
                  label="Gender"
                  error={touched.gender && !!errors.gender}
                  required
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Field>
                {touched.gender && errors.gender && (
                  <FormHelperText error>{errors.gender}</FormHelperText>
                )}
              </FormControl>
              <Field
                as={TextField}
                fullWidth
                label="Email"
                name="email"
                margin="normal"
                required
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
              {/* Profile Photo Upload */}
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={profilePreview}
                  sx={{ width: 56, height: 56 }}
                >
                  {values.name?.charAt(0)?.toUpperCase() || 'P'}
                </Avatar>
                <label htmlFor="profile-photo-upload">
                  <Input
                    type="file"
                    name="profilePhoto"
                    id="profile-photo-upload"
                    inputProps={{ accept: 'image/*' }}
                    style={{ display: 'none' }}
                    onChange={e => handleFileChange(e, setFieldValue, 'profilePhoto')}
                  />
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                  >
                    {values.profilePhoto ? values.profilePhoto.name : 'Upload Profile Photo'}
                  </Button>
                </label>
                {values.profilePhoto && (
                  <FormHelperText>Selected: {values.profilePhoto.name}</FormHelperText>
                )}
              </Box>
              {/* Google Maps Location Picker (disabled) */}
              {/* Hidden fields for latitude/longitude for Formik */}
              <input type="hidden" name="latitude" value={values.latitude} />
              <input type="hidden" name="longitude" value={values.longitude} />
              {touched.latitude && errors.latitude && (
                <FormHelperText error>{errors.latitude}</FormHelperText>
              )}
              {touched.longitude && errors.longitude && (
                <FormHelperText error>{errors.longitude}</FormHelperText>
              )}
              {/* Address Fields */}
              <Field
                as={TextField}
                fullWidth
                label="Village"
                name="village"
                margin="normal"
                required
                error={touched.village && !!errors.village}
                helperText={touched.village && errors.village}
              />
              <Field
                as={TextField}
                fullWidth
                label="Taluka"
                name="taluka"
                margin="normal"
                required
                error={touched.taluka && !!errors.taluka}
                helperText={touched.taluka && errors.taluka}
              />
              <Field
                as={TextField}
                fullWidth
                label="District"
                name="district"
                margin="normal"
                required
                error={touched.district && !!errors.district}
                helperText={touched.district && errors.district}
              />
              {/* Identity Documents Section */}
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Identity Documents
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Please upload at least one valid identity document for verification. Accepted formats: JPG, PNG, PDF (Max 10MB)
              </Typography>
              {/* Aadhar Card Upload */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Input
                  type="file"
                  name="aadharCard"
                  inputProps={{ accept: 'image/*,.pdf' }}
                  id="aadhar-card-upload"
                  style={{ display: 'none' }}
                  onChange={e => handleFileChange(e, setFieldValue, 'aadharCard')}
                />
                <label htmlFor="aadhar-card-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    {values.aadharCard ? values.aadharCard.name : 'Upload Aadhar Card'}
                  </Button>
                </label>
                {values.aadharCard && (
                  <FormHelperText>Selected: {values.aadharCard.name}</FormHelperText>
                )}
              </FormControl>
              {/* Voter ID Upload */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Input
                  type="file"
                  name="voterId"
                  inputProps={{ accept: 'image/*,.pdf' }}
                  id="voter-id-upload"
                  style={{ display: 'none' }}
                  onChange={e => handleFileChange(e, setFieldValue, 'voterId')}
                />
                <label htmlFor="voter-id-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    {values.voterId ? values.voterId.name : 'Upload Voter ID'}
                  </Button>
                </label>
                {values.voterId && (
                  <FormHelperText>Selected: {values.voterId.name}</FormHelperText>
                )}
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3 }}
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Container>
  );
};

export default AdminForm;