import { useState, useEffect } from 'react';
import {
  Drawer,
  IconButton,
  Stack,
  Typography,
  Divider,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Grid,
  Alert,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  IProjectActivity,
  ProjectStatus,
  Priority,
  ProjectType,
} from 'src/redux/child-reducers/projects/sub-modules/project-activities/project-activities.types';
import { upsertSingleProjectActivityWithCallbackAsync, useAppDispatch } from 'src/redux';

// ----------------------------------------------------------------------

interface ProjectFormRightPanelProps {
  open: boolean;
  data: IProjectActivity | null;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: 'PLANNING', label: 'Planning' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'ON_HOLD', label: 'On Hold' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
];

const projectTypeOptions: { value: ProjectType; label: string }[] = [
  { value: 'CLIENT', label: 'Client' },
  { value: 'INTERNAL', label: 'Internal' },
  { value: 'RND', label: 'R&D' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
];

export const ProjectFormRightPanel: React.FC<ProjectFormRightPanelProps> = ({
  open,
  data,
  onClose,
  onSaveSuccess,
}: ProjectFormRightPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IProjectActivity>({
    project_uuid: null,
    project_id: null,
    name: null,
    description: null,
    status: 'PLANNING',
    priority: 'MEDIUM',
    projectType: 'CLIENT',
    startDate: null,
    endDate: null,
    estimatedDays: null,
    budget: null,
    projectManagerId: null,
    clientId: null,
    tags: [],
    createdAt: null,
    updatedAt: null,
    createdBy: null,
    updatedBy: null,
    file_upload: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      setFormData({
        project_uuid: data.project_id || null, // Use project_id as project_uuid for editing
        project_id: data.project_id || null,
        name: data.name || null,
        description: data.description || null,
        status: data.status || 'PLANNING',
        priority: data.priority || 'MEDIUM',
        projectType: data.projectType || 'CLIENT',
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        estimatedDays: data.estimatedDays || null,
        budget: data.budget || null,
        projectManagerId: data.projectManagerId || null,
        clientId: data.clientId || null,
        tags: data.tags || [],
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
        createdBy: data.createdBy || null,
        updatedBy: data.updatedBy || null,
        file_upload: data.file_upload || null,
      });
    }
  }, [data]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.estimatedDays && formData.estimatedDays <= 0) {
      newErrors.estimatedDays = 'Estimated days must be greater than 0';
    }

    if (formData.budget && formData.budget <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setLoading(true);
    try {
      dispatch(
        upsertSingleProjectActivityWithCallbackAsync({
          payload: formData,
          onSuccess: (isSuccess, data) => {
            if (isSuccess) {
              onSaveSuccess();
            }
          },
        })
      );
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Error saving project');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof IProjectActivity, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field as string]: '' }));
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      PaperProps={{
        sx: { width: 400, bgcolor: 'background.default' },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
        <Typography variant="h6">
          {formData.project_id ? 'Edit Project' : 'Create Project'}
        </Typography>
        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Stack>

      <Divider />

      <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
        <Stack spacing={3}>
          <Alert severity="info">
            Project manager and client assignment will be available in the next update.
          </Alert>

          <TextField
            fullWidth
            label="Project Name"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status || 'PLANNING'}
                  label="Status"
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority || 'MEDIUM'}
                  label="Priority"
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <FormControl fullWidth>
            <InputLabel>Project Type</InputLabel>
            <Select
              value={formData.projectType || 'CLIENT'}
              label="Project Type"
              onChange={(e) => handleInputChange('projectType', e.target.value)}
            >
              {projectTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate ? new Date(formData.startDate) : null}
                  onChange={(date) => handleInputChange('startDate', date?.toISOString() || null)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate ? new Date(formData.endDate) : null}
                  onChange={(date) => handleInputChange('endDate', date?.toISOString() || null)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Estimated Days"
                value={formData.estimatedDays || ''}
                onChange={(e) =>
                  handleInputChange('estimatedDays', parseInt(e.target.value) || null)
                }
                error={!!errors.estimatedDays}
                helperText={errors.estimatedDays}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Budget"
                value={formData.budget || ''}
                onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || null)}
                error={!!errors.budget}
                helperText={errors.budget}
              />
            </Grid>
          </Grid>

          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={formData.tags || []}
            onChange={(_, newValue) => handleInputChange('tags', newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Tags" placeholder="Add tags..." />
            )}
          />
        </Stack>
      </Box>

      <Divider />

      <Stack direction="row" spacing={2} sx={{ p: 2 }}>
        <Button variant="outlined" onClick={onClose} disabled={loading} fullWidth>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading} fullWidth>
          {formData.project_uuid ? 'Update' : 'Create'}
        </Button>
      </Stack>
    </Drawer>
  );
};
