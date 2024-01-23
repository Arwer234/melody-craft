export type AudioTimelineProps = {
  duration: number;
  children?: React.ReactNode;
  currentTime: number;
  onClick: (time: number) => void;
};
