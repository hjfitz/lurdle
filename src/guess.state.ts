export class GameState {
	readonly maxAttempts: 5 = 5
	readonly #maxSeconds: 10 = 10
	#attemptCount = 0
	#skipCount = 0

	public getSkipPerc(): number {
		return Math.floor((this.getSeconds() / this.#maxSeconds) * 100)
	}

	public hasLost(): boolean {
		return this.#attemptCount >= this.maxAttempts
	}

	public nextAttemptState(): boolean {
		this.#attemptCount += 1
		return this.hasLost()
	}

	public nextProgressState(): boolean {
		this.#skipCount += 1
		return this.nextAttemptState()
	}

	public getAttemptCount(): number {
		return this.#attemptCount
	}

	public getSkipCount(): number {
		return this.#skipCount
	}

	public getSeconds(): number {
		// 1 second 0, 1 total guesses
		// 2 seconds for 2
		// 3 seconds for 3
		// 5 seconds for 5 guesses
		switch (this.#skipCount) {
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
