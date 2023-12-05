import { Box } from '@mui/material';
import { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { AudioTrackProps } from './AudioTrack.types';

export default function AudioTrack({ isPlaying, options, onFinish }: AudioTrackProps) {
  const containerRef = useRef(null);
  const waveSurferRef = useRef<WaveSurfer>(null);

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      ...options,
      container: `#${options.container as string}`,
    });
    void waveSurfer.load('test.mp3');

    waveSurfer.on('ready', () => {
      waveSurferRef.current = waveSurfer;
      console.log('ready');
    });
    waveSurfer.on('finish', () => {
      console.log('finished');
    });

    return () => {
      waveSurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveSurferRef.current && isPlaying === true) {
      void waveSurferRef.current.playPause();
    } else if (waveSurferRef.current && isPlaying === false) {
      void waveSurferRef.current.playPause();
    }
  }, [isPlaying]);
  return (
    <Box>
      <Box id={options.container as string} ref={containerRef} />
    </Box>
  );
}
