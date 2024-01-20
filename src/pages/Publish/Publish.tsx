import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Fade,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import {
  EXISTING_TRACK_OPTIONS,
  PUBLISH_VISIBILITY,
  TrackPublishSchema,
} from './Publish.constants';
import { PublishFormValues, PublishProps } from './Publish.types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../routes';
import FileDialog from '../MyFiles/FileDialog/FileDialog';
import { ACCEPTED_FILE_TYPES } from '../MyFiles/FileDialog/FileDialog.constants';
import { Help } from '@mui/icons-material';

export default function Publish({
  onSubmit,
  isExisting,
  existingName,
  existingDescription,
  isModeLocked,
}: PublishProps) {
  const [tags, setTags] = useState<Array<string>>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(
    values: PublishFormValues,
    setSubmitting: (isSubmitting: boolean) => void,
  ) {
    const response = await onSubmit({ ...values, tags, file, isExisting });

    if (response === 'error') {
      setSubmitting(false);
    } else {
      navigate(ROUTE_PATHS.MY_FILES);
    }
  }

  return (
    <Box margin={2} display="flex" flexDirection="column">
      <Box display="flex" alignItems="center" justifyContent="center">
        <Paper sx={{ padding: 3, mt: '48px', height: ['100%', 700] }}>
          <FileDialog
            isOpen={isDialogOpen}
            acceptedFileTypes={ACCEPTED_FILE_TYPES.IMAGE}
            onClose={() => setIsDialogOpen(false)}
            onUpload={file => setFile(file)}
          />
          <Formik
            onSubmit={(values, { setSubmitting }) => {
              void handleSubmit(values, setSubmitting);
              setSubmitting(false);
            }}
            initialValues={{
              name: existingName ?? '',
              description: existingDescription ?? '',
              tags: [],
              visibility: PUBLISH_VISIBILITY.PUBLIC,
              mode: EXISTING_TRACK_OPTIONS.CREATE,
            }}
            validationSchema={TrackPublishSchema}
          >
            {({ isSubmitting, errors, values, handleChange }) => (
              <Form style={{ height: '100%' }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  width={400}
                  height="100%"
                >
                  <Box display="flex" width="100%" flexDirection="column" alignItems="flex-start">
                    <Box display="flex" justifyContent="center" mb={3} width="100%">
                      <Typography variant="h4">Publish settings</Typography>
                    </Box>
                    <Box
                      height="71px"
                      width="100%"
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-start"
                    >
                      <TextField
                        type="text"
                        name="name"
                        label="Track name"
                        helperText={errors.name}
                        error={!!errors.name}
                        value={values.name}
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
                      />
                    </Box>
                    <Box
                      height="71px"
                      width="100%"
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-start"
                    >
                      <TextField
                        type="text"
                        name="description"
                        label="Track description"
                        helperText={errors.description}
                        error={!!errors.description}
                        value={values.description}
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
                      />
                    </Box>
                    <Box
                      height="71px"
                      width="100%"
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-start"
                    >
                      <Autocomplete
                        renderInput={params => (
                          <TextField
                            {...params}
                            label="Tags"
                            helperText={errors.tags}
                            error={!!errors.tags}
                            fullWidth
                            variant="standard"
                          />
                        )}
                        multiple
                        fullWidth
                        value={values.tags}
                        onChange={(_event, newValue) => {
                          if (
                            Array.isArray(newValue) &&
                            typeof newValue[0] === 'string' &&
                            !tags.includes(newValue[0])
                          ) {
                            setTags(previousValue => [...previousValue, newValue[0] as string]);
                          }
                        }}
                        // TODO: Add tags
                        options={[]}
                        freeSolo
                      />
                    </Box>
                    <Stack direction="row" gap={1} flexWrap="wrap" minHeight="32px">
                      {tags.map((tag, index) => (
                        <Fade in={true} key={`${tag}-${index}`}>
                          <Chip
                            label={tag}
                            variant="outlined"
                            onDelete={() => {
                              const newTags = [...tags];
                              newTags.splice(index, 1);
                              setTags(newTags);
                            }}
                          />
                        </Fade>
                      ))}
                    </Stack>
                    {
                      // TODO: Add formik integration
                    }
                    <Box display="flex" gap={2} alignItems="center" mt={3}>
                      <Typography variant="body2">
                        {file?.name ?? 'No track image uploaded'}
                      </Typography>
                      <Button onClick={() => setIsDialogOpen(true)}>Upload file</Button>
                    </Box>
                    <Box mt={3}>
                      <FormLabel id="visibility-label">Visibility</FormLabel>
                      <Field component={RadioGroup} name="visibility">
                        <FormControlLabel
                          value={PUBLISH_VISIBILITY.PUBLIC}
                          control={<Radio />}
                          label="Public"
                        />
                        <FormControlLabel
                          value={PUBLISH_VISIBILITY.PRIVATE}
                          control={<Radio />}
                          label="Private"
                        />
                      </Field>
                    </Box>
                    {isExisting && (
                      <Box mt={2}>
                        <Box display="flex" gap={1}>
                          <FormLabel id="existing-label">Mode</FormLabel>
                          <Tooltip title="You cannot change mode, because you are editing another users' track">
                            <Help fontSize="small" />
                          </Tooltip>
                        </Box>
                        <Field component={RadioGroup} name="mode">
                          <FormControlLabel
                            value={EXISTING_TRACK_OPTIONS.CREATE}
                            control={<Radio />}
                            label="Create a new track"
                            disabled={isModeLocked}
                          />
                          <FormControlLabel
                            value={EXISTING_TRACK_OPTIONS.EDIT}
                            control={<Radio />}
                            label="Edit existing track"
                            disabled={isModeLocked}
                          />
                        </Field>
                      </Box>
                    )}
                  </Box>
                  <Button type="submit" disabled={isSubmitting}>
                    Publish
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
      <Box></Box>
    </Box>
  );
}
