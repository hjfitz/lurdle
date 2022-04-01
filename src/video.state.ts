import {GameState} from './guess.state.js'
import {database, VideoInfo} from './db.js'

const noop = () => {}

export class VideoState {
	readonly #videos = database
	readonly #guessState: GameState
	readonly #player: HTMLDivElement
	readonly #progress: HTMLElement
	readonly #ytPlayer: YT.Player
	readonly #event: VideoInfo
	readonly #onReady: () => void
	public isReady = false
	public onStopped = noop
	public onPlaying = noop

	constructor(
		guessState: GameState, 
		videoPlayer: HTMLDivElement,
		videoProgress: HTMLElement,
		onReady: () => void,
	) {
		this.#guessState = guessState
		this.#player = videoPlayer
		this.#progress = videoProgress
		this.#onReady = onReady

		const onPlayerReady = this.#onPlayerReady.bind(this)
		const onPlayerStateChanged = this.#onPlayerStateChanged.bind(this)
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
			events: {
				onReady: onPlayerReady,
				onStateChange: onPlayerStateChanged,
			}
		})
		this.#event = this.#getEvent()
		this.#progress.addEventListener('transitionend', () => {
			this.#progress.style.transitionDuration = '0ms'
			this.#progress.style.width = '0%'
		})

	}

	#onPlayerStateChanged(state: YT.OnStateChangeEvent) {
		switch(state.data) {
		case YT.PlayerState.ENDED:
		case YT.PlayerState.PAUSED: {
			this.onStopped()
			break
		}
		case YT.PlayerState.PLAYING: {
			this.onPlaying()
		}
		}
	}

	#onPlayerReady() {
		this.isReady = true
		const {timestamp, youtubeId} = this.#event
		this.#ytPlayer.loadVideoById(youtubeId, timestamp)
		setTimeout(() => this.#ytPlayer.pauseVideo(), 500)
		this.#onReady()
	}

	#getEvent(): VideoInfo {
		const date = new Date()
		const dayOfYear =  (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000
		const idx = dayOfYear & this.#videos.length
		return this.#videos[idx]
	}

	#animatePlayProgress(timeMs: number): void {
		this.#progress.style.transitionDuration = `${timeMs + 100}ms`
		this.#progress.style.transitionProperty = 'width'
		this.#progress.style.width = `${this.#guessState.getSkipPerc()}%`

	}

	public playForGuess(): void {
		const time = this.#guessState.getSeconds()
		this.#ytPlayer.seekTo(this.#event.timestamp ?? 0, true)
		this.#ytPlayer.playVideo()
		const playTimeMs = time * 1000
		setTimeout(() => this.#ytPlayer.pauseVideo(), playTimeMs)
		this.#animatePlayProgress(playTimeMs)
	}

	public getVideo(): string {
		return this.#event.name
	}
}

