import Sketch from './modules/Sketch'
import clamp from './utils/clamp'
import animator from './utils/animator'

let isIframe = (() => {
	try {
		return window.self !== window.top
	} catch (e) {
		return true
	}
})()

let canvas = document.getElementById('scene')
let sketch = new Sketch({ canvas, controls: !isIframe })

let getMedia = async () => {
	let stream = null

	try {
		stream = await navigator.mediaDevices.getUserMedia({ audio: true })

		let ctx = new window.AudioContext()
		let analyser = ctx.createAnalyser()

		let source = ctx.createMediaStreamSource(stream)
		source.connect(analyser)

		analyser.fftSize = 2048
		let bufferLength = analyser.frequencyBinCount
		let dataArray = new Uint8Array(bufferLength)

		// analyser.getByteTimeDomainData(dataArray)

		let update = ctx => {
			analyser.getByteFrequencyData(dataArray)

			let av = 0

			for (let i = 0; i < bufferLength; i++) {
				av += dataArray[i]
			}

			let amp = clamp(0, 1.25 * (av / bufferLength) / 128, 1)

			// console.log(amp)

			sketch.amp = amp

			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
			ctx.fillRect(0, (1 - amp) * ctx.canvas.height, ctx.canvas.width, ctx.canvas.height)
			ctx.fill()
		}
		return update

	} catch (err) {
		console.log(err)
	}
}

let initMic = node => {
	let mic = document.getElementById('mic')
	if (!mic) return

	mic.classList.add('highlight')

	let canvas = document.createElement('canvas')
	let dpi = window.devicePixelRatio
	canvas.width = 48 * dpi
	canvas.height = 48 * dpi

	mic.appendChild(canvas)

	mic.addEventListener('click', async () => {
		let update = await getMedia()

		animator.add(() => update(ctx))

		mic.classList.remove('highlight')
	})

	let ctx = canvas.getContext('2d')
	ctx.fillStyle = '#01bfbf'
}

if (isIframe) {
	document.body.classList.add('is-iframe')

	sketch.draw()

	let trusted = [
		'http://localhost:8080',
		'https://nextgtrgod.github.io',
	]

	window.addEventListener('message', e => {
		if (!trusted.includes(e.origin)) return
		
		switch (e.data) {
			case 'start':
				sketch.start()
				break;
			case 'stop':
				sketch.stop()
				break;
		}
	})
} else {
	animator.add(() => sketch.draw())

	initMic()

	animator.play()

	let controls = document.getElementById('controls')

	document.addEventListener('keyup', ({ keyCode }) => {
		if (keyCode !== 72) return
		controls.classList.toggle('hidden')
		sketch.controls = !sketch.controls
		window.dispatchEvent(new Event('resize'))
	})
	console.log('h - toggle controls')
}