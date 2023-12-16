import { Box } from '@mui/material';
import { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { AudioTrackProps } from './AudioTrack.types';
import { audioContext } from '../AudioEditor.constants';
import { TIMELINE_TILE_DURATION } from '../AudioTimeline/AudioTimeline.constants';
export default function AudioTrack({
  isPlaying,
  options,
  startTime = 0,
  currentTime,
  onFinish,
  onSeek,
  onPause,
  onDblClick,
  onDragEnd,
  filters,
  isSelected,
}: AudioTrackProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const draggedElementRef = useRef<HTMLDivElement | null>(null);
  const startTimeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const timeDiff = startTime - currentTime > 0 ? (startTime - currentTime) * 1000 : 0;

  function handleSeeked() {
    if (audioRef && audioRef.current && audioRef.current.currentTime > 0) {
      onSeek(audioRef.current.currentTime + startTime);
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
      audioRef.current.addEventListener('seeking', handleSeeked);
    }
  }

  function handleDragStart(event: React.DragEvent<HTMLDivElement>) {
    draggedElementRef.current = event.currentTarget;
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

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.src = options.url!;
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

  // TODO: change color to match theme
  useEffect(() => {
    if (isSelected && wavesurferRef.current) {
      wavesurferRef.current?.setOptions({ waveColor: '#00b0ff', progressColor: '#00b0ff' });
    } else if (wavesurferRef.current) {
      wavesurferRef.current?.setOptions({ waveColor: '#ccc', progressColor: '#ccc' });
    }
  }, [isSelected]);

  useEffect(() => {
    const time = currentTime - startTime;

    console.log(startTimeTimeoutRef.current);

    if (startTimeTimeoutRef.current) {
      clearTimeout(startTimeTimeoutRef.current);
      startTimeTimeoutRef.current = setTimeout(() => {
        void audioRef.current?.play();
      }, timeDiff);
    }

    if (time < 0) audioRef.current!.currentTime = 0;
    else if (audioRef.current && time < audioRef.current.duration)
      audioRef.current.currentTime = time;
    else if (audioRef.current && time >= audioRef.current.duration) {
      audioRef.current.currentTime = audioRef.current.duration;
      onFinish();
    }
  }, [currentTime]);

  useEffect(() => {
    if (audioRef.current && startTime > 0 && isPlaying) {
      startTimeTimeoutRef.current = setTimeout(() => {
        void audioRef.current?.play();
      }, timeDiff);
    } else if (audioRef.current && !isPlaying) {
      void audioRef.current.pause();

      if (startTimeTimeoutRef.current) {
        clearTimeout(startTimeTimeoutRef.current);
      }
    } else if (audioRef.current && !startTime && isPlaying) {
      void audioRef.current.play();
    }

    return () => {
      if (startTimeTimeoutRef.current) {
        clearTimeout(startTimeTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <Box width="100%" onDragOver={handleDragOver} id={`${options.container as string}-track-path`}>
      <Box
        width={audioRef.current ? (audioRef.current?.duration * TIMELINE_TILE_DURATION) / 10 : 0}
        id={options.container as string}
        ref={containerRef}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        draggable
        sx={{
          marginLeft: (startTime * TIMELINE_TILE_DURATION) / 80,
        }}
      />
    </Box>
  );
}
