import { Box, Fade } from '@mui/material';
import { useContext } from 'react';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import Editor from '../../pages/Editor/Editor';

export default function AudioPlayer() {
  const { audioPlayer } = useContext(UIContext);
  const { playlist, isShown } = audioPlayer;

  return (
    <Fade in={isShown}>
      <Box width="100%">
        <Editor playingTrackName={playlist[0]?.name} />
      </Box>
    </Fade>
  );
}
