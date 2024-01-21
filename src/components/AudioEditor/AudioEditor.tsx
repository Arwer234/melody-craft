import { useContext, useEffect, useRef, useState } from 'react';
import Equalizer from './Equalizer/Equalizer';
import AudioTrack from './AudioTrack/AudioTrack';
import { ACTIVE_STEPS, DEFAULT_SAMPLE_OPTIONS } from './AudioEditor.constants';
import { Box, IconButton } from '@mui/material';
import AudioTimeline from './AudioTimeline/AudioTimeline';
import Controls from '../Controls/Controls';
import { AudioEditorProps, Sample } from './AudioEditor.types';
import { VolumeOff, VolumeOffOutlined } from '@mui/icons-material';
import { SamplePicker } from './SamplePicker/SamplePicker';
import { StoreContext } from '../../providers/StoreProvider/StoreProvider';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { getMusicFileSrc } from '../../providers/StoreProvider/StoreProvider.helpers';
import { getDefaultEqualizer } from './AudioEditor.helpers';
import Loading from '../../pages/Loading/Loading';
import { audioContext } from '../../pages/Editor/Editor.constants';

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
  isLoading,
  isPlayOnlyMode,
  trackName,
}: AudioEditorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [isPlayOnlyEditorShown, setIsPlayOnlyEditorShown] = useState(true);

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
        filters: getDefaultEqualizer(),
      };
      const newEqualizers = [...previousValue, newItem];

      return newEqualizers;
    });
    setVolumes(previousValue => {
      const newItem = {
        id: copiedSample.id,
        value: volumes.find(item => item.id === id)?.value ?? 100,
      };
      const newVolumes = [...previousValue, newItem];

      return newVolumes;
    });
  }

  function onRemoveSample(lineIndex: number, sampleIndex: number) {
    const sampleId = playlines[lineIndex][sampleIndex].id;
    setPlaylines(previousValue => {
      const newPlaylines = [...previousValue];
      newPlaylines[lineIndex].splice(sampleIndex, 1);
      if (newPlaylines[lineIndex].length === 0) newPlaylines.splice(lineIndex, 1);
      return newPlaylines;
    });
    setVolumes(previousValue => {
      const newVolumes = [...previousValue];
      const volumeIndex = newVolumes.findIndex(item => item.id === sampleId);
      newVolumes.splice(volumeIndex, 1);
      return newVolumes;
    });
    setEqualizers(previousValue => {
      const newEqualizers = [...previousValue];
      const equalizerIndex = newEqualizers.findIndex(item => item.id === sampleId);
      newEqualizers.splice(equalizerIndex, 1);
      return newEqualizers;
    });
    if (selectedTrackId === sampleId)
      setSelectedTrackId(playlines.find(line => line.length > 0)?.[0].id ?? null);
  }

  async function onSamplePickerItemDrag(_event: React.DragEvent<HTMLDivElement>, fileName: string) {
    if (playlines.some(line => line.some(sample => sample.name === fileName))) {
      showSnackbar({
        message: 'This sample is already added, try copying the existing one',
        status: 'error',
      });
      return;
    }

    const file = musicFilesMetadata.find(item => item.name === fileName);
    if (!file) return;
    const fileSrc = await getMusicFileSrc(file.name, 'sample');

    const newSample = {
      ...DEFAULT_SAMPLE_OPTIONS,
      id: `${file.name.split('.')[0]}_${Math.round(Math.random() * 100)}`,
      name: file.name,
      url: fileSrc,
      container: `waveform_${file.name.split('.')[0]}_${Math.round(Math.random() * 100)}`,
      state: 'ready',
      startTime: 0,
      volume: 100,
    } as Sample;

    setPlaylines(previousValue => {
      const newPlaylines = [...previousValue];
      const emptyLineIndex = newPlaylines.findIndex(line => line.length === 0);

      if (emptyLineIndex === -1) {
        newPlaylines.push([newSample]);
        return newPlaylines;
      }

      newPlaylines[emptyLineIndex].push(newSample);
      return newPlaylines;
    });
    setEqualizers(previousValue => {
      const newItem = {
        id: newSample.id,
        filters: getDefaultEqualizer(),
      };
      const newEqualizers = [...previousValue, newItem];

      return newEqualizers;
    });
    setVolumes(previousValue => {
      const newItem = {
        id: newSample.id,
        value: 100,
      };
      const newVolumes = [...previousValue, newItem];

      return newVolumes;
    });
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
  }, [playlines, setPlaylines]);

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

  useEffect(() => {
    setIsPlayOnlyEditorShown(false);
    setTimeout(() => {
      setIsPlayOnlyEditorShown(true);
    }, 100);
    setIsPlaying(false);
  }, [trackName]);

  return (
    <Box width="100%" height="100%" padding={0}>
      {isLoading && <Loading />}
      {!isLoading && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          width="100%"
          minHeight="100%"
          gap={2}
        >
          {!isPlayOnlyMode && (
            <Box height="100%" display="flex" flexDirection="column" gap={2} padding={2}>
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
                      onDragOver={(event: React.DragEvent<HTMLDivElement>) =>
                        event?.preventDefault()
                      }
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
                              filters={
                                equalizers.find(item => item.id === sample.id)?.filters ?? []
                              }
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
              <Box display="flex" flexDirection={['column', 'row']} gap={2}>
                <Box flex={2}>
                  <Equalizer
                    filters={equalizers.find(item => item.id === selectedTrackId)?.filters ?? []}
                    onFilterChange={onFilterChange}
                  />
                </Box>
                <Box flex={1}>
                  <SamplePicker
                    sampleData={musicFilesMetadata}
                    isMusicFilesMetadataLoaded={isMusicFilesMetadataLoaded}
                    onDrag={onSamplePickerItemDrag}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {isPlayOnlyMode && isPlayOnlyEditorShown && (
            <Box sx={{ display: 'none' }}>
              {playlines.map((samples, lineIndex) => (
                <Box key={`playline_${lineIndex}`}>
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
          )}

          <Controls
            isPlaying={isPlaying}
            onPlay={onPlayToggle}
            onSkipNext={onSkipNext}
            onSkipPrevious={onSkipPrevious}
            onNextClick={isPlayOnlyMode ? undefined : handleNextClick}
            isFixed={true}
            trackName={trackName}
          />
        </Box>
      )}
    </Box>
  );
}
