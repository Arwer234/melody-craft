import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { WaveSurferOptions } from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import AudioEditor from '../../components/AudioEditor/AudioEditor';

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

export default function Editor() {
  return <AudioEditor />;
}
