const DEFAULT_WORDS_PER_MINUTE = 200;

const calculate = (content: string | null, wordsPerMinute = DEFAULT_WORDS_PER_MINUTE): number => {
  if (!content || content.trim().length === 0) return 1;

  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(Math.ceil(words / wordsPerMinute), 1);
};

export const formatReadingTime = (content: string | null, wordsPerMinute = DEFAULT_WORDS_PER_MINUTE): string => {
  const minutes = calculate(content, wordsPerMinute);
  return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} read`;
};
