import { Box } from '@mui/material';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { UIContext } from '../../providers/UIProvider/UIProvider';
import { useContext, useEffect, useRef } from 'react';
import H5AudioPlayer from 'react-h5-audio-player';

type BasicAudioPlayerProps = {
  offset: string;
};
// TODO: add Next/Prev click.
export default function BasicAudioPlayer({ offset }: BasicAudioPlayerProps) {
  const { audioPlayer } = useContext(UIContext);
  const ref = useRef<H5AudioPlayer>(null);

  useEffect(() => {
    if (ref.current !== null && ref.current.audio.current !== null) {
      if (audioPlayer.isPlaying) {
        void ref.current.audio.current.play();
      } else ref.current.audio.current.pause();
    }
  }, [audioPlayer.isPlaying]);

  return (
    <Box
      position="fixed"
      sx={{ bottom: 0, right: 0, width: `calc(100% - ${offset})`, transition: 'width 200ms' }}
    >
      <AudioPlayer
        ref={ref}
        autoPlay={audioPlayer.isPlaying}
        src={audioPlayer.src}
        autoPlayAfterSrcChange
        onClickNext={e => console.log('click next')}
        onClickPrevious={e => console.log('click prev')}
        // other props here
      />
    </Box>
  );
}
