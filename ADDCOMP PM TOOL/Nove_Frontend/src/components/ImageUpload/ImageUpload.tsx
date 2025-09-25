import { Delete, Upload } from '@mui/icons-material';
import { Box, Button, Divider, Theme, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

interface ImageUploadProps {
  label?: string;
  value?: string | File | null;
  onChange?: (file: File | null) => void;
  onDelete?: () => void;
  disabled?: boolean;
  maxSize?: number; // in MB
  width?: string | number;
  height?: string | number;
  showPreview?: boolean;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  s3BaseUrl?: string; // S3 base URL for constructing full image URLs
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = 'Image',
  value,
  onChange,
  onDelete,
  disabled = false,
  maxSize = 5, // 5MB default
  width = '200px',
  height = 'auto',
  showPreview = true,
  placeholder = 'Click to upload image',
  error = false,
  helperText,
  s3BaseUrl = 'http://localhost:3005/uploads/',
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  // Sync preview with value prop
  useEffect(() => {
    console.log('🔍 [ImageUpload] Value received:', value, 'for label:', label);
    setImageError(false); // Reset error state when value changes
    if (value) {
      if (typeof value === 'string') {
        // If value is a URL string, check if it's a full URL or S3 path
        if (value.startsWith('http://') || value.startsWith('https://')) {
          // Full URL
          console.log('🔍 [ImageUpload] Setting preview URL (full):', value);
          setPreviewUrl(value);
        } else {
          // S3 path - construct full URL
          const fullUrl = s3BaseUrl + value;
          console.log('🔍 [ImageUpload] Setting preview URL (constructed):', fullUrl);
          setPreviewUrl(fullUrl);
        }
      } else if (value instanceof File) {
        // If value is a File object
        const fileUrl = URL.createObjectURL(value);
        console.log('🔍 [ImageUpload] Setting preview URL (file):', fileUrl);
        setPreviewUrl(fileUrl);
      }
    } else {
      console.log('🔍 [ImageUpload] No value, clearing preview');
      setPreviewUrl(null);
    }
  }, [value, s3BaseUrl, label]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Validate file type - only allow images
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files (JPG, PNG, GIF, etc.)');
        return;
      }

      // Validate file size
      const maxSizeBytes = maxSize * 1024 * 1024; // Convert MB to bytes
      if (file.size > maxSizeBytes) {
        alert(`File size must be less than ${maxSize}MB`);
        return;
      }

      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);

      // Call onChange with the file
      if (onChange) {
        onChange(file);
      }
    }
  };

  const handleClearFile = () => {
    setPreviewUrl(null);
    setImageError(false);
    if (onChange) {
      onChange(null);
    }
    if (onDelete) {
      onDelete();
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('🔍 [ImageUpload] Image load error for:', previewUrl, e);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('🔍 [ImageUpload] Image loaded successfully:', previewUrl);
    setImageError(false);
  };

  return (
    <Box sx={{ width: 'fit-content' }}>
      <Box
        sx={{
          border: `1px solid ${error ? 'red' : 'rgb(240,240,240)'}`,
          borderRadius: 2,
          padding: previewUrl ? '10px' : '20px 40px',
          width: 'fit-content',
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'default',
        }}
      >
        {previewUrl && showPreview && (
          <Box>
            {imageError ? (
              <Box
                sx={{
                  height: 'fit-content',
                  width: 'fit-content',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'grey.100',
                  borderRadius: 1,
                  border: '1px dashed',
                  borderColor: 'grey.300',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Upload sx={{ fontSize: 40, color: 'grey.400', mb: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    Image not found
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    URL: {previewUrl}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <img
                src={previewUrl}
                alt={label || 'Image preview'}
                style={{
                  height: height,
                  width: width,
                  objectFit: 'cover',
                  borderRadius: 4,
                }}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            )}
            <Divider sx={{ my: 1 }} />
            <Box display={'flex'} justifyContent={'flex-end'}>
              <Delete
                sx={{
                  mt: 1,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.5 : 1,
                }}
                onClick={disabled ? undefined : handleClearFile}
                color="primary"
              />
            </Box>
          </Box>
        )}
        {(!previewUrl || !showPreview) && (
          <>
            <input
              style={{ display: 'none' }}
              id={`file-upload-${label}`}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              disabled={disabled}
            />
            <label htmlFor={`file-upload-${label}`}>
              <Button
                variant="text"
                disabled={disabled}
                sx={(theme: Theme) => ({
                  fontSize: '0.85rem',
                  color: error
                    ? theme.palette.error.main
                    : theme.palette.mode === 'dark'
                      ? '#fff'
                      : theme.palette.grey[600],
                })}
                component="span"
                startIcon={<Upload />}
              >
                {placeholder}
              </Button>
            </label>
          </>
        )}
      </Box>
      {helperText && (
        <Box
          sx={{
            mt: 1,
            fontSize: '0.75rem',
            color: error ? 'error.main' : 'text.secondary',
          }}
        >
          {helperText}
        </Box>
      )}
    </Box>
  );
};
