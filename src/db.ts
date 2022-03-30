export interface VideoInfo {
	youtubeId: string
	name: Events
	timestamp?: number
}

export enum Events {
	HelmsDeep = 'Battle at Helms Deep',
	BreakingFellowship = 'Breaking of the Fellowship',
	Moria = 'The Mines of Moria',
	Council = 'The Council of Elrond',
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
		timestamp: 1
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
