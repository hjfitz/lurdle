import {Events} from './db.js'
import guessState from './guess.state.js'
import {VideoState} from './video.state.js'

class Game {
	readonly #guessState = guessState
	readonly #videoState: VideoState
	// elements
	readonly #guessButton: HTMLAnchorElement
	readonly #guessField: HTMLInputElement
	readonly #playButton: HTMLAnchorElement
	readonly #options: HTMLSelectElement
	readonly #output: HTMLElement

	constructor(
		guessButton: HTMLAnchorElement,
		guessFeild: HTMLInputElement,
		videoElement: HTMLDivElement,
		playButton: HTMLAnchorElement,
		options: HTMLSelectElement,
		output: HTMLElement,
	) {
		// elements
		this.#guessButton = guessButton
		this.#guessField = guessFeild
		this.#playButton = playButton
		this.#options = options
		this.#output = output

		// game bits
		this.addEventListeners()
		this.initialiseDropdownOptions()

		// misc
		this.#videoState = new VideoState(this.#guessState, videoElement)
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
		this.#guessButton.addEventListener('click', this.guess.bind(this))
		this.#guessField.addEventListener('keyup', this.hasGuessed.bind(this))
		this.#playButton.addEventListener('click', () => this.#videoState.playForGuess())
		console.log('added event listeners')
	}

	getGuess(): string {
		return this.#options.value
		//const [selected] = this.#options.selectedOptions
		//return selected.dataset.eventId!
	}

	guess(ev?: MouseEvent) {
		ev?.preventDefault()
		this.tryGuess()
	}

	tryGuess() {
		// move to next input state
		this.#guessState.nextState()
		const guess = this.getGuess()
		const isMatch = this.#videoState.getVideo() === guess
		this.writeProgress(isMatch, this.#guessState.getState())
		console.log({isMatch})
	}

	async writeProgress(matches: boolean, guesses: number) {
		console.log(guesses)
		this.#output.innerHTML = ''
		const p = document.createElement('p')
		const node = document.createTextNode('🧙🏻‍♂️')
		p.appendChild(node)

		for (let i = 0; i < guesses; i++) {
			if (matches && i === guesses - 1) {
				const node = document.createTextNode('🟩')
				p.appendChild(node)
			} else {
				const node = document.createTextNode('⬛️')
				p.appendChild(node)
			}
		}

		const text = document.createElement('p')
		text.textContent = '#Lurdle ⚔️'
		if (matches || this.#guessState.hasLost()) {
			this.#output.appendChild(text)
			this.#output.appendChild(document.createTextNode('\n\n'))
			this.#output.appendChild(p)
		}

		await navigator.clipboard.writeText(this.#output.textContent!)

	}

	hasGuessed(ev: KeyboardEvent) {
		ev.preventDefault()
		if (ev.key === 'Enter') {
			this.guess()
		}
	}
}

function getElementStrict<T = HTMLElement>(id: string) {
	const elem = document.getElementById(id)
	if (!elem) {
		throw new Error('Unable to find element: ' + id)
	}
	return elem as unknown as T
}

// @ts-expect-error external lib
window.onYouTubeIframeAPIReady = function() {
	const btnGuess = getElementStrict<HTMLAnchorElement>('btn-guess')
	const inpGuess = getElementStrict<HTMLInputElement>('inp-guess')
	const vidPlayer = getElementStrict<HTMLDivElement>('video-root')
	const inpPlay = getElementStrict<HTMLAnchorElement>('btn-play')
	const opts = getElementStrict<HTMLSelectElement>('game-options')
	const out = getElementStrict('output')
	const game = new Game(btnGuess, inpGuess, vidPlayer, inpPlay, opts, out)
	console.log(game)
}
