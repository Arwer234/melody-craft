import { Box, Paper, Slider, Tooltip, Typography } from '@mui/material';
import { EQUALIZER_MARKS } from './Equalizer.constants';

export default function Equalizer({
  filters,
  onFilterChange,
}: {
  filters: Array<BiquadFilterNode>;
  onFilterChange: (newFilters: Array<BiquadFilterNode>) => void;
}) {
  return (
    <Paper>
      <Box display="flex" gap={2} justifyContent="space-around" padding={2} flexWrap="wrap">
        {filters.map((filter, key) => {
          return (
            <Box
              key={`${filter.type} ${key}`}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              height={140}
            >
              <Slider
                orientation="vertical"
                min={-40}
                max={40}
                marks={EQUALIZER_MARKS}
                value={filter.gain.value}
                onChange={(_event: Event, newValue: number | Array<number>) => {
                  const newFilters = [...filters];
                  newFilters[key].gain.value = newValue as number;
                  onFilterChange(newFilters);
                }}
                valueLabelDisplay="auto"
              />
              <Box pt={1}>
                <Tooltip title="Frequency to be filtered">
                  <Typography variant="caption">{`${filter.frequency.value} Hz`}</Typography>
                </Tooltip>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
