import { createReadStream, createWriteStream } from 'fs'
import { createInterface } from 'readline'
import os from 'os'

const readStream = createReadStream('./guwen0-1000.json')
const writeStream = createWriteStream('./guwen.json')
const rl = createInterface({
  input: readStream,
})

rl.on('line', (line) => {
  writeStream.write(`${line},${os.EOL}`)
})

