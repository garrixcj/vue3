export type SearchBarItem = {
  date: [string, string];
  domain: 'all' | number;
  lobby: '' | number;
  currency: 'original' | 'cny';
};

export type MergingColumnItem = {
  wagers_type: string;
  index: number;
  count: number;
};
