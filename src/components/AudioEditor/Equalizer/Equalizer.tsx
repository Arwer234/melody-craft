import { Box, Paper, Slider, Typography } from '@mui/material';

export default function Equalizer({
  filters,
  onFilterChange,
}: {
  filters: Array<BiquadFilterNode>;
  onFilterChange: (newFilters: Array<BiquadFilterNode>) => void;
}) {
  return (
    <Paper sx={{ margin: 1 }}>
      <Box margin={1} height={200} display="flex" gap={8} justifyContent="center">
        {filters.map((filter, key) => {
          return (
            <Box key={`${filter.type} ${key}`}>
              <Slider
                orientation="vertical"
                min={-40}
                max={40}
                value={filter.gain.value}
                onChange={(_event: Event, newValue: number | Array<number>) => {
                  const newFilters = [...filters];
                  newFilters[key].gain.value = newValue as number;
                  onFilterChange(newFilters);
                }}
                valueLabelDisplay="auto"
              />
              <Typography variant="caption">{filter.frequency.value}</Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
