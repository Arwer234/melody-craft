import { Box, Button } from '@mui/material';
import { useEffect, useRef } from 'react';
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js';

const wavesurferOptions: WaveSurferOptions = {
  container: '#waveform',
  waveColor: '#4F4A85',
  progressColor: '#383351',
  url: 'test.mp3',
};

export default function AudioEditor() {
  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      ...wavesurferOptions,
    });
    void waveSurfer.load('test.mp3');
    waveSurfer.on('ready', () => {
      waveSurferRef.current = waveSurfer;
    });

    return () => {
      waveSurfer.destroy();
    };
  }, []);

  return (
    <Box>
      <Box id="waveform" ref={containerRef} />
      <Box id="timeline"></Box>
      <Button onClick={() => waveSurferRef.current.playPause()}>play/pause</Button>
    </Box>
  );
}
