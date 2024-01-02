import { useContext, useEffect, useRef, useState } from 'react';
import Equalizer from './Equalizer/Equalizer';
import AudioTrack from './AudioTrack/AudioTrack';
import {
  DEFAULT_SAMPLE_OPTIONS,
  DEFAULT_WAVESURFER_OPTIONS,
  audioContext,
} from './AudioEditor.constants';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
import { EQUALIZER_BANDS } from './Equalizer/Equalizer.constants';
import AudioTimeline from './AudioTimeline/AudioTimeline';
import Controls from '../Controls/Controls';
import { EqualizerType, Sample } from './AudioEditor.types';
import { Add, VolumeOff, VolumeOffOutlined } from '@mui/icons-material';
import { SamplePicker } from './SamplePicker/SamplePicker';
import { StoreContext } from '../../providers/StoreProvider/StoreProvider';
import { FileType } from '../../pages/MyFiles/MyFiles.types';
import { getTracks } from '../../providers/StoreProvider/StoreProvider.helpers';
import { useQuery } from '@tanstack/react-query';
import { UIContext } from '../../providers/UIProvider/UIProvider';

export default function AudioEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTime, setSeekTime] = useState<number | null>(null);
  // ...DEFAULT_WAVESURFER_OPTIONS.map(option => {
  //   const filters = EQUALIZER_BANDS.map(band => {
  //     const filter = audioContext.createBiquadFilter();
  //     filter.type = band <= 32 ? 'lowshelf' : band >= 16000 ? 'highshelf' : 'peaking';
  //     filter.gain.value = 0;
  //     filter.Q.value = 1;
  //     filter.frequency.value = band;
  //     return filter;
  //   });
  //   return { id: option.id, filters };
  // }),
  const [equalizers, setEqualizers] = useState<Array<EqualizerType>>([]);
  //    [DEFAULT_WAVESURFER_OPTIONS[0], DEFAULT_WAVESURFER_OPTIONS[2]],
  const [playlines, setPlaylines] = useState<Array<Array<Sample>>>([]);

  const { data: userTracks, isLoading: isUserTracksLoading } = useQuery({
    queryKey: ['tracks'],
    queryFn: getTracks,
  });

  const [volumes, setVolumes] = useState([
    ...DEFAULT_WAVESURFER_OPTIONS.map(option => ({ id: option.id, value: 100 })),
  ]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [selectedExistingTrackId, setSelectedExistingTrackId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isTrackDialogOpen, setIsTrackDialogOpen] = useState(false);

  const { musicFilesMetadata, isMusicFilesMetadataLoaded } = useContext(StoreContext);
  const { showSnackbar } = useContext(UIContext);

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

  function onActiveSampleDragEnd(time: number, lineIndex: number, sampleIndex: number) {
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

  function onSamplePickerItemDrag(
    event: React.DragEvent<HTMLDivElement>,
    fileName: string,
    fileType: FileType,
  ) {
    console.log(event.currentTarget, fileName, fileType);
  }

  function onTrackSelect(isNewTrack: boolean, trackId?: string | null) {
    if (isNewTrack) setActiveStep(1);
    else {
      const selectedPlaylines = userTracks?.find(track => track.id === trackId)?.playlines;
      if (selectedPlaylines !== undefined) {
        const newPlaylines = selectedPlaylines.map(line =>
          line.map(sample => ({
            name: sample.name,
            url: sample.src,
            ...DEFAULT_SAMPLE_OPTIONS,
            container: `wavesurfer_${sample.id}`,
            startTime: sample.startTime,
            id: sample.id,
          })),
        );
        const newEqualizers: Array<EqualizerType> = [];
        selectedPlaylines.forEach(line => {
          line.forEach(sample => {
            const filters = EQUALIZER_BANDS.map((band, index) => {
              const filter = audioContext.createBiquadFilter();
              filter.type = band <= 32 ? 'lowshelf' : band >= 16000 ? 'highshelf' : 'peaking';
              filter.gain.value = sample.gain[index] ?? 0;
              filter.Q.value = 1;
              filter.frequency.value = band;
              return filter;
            });
            newEqualizers.push({ id: sample.id, filters });
          });
        });
        const newVolumes = selectedPlaylines.map(line => {
          const volume = line[0].volume;
          return { id: line[0].id, value: volume };
        });

        setPlaylines(newPlaylines);
        setEqualizers(newEqualizers);
        setVolumes(newVolumes);
        setSelectedTrackId(newPlaylines[0][0].id);
        setIsTrackDialogOpen(false);
        setActiveStep(1);
      } else {
        showSnackbar({ message: 'Something went wrong', status: 'error' });
      }
    }
  }

  function handleExistingTracksChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedExistingTrackId(event.target.value);
  }

  useEffect(() => {
    if (
      playlines.length > 0 &&
      playlines.every(line => line.every(sample => sample.state === 'finished'))
    ) {
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
    <Box width="100%" height="100%" padding={2}>
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
      {activeStep === 0 && (
        <>
          <Dialog open={isTrackDialogOpen}>
            <DialogTitle>Select existing track</DialogTitle>
            <DialogContent dividers>
              <RadioGroup
                aria-label="existing tracks"
                name={'existing tracks'}
                onChange={handleExistingTracksChange}
                value={selectedExistingTrackId}
              >
                {userTracks?.map(track => (
                  <FormControlLabel
                    key={track.id}
                    value={track.id}
                    control={<Radio />}
                    label={track.name}
                  />
                ))}
              </RadioGroup>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsTrackDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => onTrackSelect(false, selectedExistingTrackId)} autoFocus>
                Select
              </Button>
            </DialogActions>
          </Dialog>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
            gap={2}
          >
            <Button onClick={() => onTrackSelect(true)} variant="contained" startIcon={<Add />}>
              Create a track
            </Button>
            <Button
              onClick={() => {
                setIsTrackDialogOpen(true);
              }}
              variant="contained"
            >
              Use existing track
            </Button>
          </Box>
        </>
      )}
      {activeStep === 1 && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          width="100%"
          minHeight="100%"
        >
          <Box height="100%" display="flex" flexDirection="column" gap={2}>
            <Box
              position="relative"
              sx={{ overflowX: 'scroll', overflowY: 'hidden', minHeight: 480 }}
            >
              {
                // TODO: add duration based on tracks
              }
              <AudioTimeline currentTime={currentTime} duration={238000} />
              <Box display="flex" flexDirection="column" gap={1}>
                {playlines.map((samples, lineIndex) => (
                  <Box
                    key={`playline_${lineIndex}`}
                    display="flex"
                    gap={4}
                    onDragOver={(event: React.DragEvent<HTMLDivElement>) => event?.preventDefault()}
                  >
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
                        {volumes.find(item => samples.some(sample => sample.id === item.id))
                          ?.value === 0 ? (
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
                            onDragEnd={(time: number) =>
                              onActiveSampleDragEnd(time, lineIndex, sampleIndex)
                            }
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
              <Grid item xs={8}>
                <Equalizer
                  filters={equalizers.find(item => item.id === selectedTrackId)?.filters ?? []}
                  onFilterChange={onFilterChange}
                />
              </Grid>
              <Grid item xs>
                <SamplePicker
                  musicFilesMetadata={musicFilesMetadata}
                  isMusicFilesMetadataLoaded={isMusicFilesMetadataLoaded}
                  onDrag={onSamplePickerItemDrag}
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
      )}
    </Box>
  );
}
