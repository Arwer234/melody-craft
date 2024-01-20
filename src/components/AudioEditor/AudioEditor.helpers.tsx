import { audioContext } from '../../pages/Editor/Editor.constants';
import { EQUALIZER_BANDS } from './Equalizer/Equalizer.constants';

export function getDefaultEqualizer() {
  return EQUALIZER_BANDS.map(band => {
    const filter = audioContext.createBiquadFilter();
    filter.type = band <= 32 ? 'lowshelf' : band >= 16000 ? 'highshelf' : 'peaking';
    filter.gain.value = 0;
    filter.Q.value = 1;
    filter.frequency.value = band;
    return filter;
  });
}
