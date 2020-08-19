import Sketch from './modules/Sketch'

let canvas = document.getElementById('scene')
let sketch = new Sketch(canvas)

let isIframe = (() => {
	try {
		return window.self !== window.top
	} catch (e) {
		return true
	}
})()

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
} else sketch.start()

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

		let update = () => {
			requestAnimationFrame(update)
			analyser.getByteFrequencyData(dataArray)

			let av = 0

			for (let i = 0; i < bufferLength; i++) {
				av += dataArray[i]
			}

			sketch.amp = 3 * (av / bufferLength) / 128
		}
		update()

	} catch (err) {
		console.log(err)
	}
}

// let update = () => 

let mic = document.getElementById('mic')
mic.addEventListener('click', getMedia)
