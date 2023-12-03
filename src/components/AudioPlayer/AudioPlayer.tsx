import { Box } from '@mui/material';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

type BasicAudioPlayerProps = {
  offset: string;
};

export default function BasicAudioPlayer({ offset }: BasicAudioPlayerProps) {
  return (
    <Box
      position="fixed"
      sx={{ bottom: 0, right: 0, width: `calc(100% - ${offset})`, transition: 'width 200ms' }}
    >
      <AudioPlayer
        src="https://firebasestorage.googleapis.com/v0/b/melody-craft.appspot.com/o/tracks%2Foutput1.webm?alt=media&token=22cfcf2f-5a2d-4fa7-9315-b796902c6fa9"
        onPlay={e => console.log('onPlay')}
        onClickNext={e => console.log('click next')}
        // other props here
      />
    </Box>
  );
}
