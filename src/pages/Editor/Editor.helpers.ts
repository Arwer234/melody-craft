import { DEFAULT_SAMPLE_OPTIONS } from '../../components/AudioEditor/AudioEditor.constants';
import { EqualizerType, Volume } from '../../components/AudioEditor/AudioEditor.types';
import { EQUALIZER_BANDS } from '../../components/AudioEditor/Equalizer/Equalizer.constants';
import { AudioEditorTrack } from '../../providers/StoreProvider/StoreProvider.types';
import { audioContext } from './Editor.constants';

export function userTracksToAudioEditorTrack({
  userTracks,
  trackId,
  color,
}: {
  userTracks: Array<AudioEditorTrack>;
  trackId: string;
  color: string;
}) {
  const selectedPlaylines = userTracks?.find(track => track.name === trackId)?.playlines;
  if (selectedPlaylines !== undefined) {
    const newPlaylines = selectedPlaylines.map(line => {
      return line.map(sample => ({
        name: sample.name,
        url: sample.src,
        ...DEFAULT_SAMPLE_OPTIONS,
        waveColor: color,
        progressColor: color,
        cursorColor: 'transparent',
        container: `wavesurfer_${sample.id}`,
        startTime: sample.startTime,
        id: sample.id,
      }));
    });

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

    return {
      playlines: newPlaylines,
      equalizers: newEqualizers,
      volumes: newVolumes,
    };
  }
  return null;
}
