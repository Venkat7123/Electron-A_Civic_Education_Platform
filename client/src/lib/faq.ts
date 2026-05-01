const ANSWERS: { match: RegExp; reply: string }[] = [
  { match: /(what is|define).*(election)/i, reply: "An election is the formal process where citizens vote to choose their representatives. In India, the Election Commission conducts free and fair elections for Lok Sabha, Vidhan Sabha, and local bodies." },
  { match: /(manifesto)/i, reply: "A manifesto is a public declaration of a political party's plans, promises, and policies. Voters use it to compare what each party intends to do if elected." },
  { match: /(model code|code of conduct|MCC)/i, reply: "The Model Code of Conduct is a set of guidelines from the Election Commission that parties and candidates must follow during campaigns — covering speeches, polling, and use of public resources." },
  { match: /(EVM|electronic voting machine)/i, reply: "An EVM is the Electronic Voting Machine. You press a button next to your candidate's name and the vote is recorded. A VVPAT slip then prints to confirm your choice." },
  { match: /(register|voter id|EPIC|form 6)/i, reply: "To register as a new voter, fill Form 6 on the National Voters' Service Portal (NVSP) with proof of age and address. You'll receive an EPIC (voter ID) once verified." },
  { match: /(rally|campaign)/i, reply: "Campaigns include rallies, door-to-door visits, debates, and digital ads — all under the Model Code of Conduct. Campaigning ends 48 hours before polling." },
  { match: /(announce|announcement|notification)/i, reply: "An election is announced by the Election Commission of India through an official notification. From that moment, the Model Code of Conduct comes into force." },
  { match: /(count|result|tally)/i, reply: "After voting, EVMs are sealed and stored in strong rooms. On counting day, votes are tallied transparently and the candidate with the most votes is declared winner." },
];

const FALLBACK = "Great question! Once GCP is connected, I'll answer this with full context. For now, try asking about elections, manifestos, EVMs, voter registration, or the model code of conduct.";

export function faqAnswer(question: string, _moduleKey: string): string {
  for (const a of ANSWERS) if (a.match.test(question)) return a.reply;
  return FALLBACK;
}