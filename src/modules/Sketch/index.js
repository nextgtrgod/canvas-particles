import rnd from '../../utils/random'
import Dot from './Dot'

let dpr = parseInt((new URL(document.location)).searchParams.get('dpr')) || window.devicePixelRatio
let W = window.innerWidth
let H = window.innerHeight
let threshold = Math.max(W, H) / 4

const PI = Math.PI

class Sketch {
	constructor({ canvas, controls }) {
		this.canvas = canvas
		this.controls = controls
		this.radId = 0

		this.init()

		let resizeTimer = 0
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimer)
			resizeTimer = setTimeout(() => {
				this.init()
				this.draw()
			}, 150)
		})
	}

	init() {
		W = window.innerWidth
		H = window.innerHeight

		threshold = Math.max(W, H) / 4

		this.canvas.width = W * dpr
		this.canvas.height = H * dpr

		this.ctx = this.canvas.getContext('2d', { alpha: false })
		this.ctx.scale(dpr, dpr)

		this.createDots()
	}

	createDots() {
		this.dots = []

		let count = 32
		let speed = 2

		let r = (W > 600)
			? [6, 9]
			: [3, 6]

		let range = {
			x: [0 + r[1], W - r[1]],
			y: [0 + r[1], H - r[1]],
			r,
		}

		// add dummy area from ui
		if (this.controls) {
			let offset = {
				x: 10,
				y: 10,
			}
			let size = 48
			let R = size / 2

			let dot = new Dot({
				id: count,
				type: 'static',
				x: W - (R + offset.x),
				y: 0 + (R + offset.y),
				r: R,
				v: {
					x: 0,
					y: 0,
				},
				fill: '#000',
			})

			range.x[1] -= offset.x + size + range.r[1]
			range.y[0] = offset.y + size + range.r[1]

			this.dots.push(dot)
		}
	
		for (let i = 0; i < count; i++) {
	
			let s = rnd.range(.5, speed)
	
			let limit = PI/12
			let angle = rnd.from([
				rnd.range(limit, PI/2 - limit),
				rnd.range(PI/2 + limit, PI - limit),
				rnd.range(PI + limit, 1.5*PI - limit),
				rnd.range(1.5*PI + limit, 2*PI - limit),
			])
	
			this.dots.push(
				new Dot({
					id: i,
					x: rnd.range(...range.x),
					y: rnd.range(...range.y),
					r: rnd.range(...range.r),
					v: {
						x: s * Math.cos(angle),
						y: s * Math.sin(angle),
					},
				})
			)
		}
	}

	draw() {
		// clear canvas
		this.ctx.fillStyle = '#000'
		this.ctx.fillRect(0, 0, W, H)
	
		for (let i = 0; i < this.dots.length; i++) {
	
			this.dots[i].update(this.ctx, W, H, this.dots, threshold)
	
			for (let id in this.dots[i].lines) {
				this.ctx.beginPath()
				this.ctx.moveTo(this.dots[i].lines[id][0].x, this.dots[i].lines[id][0].y)
				this.ctx.lineTo(this.dots[i].lines[id][1].x, this.dots[i].lines[id][1].y)
	
				this.ctx.strokeStyle = `rgba(240, 240, 240, ${this.dots[i].lines[id].alpha})`
				this.ctx.lineWidth = this.dots[i].lines[id].width / dpr
				this.ctx.stroke()
			}
		}
	}

	update() {
		this.radId = requestAnimationFrame(() => this.update())
		this.draw()
	}

	start() {
		this.update()
	}

	stop() {
		cancelAnimationFrame(this.radId)
	}
}

export default Sketch
