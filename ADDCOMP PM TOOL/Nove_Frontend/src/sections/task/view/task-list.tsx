import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { taskService, TaskModuleWise } from '../../../services/task.service';

interface TaskListProps {
  onEdit?: (task: TaskModuleWise) => void;
  onView?: (task: TaskModuleWise) => void;
  onCreateNew?: () => void;
}

export default function TaskList({ onEdit, onView, onCreateNew }: TaskListProps) {
  const [tasks, setTasks] = useState<TaskModuleWise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<TaskModuleWise | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    module_name: '',
  });

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📝 [TASK LIST] Loading tasks with filters:', filters);
      const response = await taskService.getTasks({
        status: filters.status || undefined,
        module_name: filters.module_name || undefined,
        pageNo: 1,
        itemPerPage: 50,
      });

      console.log('✅ [TASK LIST] Tasks loaded successfully:', response);
      setTasks(response.data);
    } catch (err: any) {
      console.error('❌ [TASK LIST] Error loading tasks:', err);
      setError(err.response?.data?.error?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const handleDelete = async (task: TaskModuleWise) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete?.task_module_wise_uuid) return;

    try {
      console.log('📝 [TASK LIST] Deleting task:', taskToDelete.task_module_wise_uuid);
      await taskService.deleteTask(taskToDelete.task_module_wise_uuid);
      console.log('✅ [TASK LIST] Task deleted successfully');

      // Reload tasks
      await loadTasks();

      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (err: any) {
      console.error('❌ [TASK LIST] Error deleting task:', err);
      setError(err.response?.data?.error?.message || 'Failed to delete task');
    }
  };

  const getPriorityColor = (priority?: string | null) => {
    switch (priority) {
      case 'Urgent':
        return 'error';
      case 'High':
        return 'warning';
      case 'Medium':
        return 'info';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status?: string | null) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'COMPLETED':
        return 'info';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    return dateStr;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Tasks</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateNew}>
          Create New Task
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Module</InputLabel>
                <Select
                  value={filters.module_name}
                  onChange={(e) => setFilters({ ...filters, module_name: e.target.value })}
                  label="Module"
                >
                  <MenuItem value="">All Modules</MenuItem>
                  <MenuItem value="Notes">Notes</MenuItem>
                  <MenuItem value="Follow-up">Follow-up</MenuItem>
                  <MenuItem value="Review">Review</MenuItem>
                  <MenuItem value="Approval">Approval</MenuItem>
                  <MenuItem value="Documentation">Documentation</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                onClick={() => setFilters({ status: '', module_name: '' })}
                fullWidth
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tasks Table */}
      <Card>
        <CardHeader title={`Tasks (${tasks.length})`} />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task Code</TableCell>
                  <TableCell>Task Name</TableCell>
                  <TableCell>Module</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No tasks found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => (
                    <TableRow key={task.task_module_wise_uuid}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {task.task_module_wise_code}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{task.task_name}</Typography>
                        {task.description && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {task.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{task.module_name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {task.sub_module_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {task.assigned_to_name || 'Unassigned'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.task_priority || 'N/A'}
                          color={getPriorityColor(task.task_priority)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.status || 'N/A'}
                          color={getStatusColor(task.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDate(task.due_date)}</Typography>
                        {task.due_time && (
                          <Typography variant="caption" color="text.secondary">
                            {task.due_time}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDate(task.date_created)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton size="small" onClick={() => onView?.(task)} title="View">
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => onEdit?.(task)} title="Edit">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(task)}
                            title="Delete"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the task "{taskToDelete?.task_name}"? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
