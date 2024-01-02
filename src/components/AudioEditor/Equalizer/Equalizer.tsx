import { Box, Paper, Slider, Typography } from '@mui/material';

export default function Equalizer({
  filters,
  onFilterChange,
}: {
  filters: Array<BiquadFilterNode>;
  onFilterChange: (newFilters: Array<BiquadFilterNode>) => void;
}) {
  console.log(filters);
  return (
    <Paper>
      <Box display="flex" gap={8} justifyContent="center" padding={2} flexWrap="wrap">
        {filters.map((filter, key) => {
          return (
            <Box
              key={`${filter.type} ${key}`}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              height={120}
            >
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
              <Typography variant="caption">{`${filter.type} (${filter.frequency.value})`}</Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
