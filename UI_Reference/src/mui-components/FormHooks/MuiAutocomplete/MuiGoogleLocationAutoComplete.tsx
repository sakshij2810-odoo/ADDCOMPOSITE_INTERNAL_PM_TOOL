import React from 'react';
import { Autocomplete, Theme, Typography } from '@mui/material';
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { CONFIG } from 'src/config-global';

export interface IMuiGoogleLocationResponse {
  country: string;
  state: string;
  city: string;
  district: string;
  postalCode: string;
  address: string;
}

interface ILocationAutoCompleteProps {
  onLocationChange: (data: IMuiGoogleLocationResponse) => void;
  id?: string;
  value?: string;
  [key: string]: any;
  error?: boolean;
  helperText?: string;
}

export const MuiGoogleLocationAutoComplete: React.FC<ILocationAutoCompleteProps> = (props) => (
  <GooglePlacesAutocomplete
    // apiKey={CONFIG.googleLocationApiKey}
    key={props.value}
    selectProps={{
      inputId: props.id,
      placeholder: 'Choose Location',
      isClearable: true,
      defaultInputValue: props.value,
      styles: {
        control: (provided, state) => ({
          ...provided,
          backgroundColor: '#fff',
          borderColor: state.isFocused ? '#3b82f6' : '#d1d5db', // blue-500 on focus, gray-300 default
          boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
          '&:hover': {
            borderColor: '#3b82f6',
          },
          minHeight: '40px',
          borderRadius: '8px',
        }),
        input: (provided) => ({
          ...provided,
          color: '#111827', // text-gray-900
        }),
        placeholder: (provided) => ({
          ...provided,
          color: '#6b7280', // text-gray-500
        }),
        singleValue: (provided) => ({
          ...provided,
          color: '#111827', // text-gray-900
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 9999, // ensure it's on top
        }),
      },
      onChange: async (place: any) => {
        const placeId = place?.value?.place_id;
        if (!placeId) return;

        try {
          const response = await geocodeByPlaceId(placeId);
          const { address_components } = response[0];

          let city = '';
          let state = '';
          let country = '';
          let address = '';
          let zipCode = '';
          let district = '';

          for (const component of address_components) {
            const types = component.types;
            if (types.includes('locality')) city = component.long_name;
            else if (types.includes('administrative_area_level_1')) state = component.long_name;
            else if (types.includes('administrative_area_level_3')) district = component.long_name;
            else if (types.includes('country')) country = component.long_name;
            else if (types.includes('postal_code')) zipCode = component.long_name;
            else if (
              types.includes('street_number') ||
              types.includes('route') ||
              types.includes('premise') ||
              types.includes('neighborhood') ||
              types.includes('sublocality')
            ) {
              address += component.long_name + ' ';
            }
          }

          props.onLocationChange({
            country,
            address: address.trim() || place.label,
            city,
            district,
            state,
            postalCode: zipCode,
          });
        } catch (error) {
          console.error('Error fetching geocode data:', error);
        }
      },
    }}
    {...props}
  />
);

interface IAddressAutoCompleteProps {
  onLocationChange: (data: string) => void;
  id?: string | number;
  value: string | number | null;
  [key: string]: any;
}
