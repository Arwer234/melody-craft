import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';
import AudioEditor from '../../components/AudioEditor/AudioEditor';
import { useContext, useState } from 'react';
import {
  ACTIVE_STEPS,
  DEFAULT_SAMPLE_OPTIONS,
  audioContext,
} from '../../components/AudioEditor/AudioEditor.constants';
import Publish from '../Publish/Publish';
import { Add } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import {
  getAudioEditorTracks,
  setTrack,
} from '../../providers/StoreProvider/StoreProvider.helpers';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { EqualizerType, Sample, Volume } from '../../components/AudioEditor/AudioEditor.types';
import { EQUALIZER_BANDS } from '../../components/AudioEditor/Equalizer/Equalizer.constants';
import { PublishFormValues, SubmitCustomValues } from '../Publish/Publish.types';
import { TRACK_STORE_ERROR_TO_MESSAGE } from './Editor.constants';
import { SNACKBAR_STATUS } from '../../hooks/useSnackbar/useSnackbar.constants';

export default function Editor() {
  const [activeStep, setActiveStep] = useState<number>(ACTIVE_STEPS.CREATE);
  const [isTrackDialogOpen, setIsTrackDialogOpen] = useState<boolean>(false);
  const [selectedExistingTrackId, setSelectedExistingTrackId] = useState<string | null>(null);
  const [volumes, setVolumes] = useState<Array<Volume>>([]);
  const [equalizers, setEqualizers] = useState<Array<EqualizerType>>([]);
  const [playlines, setPlaylines] = useState<Array<Array<Sample>>>([]);
  const { data: userTracks } = useQuery({
    queryKey: ['tracks'],
    queryFn: getAudioEditorTracks,
  });
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  const { showSnackbar } = useContext(UIContext);

  function handleExistingTracksChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedExistingTrackId(event.target.value);
  }

  function onTrackSelect(isNewTrack: boolean, trackId?: string | null) {
    if (isNewTrack) setActiveStep(ACTIVE_STEPS.EDIT);
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
          return { id: line[0].id, value: volume } as Volume;
        });

        setPlaylines(newPlaylines);
        setEqualizers(newEqualizers);
        setVolumes(newVolumes);
        setSelectedTrackId(newPlaylines[0][0].id);
        setIsTrackDialogOpen(false);
        setActiveStep(ACTIVE_STEPS.EDIT);
      } else {
        showSnackbar({ message: 'Something went wrong', status: 'error' });
      }
    }
  }

  async function handleSubmit(
    values: PublishFormValues & SubmitCustomValues,
  ): Promise<(typeof SNACKBAR_STATUS)[keyof typeof SNACKBAR_STATUS]> {
    const response = await setTrack({ ...values, playlines, volumes, equalizers });
    if (response.status === 'success') {
      showSnackbar({
        message: response.message,
        status: response.status,
      });
    } else if (response.status === 'error') {
      showSnackbar({
        message: TRACK_STORE_ERROR_TO_MESSAGE[response.message] ?? 'Something went wrong',
        status: 'error',
      });
    }

    return response.status;
  }

  return (
    <Box
      pt={2}
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
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
      {activeStep === ACTIVE_STEPS.CREATE && (
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
      {activeStep === ACTIVE_STEPS.EDIT && (
        <AudioEditor
          playlines={playlines}
          volumes={volumes}
          setVolumes={setVolumes}
          setEqualizers={setEqualizers}
          setPlaylines={setPlaylines}
          selectedTrackId={selectedTrackId}
          equalizers={equalizers}
          setActiveStep={setActiveStep}
          setSelectedTrackId={setSelectedTrackId}
        />
      )}
      {activeStep === ACTIVE_STEPS.PUBLISH && (
        <Publish
          onSubmit={handleSubmit}
          isExisting={selectedExistingTrackId !== null}
          existingName={userTracks?.find(track => track.id === selectedExistingTrackId)?.name}
        />
      )}
    </Box>
  );
}
