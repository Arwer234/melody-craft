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
  useTheme,
} from '@mui/material';
import AudioEditor from '../../components/AudioEditor/AudioEditor';
import { useContext, useEffect, useState } from 'react';
import { ACTIVE_STEPS } from '../../components/AudioEditor/AudioEditor.constants';
import Publish from '../Publish/Publish';
import { Add } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import {
  getAudioEditorTracks,
  setTrack,
} from '../../providers/StoreProvider/StoreProvider.helpers';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { EqualizerType, Sample, Volume } from '../../components/AudioEditor/AudioEditor.types';
import { PublishFormValues, SubmitCustomValues } from '../Publish/Publish.types';
import { TRACK_STORE_ERROR_TO_MESSAGE } from './Editor.constants';
import { SNACKBAR_STATUS } from '../../hooks/useSnackbar/useSnackbar.constants';
import { useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth/useAuth';
import { userTracksToAudioEditorTrack } from './Editor.helpers';

export default function Editor({ playingTrackName }: { playingTrackName?: string }) {
  const [activeStep, setActiveStep] = useState<number>(ACTIVE_STEPS.CREATE);
  const [isTrackDialogOpen, setIsTrackDialogOpen] = useState<boolean>(false);
  const [selectedExistingTrackId, setSelectedExistingTrackId] = useState<string | null>(null);
  const [isEditingAnotherUsersTrack, setIsEditingAnotherUsersTrack] = useState(false);
  const [volumes, setVolumes] = useState<Array<Volume>>([]);
  const [equalizers, setEqualizers] = useState<Array<EqualizerType>>([]);
  const [playlines, setPlaylines] = useState<Array<Array<Sample>>>([]);
  const { userInfo } = useAuth();
  const theme = useTheme();

  const location = useLocation();
  const existingTrackName =
    new URLSearchParams(location.search).get('trackName') || playingTrackName;

  const { data: userTracks, isFetching: isUserTracksLoading } = useQuery({
    queryKey: ['audioEditorTracks'],
    queryFn: () => getAudioEditorTracks({ isOwnTracks: !existingTrackName }),
  });

  const filteredUserTracks = existingTrackName
    ? userTracks
    : userTracks?.filter(track => track.ownerUid === userInfo?.uid);

  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  const { showSnackbar } = useContext(UIContext);

  function handleExistingTracksChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedExistingTrackId(event.target.value);
  }

  function onTrackSelect(isNewTrack: boolean, trackId?: string | null) {
    if (isNewTrack) setActiveStep(ACTIVE_STEPS.EDIT);
    else {
      const audioEditorTrack = userTracksToAudioEditorTrack({
        userTracks: filteredUserTracks ?? [],
        trackId: trackId ?? '',
        color: theme.palette.primary.main,
      });

      if (audioEditorTrack) {
        setPlaylines(audioEditorTrack.playlines);
        setEqualizers(audioEditorTrack.equalizers);
        setVolumes(audioEditorTrack.volumes);
        setSelectedTrackId(audioEditorTrack.playlines[0][0].id);
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
    const previousTrackName = filteredUserTracks?.find(
      track => track.name === selectedExistingTrackId,
    )?.name;
    const response = await setTrack({
      ...values,
      playlines,
      volumes,
      equalizers,
      previousName: previousTrackName,
      isEditingAnotherUsersTrack: isEditingAnotherUsersTrack,
    });
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

  const isPlayOnlyMode = Boolean(playingTrackName);

  useEffect(() => {
    if (existingTrackName && activeStep === ACTIVE_STEPS.CREATE && userTracks) {
      setSelectedExistingTrackId(existingTrackName);
      setIsEditingAnotherUsersTrack(true);
      onTrackSelect(false, existingTrackName);
    } else if (
      existingTrackName &&
      activeStep === ACTIVE_STEPS.EDIT &&
      userTracks &&
      isPlayOnlyMode
    ) {
      setSelectedExistingTrackId(existingTrackName);
      setIsEditingAnotherUsersTrack(true);
      onTrackSelect(false, existingTrackName);
    }
  }, [existingTrackName, userTracks]);

  if (isPlayOnlyMode) {
    return (
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
        isLoading={isUserTracksLoading}
        isPlayOnlyMode={true}
        trackName={existingTrackName}
      />
    );
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
      <>
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
                  {filteredUserTracks?.map(track => (
                    <FormControlLabel
                      key={track.name}
                      value={track.name}
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
            isLoading={isUserTracksLoading}
            trackName={existingTrackName}
          />
        )}
        {activeStep === ACTIVE_STEPS.PUBLISH && (
          <Publish
            onSubmit={handleSubmit}
            isExisting={selectedExistingTrackId !== null}
            existingName={
              filteredUserTracks?.find(track => track.name === selectedExistingTrackId)?.name
            }
            isModeLocked={isEditingAnotherUsersTrack}
          />
        )}
      </>
    </Box>
  );
}
