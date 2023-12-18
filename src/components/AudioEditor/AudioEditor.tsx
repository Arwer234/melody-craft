import { useEffect, useState } from 'react';
import Equalizer from './Equalizer/Equalizer';
import AudioTrack from './AudioTrack/AudioTrack';
import { DEFAULT_WAVESURFER_OPTIONS, audioContext } from './AudioEditor.constants';
import {
  Box,
  Grid,
  Paper,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
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
  const [volumes, setVolumes] = useState([...DEFAULT_WAVESURFER_OPTIONS.map(() => 50)]);
  const [selectedTrackId, setSelectedTrackId] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

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

  // TODO: Add sync currentTime
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

  function onDragEnd(time: number, index: number) {
    console.log(time);
    setTracks(previousValue => {
      const newTracks = [...previousValue];
      newTracks[index] = { ...newTracks[index], startTime: time };
      return newTracks;
    });
  }

  function handlePlayTimeUpdate(time: number) {
    setCurrentTime(time);
  }

  useEffect(() => {
    if (tracksState.every(trackState => trackState === 'finished')) {
      setIsPlaying(false);
      setTracksState(previousValue => previousValue.map(() => 'ready'));
      setCurrentTime(0);
    }
  }, [tracksState]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      width="100%"
      minHeight="100%"
    >
      <Box height="100%" display="flex" flexDirection="column" margin={2} gap={2}>
        <Stepper activeStep={activeStep}>
          <Step>
            <StepLabel>Create a track</StepLabel>
          </Step>
          <Step>
            <StepLabel>Select track settings</StepLabel>
          </Step>
          <Step>
            <StepLabel>Publish</StepLabel>
          </Step>
        </Stepper>
        <Box position="relative" sx={{ overflowX: 'scroll', overflowY: 'hidden', minHeight: 480 }}>
          {
            // TODO: add duration based on tracks
          }
          <AudioTimeline duration={238000} />
          <Box display="flex" flexDirection="column" gap={1}>
            {tracks.map((track, index) => (
              <AudioTrack
                key={`${track.url}_${index}`}
                isPlaying={isPlaying && tracksState[index] === 'playing'}
                isSelected={selectedTrackId === index}
                options={track}
                onFinish={() => onTrackFinish(index)}
                onSeek={(time: number) => onTrackSeek(time)}
                currentTime={currentTime}
                filters={equalizer[index]}
                volume={volumes[index]}
                onDblClick={() => setSelectedTrackId(index)}
                onDragEnd={(time: number) => onDragEnd(time, index)}
                onPause={index === 0 ? (time: number) => handlePlayTimeUpdate(time) : undefined}
                startTime={track.startTime}
              />
            ))}
          </Box>
        </Box>
        <Grid container gap={2} width="100%">
          <Grid item xs={8}>
            <Equalizer filters={equalizer[selectedTrackId]} onFilterChange={onFilterChange} />
          </Grid>
          <Grid item xs>
            <Paper
              sx={{ display: 'flex', height: 192, alignItems: 'center', justifyContent: 'center' }}
            >
              asdf
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Controls
        isPlaying={isPlaying}
        onPlay={onPlayToggle}
        onSkipNext={onSkipNext}
        onSkipPrevious={onSkipPrevious}
        onVolumeChange={(_event: Event, newValue: number | Array<number>) => {
          const newVolumes = [...volumes];
          newVolumes[selectedTrackId] = newValue as number;
          setVolumes(newVolumes);
        }}
        volume={volumes[selectedTrackId]}
      />
    </Box>
  );
}
