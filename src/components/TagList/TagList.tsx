import { Box, Chip, useTheme } from '@mui/material';
import { TagListProps } from './TagList.types';
import React, { useState, useRef, useEffect } from 'react';
import { hexToRgba } from '../../utils';

export default function TagList({ tags, selectedTags, onTagClick }: TagListProps) {
  const [isScrolledToMax, setIsScrolledToMax] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const prevX = useRef(0);

  const theme = useTheme();

  function handleScroll(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const { scrollLeft, scrollWidth, clientWidth } = event.currentTarget;
    const element = event.target as HTMLDivElement;
    const maxScrollLeft = element.scrollWidth - element.clientWidth;

    setIsOverflowing(element.scrollLeft < maxScrollLeft);
    setIsScrolledToMax(scrollLeft + clientWidth >= scrollWidth);
  }

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    isDragging.current = true;
    prevX.current = event.clientX;
  }

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!isDragging.current) return;
    const newX = event.clientX;
    const diffX = prevX.current - newX;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += diffX;
    }
    prevX.current = newX;
  }

  function handleMouseUp() {
    isDragging.current = false;
  }

  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;
      setIsOverflowing(scrollLeft < maxScrollLeft);
    }
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        '&::after': isOverflowing
          ? {
              /* Fade out right edge */ content: '""',
              position: 'absolute',
              top: 0,
              right: '-1px',
              width: 40,
              height: '100%',
              backgroundImage: isScrolledToMax
                ? 'none'
                : `linear-gradient(to right, ${hexToRgba(
                    theme.palette.background.paper,
                    0,
                  )}, ${hexToRgba(theme.palette.background.paper, 1)})`,
            }
          : {},
      }}
    >
      <Box
        ref={scrollContainerRef}
        display="flex"
        gap={1}
        sx={{
          overflowX: 'scroll',
          scrollbarWidth: 'none' /* For Firefox */,
          '&::-webkit-scrollbar': {
            /* For Chrome, Safari, and Opera */ display: 'none',
          },
          width: '100%',
          height: '100%',
        }}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {tags.map(tag => (
          <Chip
            key={tag}
            label={tag}
            color={selectedTags ? (selectedTags.includes(tag) ? 'primary' : 'default') : 'default'}
            onClick={onTagClick ? () => onTagClick(tag) : undefined}
          />
        ))}
      </Box>
    </Box>
  );
}
