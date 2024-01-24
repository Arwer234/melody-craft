import { AudioFile, Edit, Person, Public } from '@mui/icons-material';

export const DRAWER_STATIC_CONFIG = [
  { name: 'Discover', path: '/', icon: <Public /> },
  { name: 'My files', path: 'my-files', icon: <AudioFile /> },
  { name: 'Editor', path: 'editor', icon: <Edit /> },
];

export const DRAWER_PERSONAL_CONFIG = [{ name: 'Profile', path: 'profile', icon: <Person /> }];
