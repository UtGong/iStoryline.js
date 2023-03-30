import Snap from 'snapsvg'
import * as d3 from 'd3'

export function drawSegmentPath(pathStr, defaultWidth = 2, hoverWidth = 4) {
  const svg = Snap('#mySvg')
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

export function drawSquares(partition, padding) {
  const svg = d3.select('#svg-container')

  const graphicsContainerHeight = document.querySelector('.graphics-container')
    .clientHeight
  const graphicsContainerWidth = document.querySelector('.graphics-container')
    .clientWidth

  const numSquares = partition.length + 1
  const squareWidth =
    (graphicsContainerWidth - 40 - padding * (numSquares - 1)) / numSquares
  const squareHeight = squareWidth

  const yOffset = (graphicsContainerHeight - squareHeight) / 2

  svg.attr(
    'viewBox',
    `0 0 ${graphicsContainerWidth} ${graphicsContainerHeight}`
  )

  svg
    .selectAll('rect')
    .data(partition)
    .enter()
    .append('rect')
    .attr('x', (d, i) => {
      const xOffset =
        (graphicsContainerWidth -
          squareWidth * numSquares -
          padding * (numSquares - 1)) /
        2
      return xOffset + i * (squareWidth + padding)
    })
    .attr('y', yOffset)
    .attr('width', squareWidth)
    .attr('height', squareHeight)
    .attr('fill', 'white')
    .attr('rx', 30) // set the x-axis radius of the corners to 5
    .attr('ry', 30)

  svg
    .append('rect')
    .attr(
      'x',
      (numSquares - 1) * (squareWidth + padding) +
        (graphicsContainerWidth -
          squareWidth * numSquares -
          padding * (numSquares - 1)) /
          2
    )
    .attr('y', yOffset)
    .attr('width', squareWidth)
    .attr('height', squareHeight)
    .attr('fill', 'white')
    .attr('rx', 30) // set the x-axis radius of the corners to 5
    .attr('ry', 30)
}
