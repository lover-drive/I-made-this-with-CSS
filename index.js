const pug = require('pug')
const getPixels = require('get-pixels')
const fs = require('fs')
const path = require('path')

function floydSteinberg (image, x, y, channel, resolution) {
	const divider = 256 / resolution
	const posterize = value => Math.round(value / divider) * divider

	const raw = image.get(x, y, channel)
	const value = posterize(raw)
	const error = raw - value

	image.set(x, y, channel, value)

	image.set(x + 1, y, channel, image.get(x + 1, y, channel) + error * 7 / 16)
	image.set(x - 1, y + 1, channel, image.get(x - 1, y + 1, channel) + error * 3 / 16)
	image.set(x, y + 1, channel, image.get(x, y + 1, channel) + error * 5 / 16)
	image.set(x + 1, y + 1, channel, image.get(x + 1, y + 1, channel) + error * 1 / 16)
}

function generateStyle (width, height, resolution) {
	let output = `#image { width: ${width}px; height: ${height}px; }
								i { display: inline-block; width: 1px; height: 1px; background: rgb(var(--r, 0), var(--g, 0), var(--b, 0)); }`
	for (let i = 0; i < resolution; i++) {
		output += `.r${i} { --r: ${i * 255 / resolution} }`
		output += `.g${i} { --g: ${i * 255 / resolution} }`
		output += `.b${i} { --b: ${i * 255 / resolution} }`
	}

	return output
}

function main (source_path, resolution = 8) {
	getPixels(source_path, (err, image) => {
		const [width, height, channels] = image.shape

		for (let y = 0; y < height; y++)
			for (let x = 0; x < width; x++)
				for (let channel = 0; channel < channels; channel++)
					floydSteinberg(image, x, y, channel, resolution)

		for (let y = 0; y < height; y++)
			for (let x = 0; x < width; x++)
				for (let channel = 0; channel < channels; channel++)
					image.set(x, y, channel, Math.round(image.get(x, y, channel) / 256 * resolution))

		const html = pug.renderFile('src/template.pug', {
			width,
			height,
			image,
			color_resolution: resolution,
			style: generateStyle(width, height, resolution)
		})
		fs.writeFile(path.resolve(source_path + '.html'), html, (err) => console.log('Done!'))
	})
}

if (!process.argv[2]) console.error('Provide an image!')
else main(path.resolve(process.argv[2]), process.argv[3] || 8)