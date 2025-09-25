import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { taskService, CreateTaskModuleWiseRequest } from '../../../services/task.service';

// Validation schema
const taskCreateSchema = z.object({
  module_name: z.string().min(1, 'Module name is required'),
  sub_module_name: z.string().min(1, 'Sub module name is required'),
  module_reference_column: z.string().optional(),
  module_reference_code_or_id: z.string().optional(),
  task_name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  task_priority: z.string().optional(),
  assigned_to_uuid: z.string().optional(),
  assigned_to_name: z.string().optional(),
  created_by_uuid: z.string().optional(),
  created_by_name: z.string().optional(),
  task_type: z.string().min(1, 'Task type is required'),
  status: z.string().optional(),
  date_created: z.string().optional(),
  due_date: z.string().optional(),
  due_time: z.string().optional(),
});

type TaskCreateFormData = z.infer<typeof taskCreateSchema>;

// TODO: Replace with API call to fetch users from database
// This should be replaced with a real API call to get users from the backend
const mockUsers: { uuid: string; name: string }[] = [];

const taskTypes = ['Notes', 'Follow-up', 'Review', 'Approval', 'Documentation'];
const priorities = ['Low', 'Medium', 'High', 'Urgent'];
const statuses = ['ACTIVE', 'PENDING', 'COMPLETED', 'CANCELLED'];

interface TaskCreateFormProps {
  onTaskCreated?: () => void;
}

export default function TaskCreateForm({ onTaskCreated }: TaskCreateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TaskCreateFormData>({
    resolver: zodResolver(taskCreateSchema),
    defaultValues: {
      module_name: 'Notes',
      sub_module_name: 'Notes',
      task_type: 'Notes',
      status: 'ACTIVE',
      priority: 'Medium',
    },
  });

  const selectedAssignedToUuid = watch('assigned_to_uuid');

  const onSubmit = async (data: TaskCreateFormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Get current user info from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      // Format dates
      const today = new Date();
      const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

      const taskData: CreateTaskModuleWiseRequest = {
        ...data,
        created_by_uuid: currentUser.user_uuid || 'b7ec28f2-7893-4969-8771-f05e9730421e',
        created_by_name: currentUser.full_name || 'Current User',
        date_created: todayStr,
        status: data.status || 'ACTIVE',
      };

      console.log('📝 [TASK FORM] Submitting task data:', taskData);

      const response = await taskService.createTaskModuleWise(taskData);

      console.log('✅ [TASK FORM] Task created successfully:', response);

      setSubmitMessage({
        type: 'success',
        text: `Task created successfully! Task Code: ${response.data.task_module_wise_code}`,
      });

      // Reset form
      reset();

      // Notify parent component
      onTaskCreated?.();
    } catch (error: any) {
      console.error('❌ [TASK FORM] Error creating task:', error);
      setSubmitMessage({
        type: 'error',
        text: error.response?.data?.error?.message || 'Failed to create task. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignedToChange = (uuid: string) => {
    setValue('assigned_to_uuid', uuid);
    const user = mockUsers.find((u) => u.uuid === uuid);
    if (user) {
      setValue('assigned_to_name', user.name);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Card>
          <CardHeader
            title="Create New Task"
            subheader="Fill in the details to create a new task"
          />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                {/* Module Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Module Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    {...register('module_name')}
                    fullWidth
                    label="Module Name"
                    error={!!errors.module_name}
                    helperText={errors.module_name?.message}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    {...register('sub_module_name')}
                    fullWidth
                    label="Sub Module Name"
                    error={!!errors.sub_module_name}
                    helperText={errors.sub_module_name?.message}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    {...register('module_reference_column')}
                    fullWidth
                    label="Module Reference Column"
                    error={!!errors.module_reference_column}
                    helperText={errors.module_reference_column?.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    {...register('module_reference_code_or_id')}
                    fullWidth
                    label="Module Reference Code/ID"
                    error={!!errors.module_reference_code_or_id}
                    helperText={errors.module_reference_code_or_id?.message}
                  />
                </Grid>

                {/* Task Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Task Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    {...register('task_name')}
                    fullWidth
                    label="Task Name"
                    error={!!errors.task_name}
                    helperText={errors.task_name?.message}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Task Type</InputLabel>
                    <Select {...register('task_type')} label="Task Type" error={!!errors.task_type}>
                      {taskTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...register('description')}
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      {...register('task_priority')}
                      label="Priority"
                      error={!!errors.task_priority}
                    >
                      {priorities.map((priority) => (
                        <MenuItem key={priority} value={priority}>
                          {priority}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select {...register('status')} label="Status" error={!!errors.status}>
                      {statuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Assignment */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Assignment
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Assigned To</InputLabel>
                    <Select
                      value={selectedAssignedToUuid || ''}
                      onChange={(e) => handleAssignedToChange(e.target.value)}
                      label="Assigned To"
                      error={!!errors.assigned_to_uuid}
                    >
                      {mockUsers.map((user) => (
                        <MenuItem key={user.uuid} value={user.uuid}>
                          {user.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Due Date */}
                <Grid item xs={12} md={6}>
                  <TextField
                    {...register('due_date')}
                    fullWidth
                    label="Due Date (MM/DD/YYYY)"
                    placeholder="09/27/2025"
                    error={!!errors.due_date}
                    helperText={errors.due_date?.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    {...register('due_time')}
                    fullWidth
                    label="Due Time"
                    placeholder="12:01 AM"
                    error={!!errors.due_time}
                    helperText={errors.due_time?.message}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={() => reset()} disabled={isSubmitting}>
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Task'}
                    </Button>
                  </Stack>
                </Grid>

                {/* Submit Message */}
                {submitMessage && (
                  <Grid item xs={12}>
                    <Alert severity={submitMessage.type}>{submitMessage.text}</Alert>
                  </Grid>
                )}
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
