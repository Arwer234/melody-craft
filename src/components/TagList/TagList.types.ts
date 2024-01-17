export type TagListProps = {
  tags: Array<string>;
  selectedTags?: Array<string>;
  onTagClick?: (tag: string) => void;
};
