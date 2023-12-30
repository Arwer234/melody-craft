import { useEffect, useRef, useState } from 'react';
import Equalizer from './Equalizer/Equalizer';
import AudioTrack from './AudioTrack/AudioTrack';
import { DEFAULT_WAVESURFER_OPTIONS, audioContext } from './AudioEditor.constants';
import { Box, Grid, IconButton, Paper, Step, StepLabel, Stepper } from '@mui/material';
import { EQUALIZER_BANDS } from './Equalizer/Equalizer.constants';
import AudioTimeline from './AudioTimeline/AudioTimeline';
import Controls from './Controls/Controls';
import { Sample } from './AudioEditor.types';
import { VolumeOff, VolumeOffOutlined } from '@mui/icons-material';

export default function AudioEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [equalizers, setEqualizers] = useState([
    ...DEFAULT_WAVESURFER_OPTIONS.map(option => {
      const filters = EQUALIZER_BANDS.map(band => {
        const filter = audioContext.createBiquadFilter();
        filter.type = band <= 32 ? 'lowshelf' : band >= 16000 ? 'highshelf' : 'peaking';
        filter.gain.value = 0;
        filter.Q.value = 1; // resonance
        filter.frequency.value = band; // the cut-off frequency
        return filter;
      });
      return { id: option.id, filters };
    }),
  ]);
  const [playlines, setPlaylines] = useState<Array<Array<Sample>>>([
    [DEFAULT_WAVESURFER_OPTIONS[0], DEFAULT_WAVESURFER_OPTIONS[2]],
    [DEFAULT_WAVESURFER_OPTIONS[1]],
  ]);

  const [volumes, setVolumes] = useState([
    ...DEFAULT_WAVESURFER_OPTIONS.map(option => ({ id: option.id, value: 100 })),
  ]);
  const [selectedTrackId, setSelectedTrackId] = useState(DEFAULT_WAVESURFER_OPTIONS[0].id);
  const [activeStep, setActiveStep] = useState(0);

  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  function onFilterChange(newFilters: Array<BiquadFilterNode>) {
    setEqualizers(previousValue => {
      const newEqualizers = [...previousValue];
      const newEqualizerId = newEqualizers.findIndex(item => item.id === selectedTrackId);
      newEqualizers[newEqualizerId].filters = newFilters;
      return newEqualizers;
    });
  }

  function onSampleFinish(lineIndex: number, sampleIndex: number) {
    setPlaylines(previousValue => {
      const newPlaylines = [...previousValue];
      newPlaylines[lineIndex][sampleIndex].state = 'finished';
      return newPlaylines;
    });
  }

  // TODO: Bug - when seeked twice to the same time, the tracks desync
  function onSampleSeek(time: number) {
    setSeekTime(time);
    setCurrentTime(time);
    setPlaylines(previousValue => {
      const newPlaylines = [...previousValue];
      newPlaylines.forEach((line, lineIndex) => {
        line.forEach((sample, sampleIndex) => {
          if (sample.state === 'finished' && time < (sample.startTime ?? 0) * 1000) {
            newPlaylines[lineIndex][sampleIndex].state = 'playing';
          }
        });
      });
      return newPlaylines;
    });
  }

  function onPlayToggle() {
    if (!isPlaying) {
      setPlaylines(previousValue => {
        const newPlaylines = [...previousValue];
        newPlaylines.forEach((line, lineIndex) => {
          line.forEach((sample, sampleIndex) => {
            if (sample.state === 'ready' || sample.state === 'paused') {
              newPlaylines[lineIndex][sampleIndex].state = 'playing';
            }
          });
        });
        return newPlaylines;
      });
    } else {
      setPlaylines(previousValue => {
        const newPlaylines = [...previousValue];
        newPlaylines.forEach((line, lineIndex) => {
          line.forEach((sample, sampleIndex) => {
            if (sample.state === 'playing') {
              newPlaylines[lineIndex][sampleIndex].state = 'paused';
            }
          });
        });
        return newPlaylines;
      });
    }

    setIsPlaying(previousValue => !previousValue);
    if (audioContext.state !== 'running') {
      void audioContext.resume();
    }
  }

  function onSkipPrevious() {
    onSampleSeek(0);
  }

  function onSkipNext() {
    // TODO: skip to the end
    onSampleSeek(1);
  }

  function onDragEnd(time: number, lineIndex: number, sampleIndex: number) {
    setPlaylines(previousValue => {
      const newTracks = [...previousValue];
      newTracks[lineIndex][sampleIndex].startTime = time;
      return newTracks;
    });
  }

  function onVolumeChange(value: number, lineIndex: number) {
    const newVolumes = [...volumes];
    const selectedSamples = playlines[lineIndex];
    selectedSamples.forEach(sample => {
      const sampleIndex = newVolumes.findIndex(item => item.id === sample.id);
      newVolumes[sampleIndex].value = value;
    });
    setVolumes(newVolumes);
  }

  function onCopySample(time: number, id: string) {
    const copiedSample = {
      ...playlines
        .find(line => line.some(sample => sample.id === id))
        ?.find(sample => sample.id === id),
    } as Sample | undefined;
    if (copiedSample === undefined) return;

    copiedSample.container = `waveform_${Math.round(Math.random() * 100)}`;
    copiedSample.startTime = time;
    copiedSample.id = `${copiedSample.id}_${Math.round(Math.random() * 100)}`;

    const lineIndex = playlines.findIndex(line => line.some(sample => sample.id === id));

    setPlaylines(previousValue => {
      const newPlaylines = [...previousValue];
      newPlaylines[lineIndex].push(copiedSample);
      return newPlaylines;
    });
    setEqualizers(previousValue => {
      const newItem = {
        id: copiedSample.id,
        filters: equalizers.find(item => item.id === id)?.filters ?? [],
      };
      const newEqualizers = [...previousValue, newItem];

      return newEqualizers;
    });
  }

  function onRemoveSample(lineIndex: number, sampleIndex: number) {
    setPlaylines(previousValue => {
      const newPlaylines = [...previousValue];
      newPlaylines[lineIndex].splice(sampleIndex, 1);
      return newPlaylines;
    });
  }

  useEffect(() => {
    if (playlines.every(line => line.every(sample => sample.state === 'finished'))) {
      setIsPlaying(false);
      setPlaylines(previousValue =>
        previousValue.map(line => line.map(sample => ({ ...sample, state: 'ready' }))),
      );
      setCurrentTime(0);
    }
  }, [playlines]);

  useEffect(() => {
    if (isPlaying) {
      timeIntervalRef.current = setInterval(() => {
        setCurrentTime(previousTime => previousTime + 100);
      }, 100);
    } else if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, [isPlaying]);

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
          <AudioTimeline currentTime={currentTime} duration={238000} />
          <Box display="flex" flexDirection="column" gap={1}>
            {playlines.map((samples, lineIndex) => (
              <Box key={`playline_${lineIndex}`} display="flex" gap={4}>
                <Box display="flex">
                  <IconButton
                    onClick={() =>
                      onVolumeChange(
                        volumes.find(item => samples.some(sample => sample.id === item.id))
                          ?.value === 0
                          ? 100
                          : 0,
                        lineIndex,
                      )
                    }
                    size="large"
                  >
                    {volumes.find(item => samples.some(sample => sample.id === item.id))?.value ===
                    0 ? (
                      <VolumeOff color="primary" fontSize="inherit" />
                    ) : (
                      <VolumeOffOutlined fontSize="inherit" />
                    )}
                  </IconButton>
                </Box>
                <Box position="relative" height={128}>
                  {samples.map((sample, sampleIndex) => {
                    return (
                      <AudioTrack
                        isPlaying={
                          isPlaying &&
                          sample.state === 'playing' &&
                          (sample.startTime ? sample.startTime * 1000 : 0) <= currentTime
                        }
                        key={`${sample.url}_${sampleIndex}`}
                        isSelected={selectedTrackId === sample.id}
                        options={sample}
                        onFinish={() => onSampleFinish(lineIndex, sampleIndex)}
                        onSeek={(time: number) => onSampleSeek(time)}
                        seekTime={seekTime}
                        filters={equalizers.find(item => item.id === sample.id)?.filters ?? []}
                        volume={volumes.find(item => item.id === sample.id)?.value ?? 100}
                        onDblClick={() => setSelectedTrackId(sample.id)}
                        onDragEnd={(time: number) => onDragEnd(time, lineIndex, sampleIndex)}
                        startTime={sample.startTime}
                        onRemove={() => onRemoveSample(lineIndex, sampleIndex)}
                        onAdd={(time: number) => onCopySample(time, sample.id)}
                      />
                    );
                  })}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Grid container gap={2} width="100%">
          <Grid item xs={12}>
            <Equalizer
              filters={equalizers.find(item => item.id === selectedTrackId)?.filters ?? []}
              onFilterChange={onFilterChange}
            />
          </Grid>
        </Grid>
      </Box>
      <Controls
        isPlaying={isPlaying}
        onPlay={onPlayToggle}
        onSkipNext={onSkipNext}
        onSkipPrevious={onSkipPrevious}
      />
    </Box>
  );
}
