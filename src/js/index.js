import { CharacterStore } from "./data/character";
import { storyOrder } from "./order/index";
import { storyAlign } from "./align/index";
import { storyCompact } from "./compact/index";
import { storyRender } from "./render/index";
import { storyTransform } from "./transform/index";
import { CtrInfo } from "./data/constraint";
import { Graph } from "./data/graph";
import {
  logNameError,
  logTimeError,
  convertDataToStory,
  convertDataToConstraints
} from "./utils";

export default class iStoryline extends CharacterStore {
  /**
   * Construct the iStoryline generator for a story.
   * Once the story changed, the generator should be re-constructed.
   *
   * @param {Array} pipeline
   * - ['GreedyOrder', 'GreedyAlign', 'GreedyCompact', 'Render', 'FreeTransform']
   */
  constructor(pipeline = []) {
    super();
    // Pipeline configuration
    this.orderModule = pipeline[0] || "Null";
    this.alignModule = pipeline[1] || "Null";
    this.compactModule = pipeline[2] || "Null";
    this.renderModule = pipeline[3] || "SmoothRender";
    this.transformModule = pipeline[4] || "Null";
    // Constraints for opimization models
    this.ctrInfo = new CtrInfo();
  }

  /**
   * Generate storyline visualizations from the input file.
   *
   * @param {String} fileSrc
   * - "./data/JurassicPark.xml"
   */
  async readFile(fileSrc) {
    await this.readXMLFile(fileSrc);
    return this._layout();
  }

  _layout(rawData) {
    let story = convertDataToStory(rawData);
    let constraints = [];
    console.log(story);
    storyOrder(this.orderModule, story, constraints);
    storyAlign(this.alignModule, story, constraints);
    storyCompact(this.compactModule, story, constraints);
    storyRender(this.renderModule, story, constraints);
    storyTransform(this.transformModule, story, constraints);
    let graph = new Graph(story);
    return graph;
  }
  /**
   * Generate storyline visualization
   *
   * @return graph
   */
  __layout() {
    let story = this.data;
    delete story.initialNodes;
    delete story.sequence;
    delete story.sketchNodes;
    delete story.alignedSessions;
    delete story.renderNodes;
    delete story.smoothNodes;
    let constraints = this.ctrInfo.ctrs;
    storyOrder(this.orderModule, story, constraints);
    storyAlign(this.alignModule, story, constraints);
    storyCompact(this.compactModule, story, constraints);
    storyRender(this.renderModule, story, constraints);
    storyTransform(this.transformModule, story, constraints);
    let graph = new Graph(story);
    return graph;
  }
  /**
   * Rearrange the order of lines
   *
   * @param {String[]} names
   * @param {Number[]} span
   * @param {Array} constraints
   *
   * @example
   * - constraint: {
   *   "names": ['upperName', 'lowerName'],
   *   "timeSpan": [t1, t2],
   *   "style": 'Sort',
   *   "param": {}
   * }
   *
   * @return graph
   */
  sort(names, span, ctrs = []) {
    // Update constraints
    if (ctrs.length > 0) {
      this.ctrInfo.addCtrs(ctrs);
    } else if (logNameError("Sort", names, 2) && logTimeError("Sort", span)) {
      this.ctrInfo.addCtr({
        names: names,
        timeSpan: span,
        style: "Sort",
        param: {}
      });
    }
    return this._layout();
  }

  /**
   * Bend a line
   *
   * @param {String[]} names
   * @param {Number[]} span
   * @param {Array} constraints
   *
   * @example
   * - constraint: {
   *   "names": ['name'],
   *   "timeSpan": [t1, t2],
   *   "style": 'Bend',
   *   "param": {}
   * }
   *
   * @return graph
   */
  bend(names, span, ctrs = []) {
    // Update constraints
    if (ctrs.length > 0) {
      this.ctrInfo.addCtrs(ctrs);
    } else if (logNameError("Bend", names, 1) && logTimeError("Bend", span)) {
      this._addKeytimeframe(span[0]);
      this.ctrInfo.addCtr({
        names: names,
        timeSpan: span,
        style: "Bend",
        param: {}
      });
    }
    return this._layout();
  }

  /**
   * Straighten a line
   *
   * @param {String[]} names
   * @param {Number[]} span
   * @param {Array} constraints
   *
   * @example
   * - constraint: {
   *   "names": ['name'],
   *   "timeSpan": [t1, t2],
   *   "style": 'Straighten',
   *   "param": {}
   * }
   *
   * @return graph
   */
  straighten(names, span, ctrs = []) {
    // Update constraints
    if (ctrs.length > 0) {
      this.ctrInfo.addCtrs(ctrs);
    } else if (
      logNameError("Straighten", names, 1) &&
      logTimeError("Straighten", span)
    ) {
      this.ctrInfo.addCtr({
        names: names,
        timeSpan: span,
        style: "Straighten",
        param: {}
      });
    }
    return this._layout();
  }

  /**
   * Remove white space
   *
   * @param {String[]} names
   * @param {Number[]} span
   * @param {Number} scale
   * @param {Array} constraints
   *
   * @example
   * - scale: 0<<1
   * - constraint: {
   *   "names": ['name1', 'name2', ...],
   *   "timeSpan": [t1, t2],
   *   "style": 'Compact',
   *   "param": { 'scale': 0.5 }
   * }
   *
   * @return graph
   */
  compress(names, span, scale = 0.5, ctrs = []) {
    // Update constraints
    if (ctrs.length > 0) {
      this.ctrInfo.addCtrs(ctrs);
    } else if (
      logNameError("Compress", names) &&
      logTimeError("Compress", span)
    ) {
      this.ctrInfo.addCtr({
        names: names,
        timeSpan: span,
        style: "Compress",
        param: { scale: scale }
      });
    }
    return this._layout();
  }

  /**
   * Expand white space
   *
   * @param {String[]} names
   * @param {Number[]} span
   * @param {Number} scale
   * @param {Array} constraints
   *
   * @example
   * - scale: >1
   * - constraint: {
   *   "names": ['name1', 'name2', ...],
   *   "timeSpan": [t1, t2],
   *   "style": 'Expand',
   *   "param": {}
   * }
   *
   * @return graph
   */
  expand(names, span, scale = 2, ctrs = []) {
    // Update constraints
    if (ctrs.length > 0) {
      this.ctrInfo.addCtrs(ctrs);
    } else if (logNameError("Extend", names) && logTimeError("Extend", span)) {
      this.ctrInfo.addCtr({
        names: names,
        timeSpan: span,
        style: "Expand",
        param: { scale: scale }
      });
    }
    return this._layout();
  }

  /**
   * Control white space
   *
   * @param {Number} intraSep
   * @param {Number} interSep
   *
   * @return graph
   */
  space(intraSep, interSep) {
    this.ctrInfo.updateCtr({
      names: [],
      timeSpan: [],
      style: "Scale",
      param: {
        intraSep: intraSep,
        interSep: interSep
      }
    });
    return this._layout();
  }

  /**
   * Merge lines
   *
   * @param {String[]} names
   * @param {Number[]} span
   * @param {Array} constraints
   *
   * @example
   * - constraint: {
   *   "names": ['name1', 'name2', ...],
   *   "timeSpan": [t1, t2],
   *   "style": 'Merge',
   *   "param": {}
   * }
   *
   * @return graph
   */
  merge(names, span, ctrs = []) {
    // Update constraints
    if (ctrs.length > 0) {
      this.ctrInfo.addCtrs(ctrs);
    } else if (logNameError("Merge", names, 2) && logTimeError("Merge", span)) {
      this.ctrInfo.addCtr({
        names: names,
        timeSpan: span,
        style: "Merge",
        param: {}
      });
    }
    return this._layout();
  }

  /**
   * Split merged lines
   *
   * @param {String[]} names
   * @param {Number[]} span
   * @param {Array} constraints
   *
   * @example
   * - constraint: {
   *   "names": ['name1', 'name2', ...],
   *   "timeSpan": [t1, t2],
   *   "style": 'Split',
   *   "param": {}
   * }
   *
   * @return graph
   */
  split(names, span, ctrs = []) {
    // Update constraints
    if (ctrs.length > 0) {
      this.ctrInfo.addCtrs(ctrs);
    } else if (logNameError("Split", names, 2) && logTimeError("Split", span)) {
      this.ctrInfo.addCtr({
        names: names,
        timeSpan: span,
        style: "Split",
        param: {}
      });
    }
    return this._layout();
  }

  /**
   * Change line paths
   *
   * @param {String[]} names
   * @param {Number[]} span
   * @param {Point[]} path
   * @param {Array} constraints
   *
   * @example
   * - constraint: {
   *   "names": ['name'],
   *   "timeSpan": [t1, t2],
   *   "style": 'Adjust',
   *   "param": {'path': [[x1, y1], [x2, y2], ...]}
   * }
   * - point: [x, y]
   *
   * @return graph
   */
  adjust(names, span, path, ctrs = []) {
    // Update constraints
    if (ctrs.length > 0) {
      this.ctrInfo.addCtrs(ctrs);
    } else if (logNameError("Split", names) && logTimeError("Split", span)) {
      this.ctrInfo.addCtr({
        names: names,
        timeSpan: span,
        style: "Adjust",
        param: { path: path }
      });
    }
    return this._layout();
  }

  /**
   * Relate lines acccording to the semantic connections
   *
   * @param {String[]} names
   * @param {Number[]} span
   * @param {String} style
   * @param {Array} constraints
   *
   * @example
   * - constraint: {
   *   "names": ['name1', 'name2'],
   *   "timeSpan": [t1, t2],
   *   "style": 'Twine' | 'Knot' | 'Collide',
   *   "param": {}
   * }
   *
   * @return graph
   */
  relate(names, span, style, ctrs = []) {
    // Update constraints
    if (ctrs.length > 0) {
      this.ctrInfo.addCtrs(ctrs);
    } else if (
      logNameError("Relate", names, 2) &&
      logTimeError("Relate", span)
    ) {
      this.ctrInfo.addCtr({
        names: names,
        timeSpan: span,
        style: style,
        param: {}
      });
    }
    return this._layout();
  }

  /**
   * Set the style of lines
   *
   * @param {String[]} names
   * @param {Number[]} span
   * @param {String} style
   * @param {Array} constraints
   *
   * @example
   * - constraint: {
   *   "names": ['name'],
   *   "timeSpan": [t1, t2],
   *   "style": 'Color' | 'Width' | 'Dash' | 'Zigzag' | 'Wave' | 'Bump',
   *   "param": {}
   * }
   *
   * @return graph
   */
  stylish(names, span, style, ctrs = []) {
    // Update constraints
    if (ctrs.length > 0) {
      this.ctrInfo.addCtrs(ctrs);
    } else if (
      logNameError("Stylish", names, 2) &&
      logTimeError("Stylish", span)
    ) {
      this.ctrInfo.addCtr({
        names: names,
        timeSpan: span,
        style: style,
        param: {}
      });
    }
    return this._layout();
  }

  /**
   * Reshape the layout of storyline visualization
   *
   * @param {Point[]} upperPath
   * @param {Point[]} lowerPath
   *
   * @example
   * - points: [[x1, y1], [x2, y2], ...]
   *
   * @return graph
   */
  reshape(upperPath = [], lowerPath = []) {
    this.ctrInfo.updateCtr({
      names: [],
      timeSpan: [],
      style: "Reshape",
      param: {
        upperPath: upperPath,
        lowerPath: lowerPath
      }
    });
    return this._layout();
  }

  /**
   * Change the size of storyline visualization
   *
   * @param {Number} x0
   * @param {Number} y0
   * @param {Number} width
   * @param {Number} height
   * @param {Boolean} reserveRatio
   *
   * @return graph
   */
  scale(x0, y0, width, height, reserveRatio) {
    this.ctrInfo.updateCtr({
      names: [],
      timeSpan: [],
      style: "Scale",
      param: {
        x0: x0 || 0,
        y0: y0 || 0,
        width: width || 1000,
        height: height || 372,
        reserveRatio: reserveRatio || false
      }
    });
    return this._layout();
  }
}
