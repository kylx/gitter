
var cy = cytoscape({
  container: document.getElementById('cy'),
  style: [
    {
      selector: 'node',
      style: {
        'background-color': '#11479e',
        'background-color': 'data(color)',
        'label': 'data(short_id)',
        'color': 'data(label_color)',
        'font-size': '24',
        'text-wrap': 'wrap',
        // 'text-rotation': '30deg',
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 4,
        'target-arrow-shape': 'vee',
        'line-color': '#9dbaea',
        'target-arrow-color': '#9dbaea',
        'curve-style': 'bezier',

      }
    }
  ],
});

var layout = null;

function update() {
  if (!layout || true) {
    var options = {
      name: 'dagre',
      // dagre algo options, uses default value on undefined
      nodeSep: 20, // the separation between adjacent nodes in the same rank
      edgeSep: 0, // the separation between adjacent edges in the same rank
      rankSep: 20, // the separation between adjacent nodes in the same rank
      rankDir: 'LR', // 'TB' for top to bottom flow, 'LR' for left to right,
      align: 'DR',
      // acyclicer: 'greedy',
      ranker: 'network-simplex', // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
      minLen: function (edge) { return 1; }, // number of ranks to keep between the source and target of the edge
      edgeWeight: function (edge) { return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges

      // general layout options
      fit: true, // whether to fit to viewport
      padding: 30, // fit padding
      spacingFactor: 1.5, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
      nodeDimensionsIncludeLabels: true, // whether labels should be included in determining the space used by a node
      animate: true, // whether to transition the node positions
      animateFilter: function (node, i) { return true; }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
      animationDuration: 300, // duration of animation in ms if enabled
      animationEasing: 'ease-out', // easing of animation if enabled
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      transform: function (node, pos) { return pos; }, // a function that applies a transform to the final node position
      ready: function () { }, // on layoutready
      stop: function () { } // on layoutstop
    };
    layout = cy.layout(options);
  }

  // layout.stop();
  layout.run();
  // cy.layput(options).run();
  // updateCose();
  // updateView();
}


var makeTippy = function (node, text, place = 'bottom') {
  let pop = node.popperRef();
  return tippy(pop, {
    content: function () {
      var div = document.createElement('div');

      div.innerHTML = text;

      return div;
    },
    trigger: 'manual',
    arrow: true,
    placement: place,
    hideOnClick: false,
    multiple: true,
    sticky: true
  });
};

var makePopTippy = function (pop, text, place = 'bottom') {
  return tippy(pop, {
    content: function () {
      var div = document.createElement('div');

      div.innerHTML = text;

      return div;
    },
    trigger: 'manual',
    arrow: true,
    placement: place,
    hideOnClick: false,
    multiple: true,
    sticky: true
  });
};

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}