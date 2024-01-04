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
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { PUBLISH_VISIBILITY, TrackPublishSchema } from './Publish.constants';
import { PublishFormValues, PublishProps } from './Publish.types';
import { useState } from 'react';

export default function Publish({ onSubmit }: PublishProps) {
  const [tags, setTags] = useState<Array<string>>([]);

  function handleSubmit(values: PublishFormValues) {
    onSubmit({ ...values, tags });
  }

  return (
    <Box margin={2} display="flex" flexDirection="column">
      <Box display="flex" alignItems="center" justifyContent="center">
        <Paper sx={{ padding: 3, mt: '48px', height: ['100%', 600] }}>
          <Formik
            onSubmit={handleSubmit}
            initialValues={{
              name: '',
              description: '',
              tags: [],
              visibility: PUBLISH_VISIBILITY.PUBLIC as keyof typeof PUBLISH_VISIBILITY,
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
