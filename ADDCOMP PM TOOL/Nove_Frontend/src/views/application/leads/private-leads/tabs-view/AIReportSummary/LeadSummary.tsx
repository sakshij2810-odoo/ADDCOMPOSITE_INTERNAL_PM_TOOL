import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ILeadAIReportSummary } from "src/redux";

export const AILeadReportSummary = ({ data }: { data: ILeadAIReportSummary }) => {
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Paper sx={{ p: 3, mb: 4 }} elevation={5}>
        <Typography variant="h6" gutterBottom>Lead Details</Typography>
        <Grid container spacing={2}>
          {Object.entries(data.lead_details).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Typography variant="subtitle2" color="textSecondary">
                {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </Typography>
              <Typography>{value}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }} elevation={5}>
        <Typography variant="h6" gutterBottom>CRS Breakdown</Typography>
        <Grid container spacing={2}>
          {Object.entries(data.crs_breakdown).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <Typography variant="subtitle2" color="textSecondary">
                {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </Typography>
              <Typography>{value}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }} elevation={5}>
        <Typography variant="h6" gutterBottom>Eligibility</Typography>
        <Grid container spacing={2}>
          {Object.entries(data.eligibility).map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <Typography variant="subtitle2" color="textSecondary">
                {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </Typography>
              <Typography>{value}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }} elevation={5}>
        <Typography variant="h6" gutterBottom>Recommendations</Typography>
        <Grid container spacing={2}>
          {Object.entries(data.recommendations).map(([key, value]) => (
            <Grid item xs={12} md={6} key={key}>
              <Typography variant="subtitle2" color="textSecondary">
                {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </Typography>
              <Typography>{value}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }} elevation={5}>
        <Typography variant="h6" gutterBottom>Last 10 CRS Draws</Typography>
        {/* Bar Chart */}
        <Box sx={{ height: 400, mt: 4 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.last_ten_crs_draws}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="draw" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cutoff" fill="#3b82f6" name="CRS Cutoff Score" />
              <Bar dataKey="ITAs" fill="#10b981" name="ITAs Issued" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>


    </Box>
  );
};