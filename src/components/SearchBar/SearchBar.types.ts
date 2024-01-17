export type SearchBarProps = {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  tags: string[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
};
