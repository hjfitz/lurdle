export interface VideoInfo {
  youtubeId: string;
  name: Events;
  timestamp?: number;
}

export enum Events {
  HelmsDeep = 'Battle at Helms Deep',
  BreakingFellowship = 'Breaking of the Fellowship',
  Moria = 'The Mines of Moria',
  Council = 'The Council of Elrond',
  BoromirsDeparture = 'Boromir\'s Departure',
  ShireScouring = 'The Scouring of the Shire',
  BilboBirthday = 'Bilbo\'s 111th Birthday Party',
  HobbitsRivendell = 'The Hobbits Arrive at Rivendell',
  Weathertop = 'Fighting the Nazgul at Weathertop',
  GandalfTheWhite = 'Meeting Gandalf the White at Fangorn Forest',
  IsengardSmash = 'The Ents Destroy Isengard',
  RadagastTheFool = 'Saruman Captures Gandalf at Orthanc',
  DepartingBagEnd = 'Frodo departs Bag End',
  NazgulHobbiton = 'The Nazgul arrive at Hobbiton',
  Bombadillo = 'The Hobbits Meet Tom Bombadil',
  FelloshipFormed = 'The Fellowship is Formed',
}

// i know, i know
export const database = [
	{
		name: Events.Moria,
		youtubeId: '9h4WuVLsqkw',
		timestamp: 20,
	},
	{
		name: Events.HelmsDeep,
		youtubeId: 'bh2tUipUnaI',
		timestamp: 1,
	},

	{
		name: Events.Council,
		youtubeId: '-k3ABfmCr2I',
		timestamp: 26,
	},
	{
		name: Events.Council,
		youtubeId: '-k3ABfmCr2I',
		timestamp: 87,
	},
	{
		name: Events.HelmsDeep,
		youtubeId: '78IJdhvY1zg',
		timestamp: 130,
	},
	{
		name: Events.Moria,
		youtubeId: '9h4WuVLsqkw',
		timestamp: 275,
	},
]
