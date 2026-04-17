const triviaArray = [
  "The earliest known locking mechanisms were discovered in the ruins of Nineveh, the ancient capital of Assyria.",
  "Your brain generates enough electricity to power a small lightbulb.",
  "Dopamine isn't just about pleasure; it's about anticipating the reward.",
  "The average knowledge worker is interrupted every 3 minutes. It takes 23 minutes to return to deep focus.",
  "The silence of the void is not empty; it is full of the things we chose not to see.",
  "Multitasking is a myth; the brain is actually rapid-switching, burning glucose with every switch.",
  "Boredom is the crucible of creativity. When you avoid it, you avoid your own mind.",
  "Willpower is a finite resource, depleted by every decision you make."
];

export const getDailyQuote = (): string => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();
  
  let usedQuotes: { text: string; timestamp: number }[] = [];
  try {
    const stored = localStorage.getItem('usedQuotes');
    if (stored) {
      usedQuotes = JSON.parse(stored);
    }
  } catch (e) {
    usedQuotes = [];
  }

  // Filter out quotes that are older than 24 hours
  usedQuotes = usedQuotes.filter(q => now - q.timestamp < ONE_DAY_MS);

  const usedTexts = new Set(usedQuotes.map(q => q.text));
  let availableQuotes = triviaArray.filter(q => !usedTexts.has(q));

  // If all quotes have been used in the last 24h (rare, but handle it), reset
  if (availableQuotes.length === 0) {
    availableQuotes = triviaArray;
    usedQuotes = [];
  }

  const selectedQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
  
  usedQuotes.push({ text: selectedQuote, timestamp: now });
  localStorage.setItem('usedQuotes', JSON.stringify(usedQuotes));

  return selectedQuote;
};

// Also export the raw array just in case anyone needs the original
export const triviaData = triviaArray;
