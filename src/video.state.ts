import {GameState} from './guess.state.js'
import {database, VideoInfo} from './db.js'

export class VideoState {
	readonly #videos = database
	readonly #guessState: GameState
	readonly #player: HTMLDivElement
	readonly #ytPlayer: YT.Player
	readonly #event: VideoInfo

	constructor(
		guessState: GameState, 
		videoPlayer: HTMLDivElement
	) {
		this.#guessState = guessState
		this.#player = videoPlayer
		this.#ytPlayer = new YT.Player(this.#player, {
			height: '390',
        	width: '640',
			playerVars: {
				playsinline: 1,
				controls: 0,
				fs: 0,
				showinfo: 0,
				rel: 0,
				
			},
		})
		this.#event = this.#getEvent()
	}

	#getEvent(): VideoInfo {
		// todo: pick this based on date
		return this.#videos[0]
	}

	public playForGuess() {
		console.log(this, 'playing round')
		const time = this.#guessState.getSeconds()
		const {timestamp, youtubeId} = this.#event
		this.#ytPlayer.loadVideoById(youtubeId, timestamp)
		this.#ytPlayer.playVideo()
		//this.#ytPlayer.playVideoAt(timestamp ?? 0)
		setTimeout(() => this.#ytPlayer.pauseVideo(), time * 1000)
	}

	public getVideo(): string {
		return this.#event.name
	}
}

