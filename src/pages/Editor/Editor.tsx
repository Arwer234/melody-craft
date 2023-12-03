import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { WaveSurferOptions } from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';

const plugins = [
  {
    plugin: TimelinePlugin,
    key: 'timeline',
    options: {
      container: '#timeline',
    },
  },
  {
    plugin: RegionsPlugin,
    key: 'regions',
    options: { dragSelection: true },
  },
];

const wavesurferOptions: WaveSurferOptions = {
  container: '#waveform',
  waveColor: '#4F4A85',
  progressColor: '#383351',
  url: 'test.mp3',
};

export default function Editor() {
  const containerRef = useRef(null);
  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      ...wavesurferOptions,
    });
    void waveSurfer.load('test.mp3');

    return () => {
      waveSurfer.destroy();
    };
  }, []);
  return (
    <Box>
      <Box id="waveform" ref={containerRef} />
      <Box id="timeline"></Box>
    </Box>
  );
}
