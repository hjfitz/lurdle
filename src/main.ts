import { Events } from './db.js'
import guessState from './guess.state.js'
import { VideoState } from './video.state.js'
import './analytics'

class Game {
	readonly #guessState = guessState
	readonly #videoState: VideoState
	// elements
	readonly #guessButton: HTMLAnchorElement
	readonly #playButton: HTMLAnchorElement
	readonly #options: HTMLSelectElement
	readonly #output: HTMLDialogElement
	readonly #progressBar: HTMLDivElement
	readonly #skipButton: HTMLAnchorElement
	readonly #guessProgress: HTMLSpanElement

	constructor(
		guessButton: HTMLAnchorElement,
		videoElement: HTMLDivElement,
		playButton: HTMLAnchorElement,
		options: HTMLSelectElement,
		output: HTMLDialogElement,
		progress: HTMLDivElement,
		guessProgress: HTMLSpanElement,
		skip: HTMLAnchorElement
	) {
		// elements
		// todo: normalise button naming convention
		this.#guessButton = guessButton
		this.#playButton = playButton
		this.#skipButton = skip
		this.#options = options
		this.#output = output
		this.#progressBar = progress
		this.#guessProgress = guessProgress

		// game bits
		this.initialiseDropdownOptions()

		// misc
		const scrobbleProgress = progress.querySelector(
			'#video-progress'
		) as HTMLElement
		this.#videoState = new VideoState(
			this.#guessState,
			videoElement,
			scrobbleProgress,
			this.addEventListeners.bind(this)
		)

		this.#videoState.onPlaying = () => this.setPlayingIcon()
		this.#videoState.onStopped = () => this.setPlayingIcon(true)
	}

	setPlayingIcon(stopped = false) {
		const playIcon = this.#playButton.querySelector('.material-icons')!
		if (stopped) playIcon.textContent = 'play_circle'
		else playIcon.textContent = 'not_interested' // pause or fiber_manual_record
	}

	initialiseDropdownOptions() {
		Object.entries(Events)
			.sort(() => Math.random() - 0.5)
			.forEach(([id, opt]) => {
				const el = document.createElement('option')
				el.textContent = opt
				el.dataset.eventId = id
				this.#options.appendChild(el)
			})
	}

	addEventListeners() {
		this.#guessButton.addEventListener('click', this.tryGuess.bind(this))
		this.#skipButton.addEventListener('click', this.moveSkipState.bind(this))
		this.#playButton.addEventListener('click', () => {
			this.setPlayingIcon()
			this.#videoState.playForGuess()
		})
	}

	moveSkipState(ev: MouseEvent) {
		ev.preventDefault()
		const hasLost = this.#guessState.nextProgressState()
		if (hasLost) {
			this.writeOutput(false, this.#guessState.getAttemptCount(), hasLost)
		} else {
			// move progress bar
			const progressBar = this.#progressBar.querySelector(
				'#guess-progress'
			) as HTMLDivElement
			const percProgress = this.#guessState.getSkipPerc()
			progressBar.style.width = `${percProgress}%`
			if (this.#guessState.hasLost()) {
				progressBar.classList.add('bg-gray-900')
				progressBar.classList.remove('bg-gray-100')
				this.#skipButton.classList.add('disabled')
				this.writeOutput(false, this.#guessState.maxAttempts, hasLost)
				// todo: cancel other buttons
			}
		}
		this.writeProgress()
	}

	getGuess(): string {
		return this.#options.value
	}

	tryGuess(ev: MouseEvent) {
		ev.preventDefault()

		// move to next guess state
		const hasLost = this.#guessState.nextAttemptState()
		const guess = this.getGuess()
		const isMatch = this.#videoState.getVideo() === guess
		const totalGuesses = this.#guessState.getAttemptCount()
		if (isMatch) this.#guessState.setWin()
		this.writeOutput(isMatch, totalGuesses, hasLost)
		this.writeProgress()
	}

	writeProgress() {
		const guessLine = this.#guessState.getGameLine()
		this.#guessProgress.textContent = guessLine
	}

	async writeOutput(matches: boolean, guesses: number, hasLost: boolean) {
		console.log({ guesses, matches, hasLost: this.#guessState.hasLost() })
		const p = document.createElement('p')
		const node = document.createTextNode('🧙🏻‍♂️')
		p.appendChild(node)

		const lineNode = document.createTextNode(this.#guessState.getGameLine())
		p.appendChild(lineNode)

		if (matches || hasLost) {
			const outTo = this.#output.querySelector('#share-line')!
			const copyBtn = this.#output.querySelector('#copy-btn')!
			outTo.innerHTML = ''
			outTo.appendChild(p)
			// @ts-expect-error dialog not fully supported
			this.#output.showModal()
			this.#output.style.display = 'flex'

			copyBtn.addEventListener('click', () => {
				const winnerText = `#Lurdle ⚔️\n\n${p.textContent}\n\nhttps://lurdle.hjf.io/`
				navigator.clipboard.writeText(winnerText)
			})
		}
	}
}

function getElementStrict<T = HTMLElement>(
	id: string,
	root: Document = document
) {
	const elem = root.getElementById(id)
	if (!elem) {
		throw new Error('Unable to find element: ' + id)
	}
	return elem as unknown as T
}

// ugly
const tag = document.createElement('script')
tag.src = 'https://www.youtube.com/iframe_api'
const firstScriptTag = document.getElementsByTagName('script')[0]
firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag)

// @ts-expect-error external lib
window.onYouTubeIframeAPIReady = function () {
	// buttons
	const btnGuess = getElementStrict<HTMLAnchorElement>('btn-guess')
	const btnSkip = getElementStrict<HTMLAnchorElement>('btn-skip')
	const btnPlay = getElementStrict<HTMLAnchorElement>('btn-play')

	// youtube api root
	const vidPlayer = getElementStrict<HTMLDivElement>('video-root')

	// where you pick your scene
	const opts = getElementStrict<HTMLSelectElement>('game-options')

	// should be a modal
	const out = getElementStrict<HTMLDialogElement>('output')
	const skipProgress = getElementStrict<HTMLDivElement>('game-progress') // todo: rename me
	const guessProgress = getElementStrict<HTMLSpanElement>('guess-progress-out')

	// initialise the game
	const game = new Game(
		btnGuess,
		vidPlayer,
		btnPlay,
		opts,
		out,
		skipProgress,
		guessProgress,
		btnSkip
	)
	console.log(game)
}
