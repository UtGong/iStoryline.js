import { drawSquares } from '../../src/js/utils/drawer'

const peopleVolume = document.getElementById('people-volume')
const peopleVolumeValue = document.getElementById('people-volume-value')
const timeframesVolume = document.getElementById('timeframes-volume')
const timeframesVolumeValue = document.getElementById('timeframes-volume-value')
const locationsVolume = document.getElementById('locations-volume')
const locationsVolumeValue = document.getElementById('locations-volume-value')

let filePath = 'sim-front/Simulation-20-20-20.json'

peopleVolumeValue.innerHTML = peopleVolume.value
peopleVolume.addEventListener('input', function() {
  peopleVolumeValue.innerHTML = this.value
  filePath = `sim-front/Simulation-${peopleVolume.value}-${timeframesVolume.value}-${locationsVolume.value}.json`
  console.log('fileName :>> ', filePath)
})

timeframesVolumeValue.innerHTML = timeframesVolume.value
timeframesVolume.addEventListener('input', function() {
  timeframesVolumeValue.innerHTML = this.value
  filePath = `sim-front/Simulation-${peopleVolume.value}-${timeframesVolume.value}-${locationsVolume.value}.json`
  console.log('fileName :>> ', filePath)
})

locationsVolumeValue.innerHTML = locationsVolume.value
locationsVolume.addEventListener('input', function() {
  locationsVolumeValue.innerHTML = this.value
  filePath = `sim-front/Simulation-${peopleVolume.value}-${timeframesVolume.value}-${locationsVolume.value}.json`
  console.log('fileName :>> ', filePath)
})

// svg

const partition = [2, 3] // Sample data

const padding = 100

drawSquares(partition, padding)

// import { logStoryInfo } from '../../src/js/utils/logger'
// import { drawStoryline } from '../../src/js/utils/drawer'
// import iStoryline from '../../src/js'

// async function main(fileName) {
//   const iStorylineInstance = new iStoryline()
//   const fileUrl = `../../data/${fileName.split('.')[1]}/${fileName}`
//   let graph = await iStorylineInstance.loadFile(fileUrl)
//   // Scale to window size
//   const containerDom = document.getElementById('mySvg')
//   const windowW = containerDom.clientWidth - 20
//   const windowH = containerDom.clientHeight - 20
//   graph = iStorylineInstance.scale(10, 10, windowW * 0.8, windowH / 2)
//   logStoryInfo(iStorylineInstance._story)
//   const storylines = graph.storylines
//   const characters = graph.characters
//   storylines.forEach((storyline, idx) =>
//     drawStoryline(characters[idx], storyline)
//   )
// }
// main('JurassicParkTune.json')
