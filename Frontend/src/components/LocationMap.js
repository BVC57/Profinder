import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import { MyLocation as LocationIcon } from '@mui/icons-material';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat:0, // India center
  lng: 78
};

async function reverseGeocode(lat, lng, apiKey) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Full geocode API response:', data);
    if (data.status === 'OK') {
      let village = '', taluka = '', district = '';
      const components = data.results[0]?.address_components || [];
      // Village: try sublocality_level_1, locality, administrative_area_level_4
      for (const comp of components) {
        if (
          comp.types.includes('sublocality_level_1') ||
          comp.types.includes('locality') ||
          comp.types.includes('administrative_area_level_4')
        ) {
          village = comp.long_name;
          break;
        }
      }
      // Taluka: try administrative_area_level_3, sublocality_level_2, locality
      for (const comp of components) {
        if (
          comp.types.includes('administrative_area_level_3') ||
          comp.types.includes('sublocality_level_2') ||
          comp.types.includes('locality')
        ) {
          taluka = comp.long_name;
          break;
        }
      }
      // District: try administrative_area_level_2, fallback to administrative_area_level_1
      for (const comp of components) {
        if (comp.types.includes('administrative_area_level_2')) {
          district = comp.long_name;
          break;
        }
      }
      if (!district) {
        for (const comp of components) {
          if (comp.types.includes('administrative_area_level_1')) {
            district = comp.long_name;
            break;
          }
        }
      }
      return { village, taluka, district, formatted: data.results[0]?.formatted_address || '' };
    }
  } catch (e) {
    // ignore
  }
  return { village: '', taluka: '', district: '', formatted: '' };
}

const LocationMap = ({ onLocationSelect, selectedLocation }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(selectedLocation || defaultCenter);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ village: '', taluka: '', district: '', formatted: '' });

  const apiKey = 'AIzaSyCCRDdzC4-8aMliCT4at-LTN0bB12GwkA0';
  console.log('Google Maps API Key in use:', apiKey);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleLocation = useCallback(async (lat, lng) => {
    setMarker({ lat, lng });
    setLoading(true);
    const addr = await reverseGeocode(lat, lng, apiKey);
    console.log('Reverse geocode result:', { lat, lng, ...addr });
    setAddress(addr);
    onLocationSelect({ lat, lng, ...addr });
    setLoading(false);
  }, [onLocationSelect]);

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    handleLocation(lat, lng);
  }, [handleLocation]);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          handleLocation(lat, lng);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      handleLocation(selectedLocation.lat, selectedLocation.lng);
    }
    // eslint-disable-next-line
  }, []);

  if (!isLoaded) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading map...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Select Your Location</Typography>
        <Button
          variant="outlined"
          startIcon={<LocationIcon />}
          onClick={getCurrentLocation}
          disabled={loading}
        >
          {loading ? 'Getting Location...' : 'Use Current Location'}
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Click on the map to set your location or use the button above to get your current location.
      </Typography>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        <Marker
          position={marker}
          draggable={true}
          onDragEnd={(event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            handleLocation(lat, lng);
          }}
        />
      </GoogleMap>
      {marker && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Selected Location: {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
          </Typography>
          {address.formatted && (
            <Typography variant="body2" color="text.secondary">
              Address: {address.formatted}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Village: {address.village || '-'} | Taluka: {address.taluka || '-'} | District: {address.district || '-'}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default LocationMap; 