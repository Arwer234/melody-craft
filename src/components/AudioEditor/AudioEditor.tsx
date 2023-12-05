import { useEffect, useState } from 'react';
import Equalizer from './Equalizer/Equalizer';
import AudioTrack from './AudioTrack/AudioTrack';
import { DEFAULT_WAVESURFER_OPTIONS, audioContext } from './AudioEditor.constants';
import { Box } from '@mui/material';
import { EQUALIZER_BANDS } from './Equalizer/Equalizer.constants';
import AudioTimeline from './AudioTimeline/AudioTimeline';
import Controls from './Controls/Controls';
import { TrackState } from './AudioEditor.types';

export default function AudioEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [tracksState, setTracksState] = useState<Array<TrackState>>([
    ...DEFAULT_WAVESURFER_OPTIONS.map(() => 'ready' as TrackState),
  ]);
  const [equalizer, setEqualizer] = useState([
    ...DEFAULT_WAVESURFER_OPTIONS.map(() =>
      EQUALIZER_BANDS.map(band => {
        const filter = audioContext.createBiquadFilter();
        filter.type = band <= 32 ? 'lowshelf' : band >= 16000 ? 'highshelf' : 'peaking';
        filter.gain.value = 0;
        filter.Q.value = 1; // resonance
        filter.frequency.value = band; // the cut-off frequency
        return filter;
      }),
    ),
  ]);

  const [tracks, setTracks] = useState([...DEFAULT_WAVESURFER_OPTIONS]);
  const [selectedTrackId, setSelectedTrackId] = useState(0);

  function onFilterChange(newFilters: Array<BiquadFilterNode>) {
    setEqualizer(previousValue => {
      const newEqualizer = [...previousValue];
      newEqualizer[selectedTrackId] = newFilters;
      return newEqualizer;
    });
  }

  function onTrackFinish(index: number) {
    setTracksState(previousValue =>
      previousValue.map((value, i) => (i === index ? 'finished' : value)),
    );
  }

  // TODO: Bug - when seeked twice to the same time, the tracks desync
  // TODO: Bug - when seeked to the end, the tracks desync, connected to the currentTime being not up to date
  function onTrackSeek(time: number) {
    setCurrentTime(time);
    setTracksState(previousValue => {
      return previousValue.map(trackState => {
        if (trackState === 'finished') {
          return 'playing';
        } else return trackState;
      });
    });
  }

  function onPlayToggle() {
    if (!isPlaying) {
      setTracksState(previousValue => {
        return previousValue.map(trackState => {
          if (trackState === 'ready' || trackState === 'paused') {
            return 'playing';
          } else return trackState;
        });
      });
    } else {
      setTracksState(previousValue => {
        return previousValue.map(trackState => {
          if (trackState === 'playing') {
            return 'paused';
          } else return trackState;
        });
      });
    }

    setIsPlaying(previousValue => !previousValue);
    if (audioContext.state !== 'running') {
      void audioContext.resume();
    }
  }

  function onSkipPrevious() {
    onTrackSeek(0);
  }

  function onSkipNext() {
    // TODO: skip to the end
    onTrackSeek(1);
  }

  useEffect(() => {
    if (tracksState.every(trackState => trackState === 'finished')) {
      setIsPlaying(false);
      setTracksState(previousValue => previousValue.map(() => 'ready'));
      setCurrentTime(0);
    }
  }, [tracksState]);

  return (
    <Box height="100%">
      <Controls
        isPlaying={isPlaying}
        onPlay={onPlayToggle}
        onSkipNext={onSkipNext}
        onSkipPrevious={onSkipPrevious}
      />
      <Box position="relative" sx={{ overflowX: 'scroll', overflowY: 'hidden' }}>
        {
          // TODO: add duration based on tracks
        }
        <AudioTimeline duration={238000} />
        <Box display="flex" flexDirection="column" gap={1}>
          {tracks.map((track, index) => (
            <AudioTrack
              key={`${track.url}_${index}`}
              isPlaying={isPlaying && tracksState[index] === 'playing'}
              options={track}
              onFinish={() => onTrackFinish(index)}
              onSeek={(time: number) => onTrackSeek(time)}
              currentTime={currentTime}
              filters={equalizer[index]}
            />
          ))}
        </Box>
      </Box>
      <Box height="20%" display="flex" flexDirection="column">
        <Equalizer filters={equalizer[0]} onFilterChange={onFilterChange} />
      </Box>
    </Box>
  );
}
