import { useEffect, useState } from 'react';
import { EQUALIZER_BANDS } from './Equalizer/Equalizer.constants';
import Equalizer from './Equalizer/Equalizer';
import AudioTrack from './AudioTrack/AudioTrack';
import { DEFAULT_WAVESURFER_OPTIONS } from './AudioEditor.constants';
import { Box, IconButton } from '@mui/material';
import { PlayArrow, Stop } from '@mui/icons-material';

const audioContext = new AudioContext();
const filters = EQUALIZER_BANDS.map(band => {
  const filter = audioContext.createBiquadFilter();
  filter.type = band <= 32 ? 'lowshelf' : band >= 16000 ? 'highshelf' : 'peaking';
  filter.gain.value = 0;
  filter.Q.value = 1; // resonance
  filter.frequency.value = band; // the cut-off frequency
  return filter;
});

export default function AudioEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [equalizer, setEqualizer] = useState(filters);
  const [wavesurferOptions, setWavesurferOptions] = useState([DEFAULT_WAVESURFER_OPTIONS]);

  function onFilterChange(newFilters: Array<BiquadFilterNode>) {
    setEqualizer(newFilters);
  }

  // useEffect(() => {
  //   const audios = [];
  //   for (const audio of SAMPLE_AUDIOS) {
  //     const newAudio = new Audio();
  //     newAudio.src = audio;

  //     newAudio.addEventListener(
  //       'canplay',
  //       () => {
  //         // Create a MediaElementSourceNode from the audio element
  //         const mediaNode = audioContext.createMediaElementSource(newAudio);

  //         // Connect the filters and media node sequentially
  //         const equalizer = filters.reduce((prev, curr) => {
  //           //What does the connect function do here?
  //           prev.connect(curr);
  //           return curr;
  //         }, mediaNode);

  //         // Connect the filters to the audio output
  //         equalizer.connect(audioContext.destination);
  //       },
  //       { once: true },
  //     );

  //     audios.push(newAudio);
  //   }
  // }, []);

  return (
    <Box height="100%">
      <Box display="flex" flexDirection="column" gap={1}>
        {wavesurferOptions.map((track, index) => (
          <AudioTrack
            key={index}
            isPlaying={isPlaying}
            options={track}
            onFinish={() => setIsPlaying(false)}
          />
        ))}
      </Box>
      <Box height="20%" display="flex" flexDirection="column">
        <IconButton onClick={() => setIsPlaying(previousValue => !previousValue)}>
          {isPlaying ? <Stop /> : <PlayArrow />}
        </IconButton>
        <Equalizer filters={filters} onFilterChange={onFilterChange} />
      </Box>
    </Box>
  );
}
