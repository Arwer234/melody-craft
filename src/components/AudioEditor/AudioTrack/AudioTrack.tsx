import { Box, Fade, IconButton, useTheme } from '@mui/material';
import { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { AudioTrackProps } from './AudioTrack.types';
import { audioContext } from '../AudioEditor.constants';
import { TIMELINE_TILE_DURATION } from '../AudioTimeline/AudioTimeline.constants';
import { Add, Delete } from '@mui/icons-material';

export default function AudioTrack({
  isPlaying,
  options,
  startTime = 0,
  seekTime,
  onFinish,
  onSeek,
  onDblClick,
  onDragEnd,
  onRemove,
  onAdd,
  filters,
  isSelected,
  volume,
}: AudioTrackProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  console.log(startTime);

  const theme = useTheme();

  function handleSeeked() {
    if (audioRef && audioRef.current && audioRef.current.currentTime > 0) {
      onSeek((audioRef.current.currentTime + startTime) * 1000);
    }
  }

  function handleCanPlay() {
    const mediaNode = audioContext.createMediaElementSource(audioRef.current!);

    // @ts-expect-error - typescript doesn't know about the AudioContext's createBiquadFilter method
    const equalizer = filters.reduce((prev, curr) => {
      prev.connect(curr);
      return curr;
    }, mediaNode);

    // Connect the filters to the audio output
    equalizer.connect(audioContext.destination);
  }

  function handleLoadedMetadata(audio: HTMLAudioElement) {
    wavesurferRef.current = WaveSurfer.create({
      ...options,
      container: `#${options.container as string}`,
      media: audio,
      width: (audio.duration * TIMELINE_TILE_DURATION) / 10,
      waveColor: isSelected ? '#00b0ff' : '#ccc',
      progressColor: isSelected ? '#00b0ff' : '#ccc',
    });

    wavesurferRef.current?.on('dblclick', onDblClick);

    if (audioRef.current) {
      audioRef.current.addEventListener('canplay', handleCanPlay, { once: true });
      audioRef.current.addEventListener('ended', onFinish);
    }
  }

  function handleDragEnd(event: React.DragEvent<HTMLDivElement>) {
    if (event.currentTarget === null || audioRef.current === null) return;

    const timelineWidth = event.currentTarget.offsetWidth;
    const newTimePosition = event.clientX - event.currentTarget.getBoundingClientRect().left;
    const newTime = (newTimePosition / timelineWidth) * audioRef.current.duration + startTime;

    onDragEnd(newTime);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleAddClick() {
    if (audioRef.current) {
      const newTime = audioRef.current?.duration + startTime;
      onAdd(newTime);
    }
  }

  useEffect(() => {
    if (!audioRef.current) {
      console.log('creating audio element', options.url, options.container);
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.src = options.url!;
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;

      audioRef.current.addEventListener(
        'loadedmetadata',
        () => handleLoadedMetadata(audioRef.current as HTMLAudioElement),
        {
          once: true,
        },
      );
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', onFinish);
        audioRef.current.removeEventListener('seeking', handleSeeked);
        audioRef.current.removeEventListener('canplay', handleCanPlay);
        audioRef.current.removeEventListener('loadedmetadata', () =>
          handleLoadedMetadata(audioRef.current as HTMLAudioElement),
        );
        audioRef.current.parentNode?.removeChild(audioRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // TODO: change color to match theme
  useEffect(() => {
    if (isSelected && wavesurferRef.current) {
      wavesurferRef.current?.setOptions({ waveColor: '#00b0ff', progressColor: '#00b0ff' });
    } else if (wavesurferRef.current) {
      wavesurferRef.current?.setOptions({ waveColor: '#ccc', progressColor: '#ccc' });
    }
  }, [isSelected]);

  useEffect(() => {
    if (audioRef.current && !isPlaying) {
      void audioRef.current.pause();
    } else if (audioRef.current && isPlaying) {
      void audioRef.current.play();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current && seekTime !== null && seekTime >= startTime * 1000) {
      audioRef.current.currentTime = (seekTime - startTime * 1000) / 1000;
    } else if (audioRef.current && seekTime !== null && seekTime < startTime * 1000) {
      audioRef.current.currentTime = 0;
    } else if (audioRef.current && seekTime !== null && seekTime >= audioRef.current.duration) {
      audioRef.current.currentTime = audioRef.current.duration;
    }
  }, [seekTime, startTime]);

  useEffect(() => {
    if (audioRef && audioRef.current) audioRef.current.addEventListener('seeking', handleSeeked);
    return () => {
      if (audioRef && audioRef.current)
        audioRef.current.removeEventListener('seeking', handleSeeked);
    };
  }, [startTime]);

  return (
    <Box
      width={audioRef.current ? (audioRef.current?.duration * TIMELINE_TILE_DURATION) / 10 : 0}
      onDragOver={handleDragOver}
      id={`${options.container as string}-track-path`}
      sx={{
        backgroundColor: volume === 0 ? theme.palette.background.paper : undefined,
        opacity: volume === 0 ? 0.2 : undefined,
        transition: 'background-color 0.3s, opacity 0.3s',
      }}
      position="relative"
    >
      <Box
        width={audioRef.current ? (audioRef.current?.duration * TIMELINE_TILE_DURATION) / 10 : 0}
        id={options.container as string}
        ref={containerRef}
        onDragEnd={handleDragEnd}
        draggable
        sx={{
          marginLeft: (startTime * TIMELINE_TILE_DURATION) / 80,
        }}
        position="absolute"
      >
        <Fade in={!!audioRef.current}>
          <Box position="absolute" right={-8} zIndex={1000} display="flex" flexDirection="column">
            <IconButton size="small" onClick={handleAddClick}>
              <Add fontSize="inherit" />
            </IconButton>
            <IconButton size="small" onClick={onRemove}>
              <Delete fontSize="inherit" />
            </IconButton>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}
