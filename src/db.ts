export interface VideoInfo {
	youtubeId: string
	name: Events
	timestamp?: number
}

export enum Events {
	HelmsDeep = 'Battle at Helms Deep',
	BreakingFellowship = 'Breaking of the Fellowship',
	Balrog = 'Meeting the Balrog of Kazad Dum',
}

// i know, i know
export const database = [
	{
		name: Events.HelmsDeep,
		youtubeId: 'bh2tUipUnaI',
	},
	{
		name: Events.HelmsDeep,
		youtubeId: '78IJdhvY1zg',
		timestamp: 130,
	},

]
