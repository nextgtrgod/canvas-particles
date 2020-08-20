
let animator = {
	fs: [],
	rafId: null,

	add(f) {
		!this.fs.includes(f) && this.fs.push(f)
	},

	remove() {
		this.fs = this.fs.filter(f => f !== rf)
	},

	play(delta, ...args) {

		this.rafId = requestAnimationFrame(() => this.play())

		this.fs.forEach(f => f(delta, ...args))
	},

	stop() {
		cancelAnimationFrame(this.rafId)
	}
}

export default animator
