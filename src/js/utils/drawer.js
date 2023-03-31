import Snap, { color } from 'snapsvg'
import * as d3 from 'd3'
import { drawJointSubGraphs } from '../../../scripts/utils.js'

export function drawSegmentPath(pathStr, defaultWidth = 2, hoverWidth = 4) {
  const svg = Snap('#svg-container')
  const graphicsContainerHeight = document.querySelector('.graphics-container')
    .clientHeight
  const graphicsContainerWidth = document.querySelector('.graphics-container')
    .clientWidth
  svg.attr(
    'viewBox',
    `0 0 ${graphicsContainerWidth} ${graphicsContainerHeight}`
  )
  const pathSvg = svg.path(pathStr)
  pathSvg.hover(
    () => {
      pathSvg.attr({
        stroke: 'blue',
        'stroke-width': hoverWidth,
      })
    },
    () => {
      pathSvg.attr({
        stroke: 'black',
        'stroke-width': defaultWidth,
      })
    }
  )
  pathSvg.attr({
    fill: 'none',
    stroke: 'black',
    'stroke-width': defaultWidth,
  })
  return pathSvg
}

export function drawStorylinePath(storylinePath) {
  storylinePath.forEach(segmentPath => drawSegmentPath(segmentPath))
}

export function drawStoryline(character, storyline, type = 'simple') {
  storyline.forEach((segment, idx) => {
    let segmentPath = ''
    switch (type) {
      case 'bezier':
        segmentPath = generateBezierPath(segment)
        break
      default:
        segmentPath = generateSimplePath(segment)
        break
    }
    const segmentPathSvg = drawSegmentPath(segmentPath)
    segmentPathSvg.click(() => {
      console.log(character, idx)
    })
  })
}

function generateSimplePath(points) {
  if (points.length === 0) return ''
  let pathStr = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 1, len = points.length; i < len; i++) {
    pathStr += `L ${points[i][0]} ${points[i][1]}`
  }
  return pathStr
}

function generateBezierPath(points) {
  if (points.length < 4) return generateSimplePath(points)
  const pointsNum = points.length
  let i = 0
  let pathStr = `M ${points[i][0]} ${points[i][1]} C ${points[i + 1][0]} ${
    points[i + 1][1]
  } ${points[i + 2][0]} ${points[i + 2][1]} ${points[i + 3][0]} ${
    points[i + 3][1]
  }`
  for (i = 4; i < pointsNum - 2; i += 2) {
    pathStr += `S ${points[i][0]} ${points[i][1]} ${points[i + 1][0]} ${
      points[i + 1][1]
    }`
  }
  pathStr += ` L ${points[pointsNum - 1][0]} ${points[pointsNum - 1][1]}`
  return pathStr
}

function getXScope(graphs) {
  for (let graph of graphs) {
    let minX = 10000
    let maxX = 0
    for (let nodeSetList of graph._nodes) {
      for (let nodeSet of nodeSetList) {
        let firstNode = nodeSet[0]
        let lastNode = nodeSet[nodeSet.length - 1]
        if (firstNode[0] < minX) {
          minX = firstNode[0]
        }
        if (lastNode[0] > maxX) {
          maxX = lastNode[0]
        }
      }
    }
    graph.maxX = maxX
    graph.minX = minX
    console.log('[minX, maxX] :>> ', [minX, maxX])
  }
  return graphs
}

export function drawSquares(graphs) {
  const svg = d3.select('#svg-container')

  var minY = 80
  const graphicsContainerHeight = document.querySelector('.graphics-container')
    .clientHeight
  const graphicsContainerWidth = document.querySelector('.graphics-container')
    .clientWidth
  var maxY = graphicsContainerHeight - minY

  var _graphs = getXScope(graphs)

  console.log('_graphs.length :>> ', _graphs.length)
  for (let graph of _graphs) {
    var minX = graph.minX
    let maxX = graph.maxX
    if (_graphs.indexOf(graph) === 0 && _graphs.length > 1) {
      console.log('_graphs[1].minX  :>> ', _graphs[1].minX)
      maxX = _graphs[1].minX - 100
      console.log('first graph :>> ')
    }

    svg.attr(
      'viewBox',
      `0 0 ${graphicsContainerWidth} ${graphicsContainerHeight}`
    )

    const squareWidth = maxX - minX
    const squareHeight = maxY - minY
    console.log('[squareWidth, squareHeight] :>> ', [squareWidth, squareHeight])

    svg
      .append('rect')
      .attr('x', minX)
      .attr('y', minY)
      .attr('width', squareWidth)
      .attr('height', squareHeight)
      .attr('fill', 'white')
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('rx', 10)
      .attr('ry', 10)
  }
  console.log('done drawing squares :>> ')
}

export function drawGraphs(storyJson, partition, minY = 100) {
  const graphicsContainerHeight = document.querySelector('.graphics-container')
    .clientHeight
  const graphicsContainerWidth = document.querySelector('.graphics-container')
    .clientWidth

  var width = graphicsContainerWidth - 20

  var maxY = graphicsContainerHeight - minY

  // console.log('size :>> ', [width, maxY, minY])

  var graphs = drawJointSubGraphs(
    storyJson,
    partition,
    false,
    width,
    100,
    minY,
    maxY
  )

  // console.log('graphs[0] :>> ', graphs[0])

  return graphs
}
