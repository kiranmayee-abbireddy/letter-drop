// Common English words dictionary (simplified version for demo)
// In a real implementation, this would be a comprehensive dictionary
// or use an API for validation
const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it", "for", "not", "on", "with", "he", "as", "you", "do",
  "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all",
  "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make",
  "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after",
  "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give",
  "day", "most", "us", "man", "find", "here", "thing", "those", "tell", "very", "help", "through", "much", "before",
  "line", "right", "too", "mean", "old", "same", "big", "fact", "hand", "eye", "own", "while", "last", "follow", "ask",
  "turn", "far", "seem", "next", "life", "few", "stop", "open", "system", "set", "need", "try", "call", "show", "keep",
  "face", "head", "play", "run", "bring", "name", "area", "form", "air", "put", "high", "each", "small", "live", "year",
  "book", "read", "case", "hear", "left", "house", "kind", "word", "car", "door", "yes", "side", "once", "both", "young",
  "body", "dog", "long", "sit", "place", "stand", "talk", "home", "food", "room", "got", "saw", "let", "many", "feel",
  "mind", "boy", "love", "end", "land", "hold", "work", "hard", "might", "part", "off", "war", "lay", "city", "tree",
  "sun", "light", "top", "ship", "lot", "why", "ago", "half", "child", "today", "yet", "best", "ever", "must", "never",
  "view", "bad", "early", "glad", "hot", "saw", "eat", "less", "sleep", "walk", "far", "night", "red", "blue", "green",
  "black", "white", "gold", "cat", "win", "fall", "art", "cut", "pay", "saw", "ice", "dark", "fish", "plan", "low",
  "send", "pick", "star", "act", "age", "bag", "bar", "bed", "bill", "bird", "blow", "boat", "bone", "bus", "cake",
  "card", "care", "cook", "cool", "corn", "cost", "cow", "dare", "deal", "desk", "die", "dirt", "dish", "draw", "drop",
  "earn", "ease", "farm", "fear", "fire", "fish", "flow", "fly", "foot", "free", "fuel", "full", "fund", "gain", "game",
  "gate", "gift", "girl", "goal", "gold", "golf", "good", "grow", "hair", "half", "hall", "hand", "hang", "harm", "hate",
  "have", "head", "heal", "hear", "heat", "help", "hide", "hold", "hole", "home", "hook", "hope", "host", "hour", "hunt",
  "hurt", "idea", "iron", "join", "joke", "jump", "jury", "keep", "kick", "kill", "kind", "king", "kiss", "kite", "knee",
  "know", "land", "last", "lead", "lean", "left", "lend", "less", "life", "lift", "like", "line", "link", "list", "live",
  "load", "loan", "lock", "long", "look", "lose", "love", "luck", "mail", "main", "make", "mark", "meet", "milk", "mind",
  "miss", "moon", "more", "move", "nail", "name", "near", "neck", "need", "news", "nose", "note", "pace", "pack", "page",
  "pain", "pair", "park", "part", "pass", "past", "path", "peak", "pick", "pink", "pipe", "plan", "play", "poem", "poet",
  "pool", "post", "pull", "pure", "push", "quit", "race", "rain", "rank", "rate", "read", "rest", "rice", "rich", "ride",
  "ring", "rise", "risk", "road", "rock", "role", "roll", "roof", "room", "root", "rope", "rose", "rule", "rush", "safe",
  "sail", "sale", "salt", "sand", "save", "seat", "seed", "seek", "seem", "self", "sell", "send", "shop", "shot", "show",
  "shut", "sick", "side", "sign", "sing", "sink", "site", "size", "skin", "slip", "slow", "snow", "soap", "sock", "soft",
  "soil", "sold", "some", "song", "soon", "sort", "soul", "soup", "spot", "star", "stay", "step", "stop", "such", "suit",
  "sure", "swim", "tail", "take", "talk", "tall", "tank", "tape", "task", "team", "tell", "tend", "term", "test", "text",
  "than", "that", "them", "then", "they", "thin", "this", "thus", "till", "time", "tiny", "tire", "tone", "tool", "top",
  "toss", "tour", "town", "trap", "tree", "trip", "true", "tune", "turn", "twin", "type", "unit", "upon", "urge", "used",
  "user", "vast", "very", "view", "vote", "wage", "wait", "wake", "walk", "wall", "want", "warm", "wash", "wave", "weak",
  "wear", "week", "well", "west", "what", "when", "whom", "wide", "wife", "wild", "will", "wind", "wine", "wing", "wipe", 
  "wise", "wish", "with", "wood", "word", "work", "wrap", "yard", "year", "yoga", "zone",
  "cat", "dog", "sun", "fun", "run", "map", "cap", "tap", "nap", "zap", "lip", "tip", "sip", "dip", "hip", "rip", "bog",
  "jog", "fog", "log", "hog", "row", "bow", "cow", "how", "now", "pow", "wow", "ebb", "web", "dab", "cab", "lab", "jab",
  "fab", "tab", "rib", "bib", "fib", "cob", "sob", "rob", "mob", "job", "cub", "pub", "hub", "rub", "dub", "tub", "sub",
  "act", "art", "apt", "aid", "aim", "air", "ace", "add", "age", "bat", "bad", "bag", "ban", "bar", "bed", "bee", "bet",
  "bid", "big", "bit", "box", "boy", "bug", "bun", "bus", "but", "buy", "can", "cap", "car", "cat", "cob", "cod", "cog",
  "con", "cop", "cow", "cry", "cub", "cup", "cut", "dad", "dam", "day", "den", "dew", "did", "die", "dig", "dim", "dip",
  "doe", "dog", "dot", "dry", "dub", "due", "dug", "dye", "ear", "eat", "ebb", "egg", "ego", "elf", "elk", "elm", "emu"
];

// Set for faster lookups
const wordSet = new Set(commonWords);

// Validate if a word exists in our dictionary
export const validateWord = (word: string): boolean => {
  return wordSet.has(word.toLowerCase());
};