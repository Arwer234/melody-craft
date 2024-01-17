import { Box, Paper, TextField } from '@mui/material';
import TagList from '../TagList/TagList';
import React from 'react';
import { SearchBarProps } from './SearchBar.types';

export default function SearchBar({
  searchValue,
  onSearchValueChange,
  tags,
  onTagClick,
  selectedTags,
}: SearchBarProps) {
  return (
    <Paper sx={{ padding: 2 }}>
      <Box width="100%" display="flex" flexDirection="column" gap={2}>
        <TextField
          fullWidth
          label="Track name"
          value={searchValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onSearchValueChange(event.target.value)
          }
        />
        <TagList tags={tags} selectedTags={selectedTags} onTagClick={onTagClick} />
      </Box>
    </Paper>
  );
}
