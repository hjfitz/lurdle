export class GameState {
	readonly maxGuesses: 5 = 5
	readonly #maxSeconds: 10 = 10
	#guessState = 0
	#progressState = 0

	public nextState(): boolean {
		this.#guessState = this.#guessState + 1
		return this.hasLost()
	}

	public getState(): number {
		return this.#guessState
	}

	public getSkipPerc(): number {
		return Math.floor((this.getSeconds() / this.#maxSeconds) * 100)
	}

	public hasLost(): boolean {
		return this.#guessState >= this.maxGuesses
	}

	public nextProgressState(): boolean {
		this.#progressState += 1
		return this.nextState()
	}

	public getProgressState(): number {
		return this.#progressState
	}

	public getSeconds(): number {
		// 1 second 0, 1 total guesses
		// 2 seconds for 2
		// 3 seconds for 3
		// 5 seconds for 5 guesses
		switch (this.#guessState) {
		case 0:
		case 1: {
			return 2
		}
		case 2: {
			return 5
		}
		case 3: {
			return 8
		}
		default: {
			return this.#maxSeconds
		}
		}
	}
}

// singleton
export default new GameState()
