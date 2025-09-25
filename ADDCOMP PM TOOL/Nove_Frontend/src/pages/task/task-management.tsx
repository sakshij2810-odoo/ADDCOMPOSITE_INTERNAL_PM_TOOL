import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import TaskCreateForm from '../../sections/task/view/task-create-form';
import TaskList from '../../sections/task/view/task-list';
import { TaskModuleWise } from '../../services/task.service';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `task-tab-${index}`,
    'aria-controls': `task-tabpanel-${index}`,
  };
}

export default function TaskManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTaskCreated = () => {
    // Switch to list tab and refresh
    setTabValue(1);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEditTask = (task: TaskModuleWise) => {
    // Switch to create tab for editing
    setTabValue(0);
    // You could pass the task data to the form for editing
    console.log('Edit task:', task);
  };

  const handleViewTask = (task: TaskModuleWise) => {
    console.log('View task:', task);
    // You could open a modal or navigate to a detail page
  };

  const handleCreateNew = () => {
    setTabValue(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="task management tabs">
            <Tab label="Create Task" {...a11yProps(0)} />
            <Tab label="Task List" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <TaskCreateForm onTaskCreated={handleTaskCreated} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TaskList
            key={refreshTrigger} // This will force re-render when refreshTrigger changes
            onEdit={handleEditTask}
            onView={handleViewTask}
            onCreateNew={handleCreateNew}
          />
        </TabPanel>
      </Paper>
    </Box>
  );
}
