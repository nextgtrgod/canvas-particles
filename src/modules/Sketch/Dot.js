import getDistance from '../../utils/getDistance'

const T = 2 * Math.PI
let i = 0
let distance = 0

class Dot {
	constructor({ id, x, y, r, v, fill = '#F0F0F0', type }) {
		this.id = id
		this.x = x
		this.y = y
		this.r = r
		this.v = v
		this.fill = fill
		this.type = type
		
		if (this.type === 'static') this.update = this.draw

		this.lines = new Map()

		this.bounds = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
		}
		this.updateBounds()
	}

	checkOffscreen(W, H) {
		if (this.bounds.left <= 0 && this.v.x <= 0) this.v.x *= -1
		else if (this.bounds.right >= W && this.v.x >= 0) this.v.x *= -1

		if (this.bounds.top <= 0 && this.v.y <= 0) this.v.y *= -1
		else if (this.bounds.bottom >= H && this.v.y >= 0) this.v.y *= -1
	}

	updateBounds() {
		this.bounds.top = this.y - this.r
		this.bounds.right = this.x + this.r
		this.bounds.bottom = this.y + this.r
		this.bounds.left = this.x - this.r
	}

	checkDots(dots, threshold) {
		for (i = 0; i < dots.length; i++) {
			if (dots[i].id === this.id) continue
			if (dots[i].lines.get(this.id)) continue

			distance = getDistance(this.x, this.y, dots[i].x, dots[i].y)

			// check collisions with other dots
			if (distance <= this.r + dots[i].r) {

				if (dots[i].type === 'static') {
					this.v.x *= -1
					this.v.y *= -1
					continue
				}

				let v = [
					{ x: this.v.x, y: this.v.y },
					{ x: dots[i].v.x, y: dots[i].v.y }
				]

				this.v.x = v[1].x
				this.v.y = v[1].y

				dots[i].v.x = v[0].x
				dots[i].v.y = v[0].y

				continue
			}

			if (dots[i].type === 'static') continue

			// add lines between dots
			if (distance <= threshold)
				this.lines.set(dots[i].id, {
					from: [ this.x, this.y ],
					to: [ dots[i].x, dots[i].y ],
					alpha: (threshold - distance) / (threshold / 2),
					width: Math.min((threshold / distance), Math.min(this.r, dots[i].r) / 2)
				})
			else this.lines.delete(dots[i].id)
		}
	}

	update(ctx, W, H, dots, threshold) {
		this.x += this.v.x || 0
		this.y += this.v.y || 0

		this.checkOffscreen(W, H)
		this.updateBounds()
		this.checkDots(dots, threshold)

		this.draw(ctx)
	}

	draw(ctx) {
		ctx.beginPath()
		ctx.fillStyle = this.fill
		ctx.arc(this.x, this.y, this.r, 0, T)
		ctx.fill()
	}
}

export default Dot
