import { useContext, useEffect, useRef, useState } from 'react';
import Equalizer from './Equalizer/Equalizer';
import AudioTrack from './AudioTrack/AudioTrack';
import { ACTIVE_STEPS, audioContext } from './AudioEditor.constants';
import { Box, Grid, IconButton } from '@mui/material';
import AudioTimeline from './AudioTimeline/AudioTimeline';
import Controls from '../Controls/Controls';
import { AudioEditorProps, Sample } from './AudioEditor.types';
import { VolumeOff, VolumeOffOutlined } from '@mui/icons-material';
import { SamplePicker } from './SamplePicker/SamplePicker';
import { StoreContext } from '../../providers/StoreProvider/StoreProvider';
import { FileType } from '../../pages/MyFiles/MyFiles.types';

export default function AudioEditor({
  setActiveStep,
  setEqualizers,
  setPlaylines,
  setVolumes,
  setSelectedTrackId,
  playlines,
  volumes,
  equalizers,
  selectedTrackId,
}: AudioEditorProps) {
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

  const { musicFilesMetadata, isMusicFilesMetadataLoaded } = useContext(StoreContext);

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

  function handleNextClick() {
    setActiveStep(ACTIVE_STEPS.PUBLISH);
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
          onNextClick={handleNextClick}
        />
      </Box>
    </Box>
  );
}
