import {Events} from './db.js'
import guessState from './guess.state.js'
import {VideoState} from './video.state.js'

class Game {
	readonly #guessState = guessState
	readonly #videoState: VideoState
	// elements
	readonly #guessButton: HTMLAnchorElement
	readonly #playButton: HTMLAnchorElement
	readonly #options: HTMLSelectElement
	readonly #output: HTMLElement
	readonly #progressBar: HTMLDivElement
	readonly #skipButton: HTMLAnchorElement

	constructor(
		guessButton: HTMLAnchorElement,
		videoElement: HTMLDivElement,
		playButton: HTMLAnchorElement,
		options: HTMLSelectElement,
		output: HTMLElement,
		progress: HTMLDivElement,
		skip: HTMLAnchorElement,
	) {
		// elements
		// todo: normalise button naming convention
		this.#guessButton = guessButton
		this.#playButton = playButton
		this.#skipButton = skip
		this.#options = options
		this.#output = output
		this.#progressBar = progress

		// game bits
		this.addEventListeners()
		this.initialiseDropdownOptions()
		this.initialiseProgressMarkers()

		// misc
		this.#videoState = new VideoState(this.#guessState, videoElement)
	}

	initialiseProgressMarkers() {
	}

	initialiseDropdownOptions() {
		Object.entries(Events).sort(() => Math.random() - 0.5).forEach(([id, opt]) => {
			const el = document.createElement('option')
			el.textContent = opt
			el.dataset.eventId = id
			this.#options.appendChild(el)
		})
	}

	addEventListeners() {
		this.#guessButton.addEventListener('click', this.tryGuess.bind(this))
		this.#skipButton.addEventListener('click', this.moveSkipState.bind(this))
		this.#playButton.addEventListener('click', () => this.#videoState.playForGuess())
		console.log('added event listeners')
	}

	moveSkipState(ev: MouseEvent) {
		console.log('updating skip state')
		ev.preventDefault()
		if (this.#guessState.hasLost()) return
		const hasLost = this.#guessState.nextProgressState()
		// move progress bar
		const progressBar = this.#progressBar.querySelector('#guess-progress')! as HTMLDivElement
		const percProgress = (this.#guessState.getProgressState() / this.#guessState.maxGuesses) * 100
		progressBar.style.width = `${percProgress}%`
		if (hasLost) {
			progressBar.classList.add('bg-gray-900')
			progressBar.classList.remove('bg-gray-100')
			this.#skipButton.classList.add('disabled')
			this.writeOutput(false, this.#guessState.maxGuesses)
		}
	}

	getGuess(): string {
		return this.#options.value
	}

	tryGuess(ev: MouseEvent) {
		ev.preventDefault()

		// move to next guess state
		this.#guessState.nextState()
		const guess = this.getGuess()
		const isMatch = this.#videoState.getVideo() === guess
		const totalGuesses = this.#guessState.getState()
		this.writeProgress(totalGuesses)
		this.writeOutput(isMatch, totalGuesses)
	}

	writeProgress(totalGuesses: number) {
	}


	async writeOutput(matches: boolean, guesses: number) {
		console.log({guesses})
		this.#output.innerHTML = ''
		const p = document.createElement('p')
		const node = document.createTextNode('🧙🏻‍♂️')
		p.appendChild(node)

		// todo: look in to splitting skipstate and gamestate 
		Array.from({length: guesses}, (_, idx) => {
			let node = document.createTextNode('⬛️')
			if (matches && (idx + 1) === guesses) {
				node = document.createTextNode('🟩')
			}
			p.appendChild(node)
		})

		const text = document.createElement('p')
		text.textContent = '#Lurdle ⚔️'
		if (matches || this.#guessState.hasLost()) {
			this.#output.appendChild(text)
			this.#output.appendChild(document.createTextNode('\n\n'))
			this.#output.appendChild(p)
		}

		await navigator.clipboard.writeText(this.#output.textContent!)

	}
}

function getElementStrict<T = HTMLElement>(id: string, root: Document = document) {
	const elem = root.getElementById(id)
	if (!elem) {
		throw new Error('Unable to find element: ' + id)
	}
	return elem as unknown as T
}

// @ts-expect-error external lib
window.onYouTubeIframeAPIReady = function() {
	// buttons
	const btnGuess = getElementStrict<HTMLAnchorElement>('btn-guess')
	const btnSkip = getElementStrict<HTMLAnchorElement>('btn-skip')
	const btnPlay = getElementStrict<HTMLAnchorElement>('btn-play')

	// youtube api root
	const vidPlayer = getElementStrict<HTMLDivElement>('video-root')

	// where you pick your scene
	const opts = getElementStrict<HTMLSelectElement>('game-options')

	// should be a modal
	const out = getElementStrict('output')
	const progress = getElementStrict<HTMLDivElement>('game-progress')

	// initialise the game
	const game = new Game(btnGuess, vidPlayer, btnPlay, opts, out, progress, btnSkip)
	console.log(game)
}
