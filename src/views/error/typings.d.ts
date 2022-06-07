export as namespace ErrorMessage;

export type SvgMessage = {
  title: string;
  subtitle: string;
  secondSubtitle: {
    content: string;
    time: string;
    secondContent: string;
  };
};
