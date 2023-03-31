import {
  drawSquares,
  drawStoryline,
  drawGraphs,
} from '../../src/js/utils/drawer'
import { partitionResult } from '../../scripts/hClusterMDL'

// Define the DOM elements and file path variable
const peopleVolume = document.getElementById('people-volume')
const peopleVolumeValue = document.getElementById('people-volume-value')
const timeframesVolume = document.getElementById('timeframes-volume')
const timeframesVolumeValue = document.getElementById('timeframes-volume-value')
const locationsVolume = document.getElementById('locations-volume')
const locationsVolumeValue = document.getElementById('locations-volume-value')
let filePath = 'data/case/case1.json'

// Helper function to update graph
function updateGraph() {
  filePath = `sim-front/Simulation-${peopleVolume.value}-${timeframesVolume.value}-${locationsVolume.value}.json`
  console.log('fileName :>> ', filePath)
  fetch(filePath)
    .then(response => response.json())
    .then(data => {
      const svg = Snap('#svg-container')
      svg.selectAll('*').remove()

      var storyJson = data
      var partition = partitionResult(storyJson)
      console.log('partition :>> ', partition)
      var graphs = drawGraphs(storyJson, partition)
      drawSquares(graphs)
      const storylines = graphs[0].storylines
      const characters = graphs[0].characters
      storylines.forEach((storyline, idx) =>
        drawStoryline(characters[idx], storyline)
      )
    })
    .catch(error => {
      console.error('Error loading story data:', error)
    })
}

// Set initial values of volume sliders and file path
peopleVolumeValue.innerHTML = peopleVolume.value
timeframesVolumeValue.innerHTML = timeframesVolume.value
locationsVolumeValue.innerHTML = locationsVolume.value

// Add event listeners to update file path and volume values
peopleVolume.addEventListener('input', function() {
  peopleVolumeValue.innerHTML = this.value
  updateGraph()
})

timeframesVolume.addEventListener('input', function() {
  timeframesVolumeValue.innerHTML = this.value
  updateGraph()
})

locationsVolume.addEventListener('input', function() {
  locationsVolumeValue.innerHTML = this.value
  updateGraph()
})

function defaultGraph(filePath) {
  console.log('fileName :>> ', filePath)
  fetch(filePath)
    .then(response => response.json())
    .then(data => {
      const svg = Snap('#svg-container')
      svg.selectAll('*').remove()

      var storyJson = data
      var partition = [50, 680, 1330]

      var graphs = drawGraphs(storyJson, partition)
      drawSquares(graphs)
      const storylines = graphs[0].storylines
      const characters = graphs[0].characters
      storylines.forEach((storyline, idx) =>
        drawStoryline(characters[idx], storyline)
      )
    })
    .catch(error => {
      console.error('Error loading story data:', error)
    })
}

defaultGraph(filePath)

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
