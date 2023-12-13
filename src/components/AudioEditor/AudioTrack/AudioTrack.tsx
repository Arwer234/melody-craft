import { Box } from '@mui/material';
import { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { AudioTrackProps } from './AudioTrack.types';
import { audioContext } from '../AudioEditor.constants';
import { TIMELINE_TILE_DURATION } from '../AudioTimeline/AudioTimeline.constants';
export default function AudioTrack({
  isPlaying,
  options,
  currentTime,
  onFinish,
  onSeek,
  filters,
}: AudioTrackProps) {
  const containerRef = useRef(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  function handleEnded() {
    onFinish();
  }

  function handleSeeked() {
    if (audioRef && audioRef.current && audioRef.current.currentTime > 0) {
      onSeek(audioRef.current.currentTime);
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
    });

    if (audioRef.current) {
      audioRef.current.addEventListener('canplay', handleCanPlay, { once: true });
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('seeking', handleSeeked);
    }
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
      if (wavesurferRef.current) wavesurferRef.current.destroy();
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
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
    if (audioRef.current && currentTime < audioRef.current.duration) {
      audioRef.current.currentTime = currentTime;
    } else if (audioRef.current && currentTime >= audioRef.current.duration) {
      audioRef.current.currentTime = audioRef.current.duration;
      handleEnded();
    }
  }, [currentTime]);

  useEffect(() => {
    if (audioRef && audioRef.current && isPlaying && currentTime < audioRef.current.duration) {
      void audioRef.current.play();
    }

    if (audioRef && audioRef.current && !isPlaying) {
      void audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <Box>
      <Box id={options.container as string} ref={containerRef} />
    </Box>
  );
}
