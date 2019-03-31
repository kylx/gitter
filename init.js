
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
        'line-color': '#BDC3C7',
        'target-arrow-color': '#BDC3C7',
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
      animationDuration: 800, // duration of animation in ms if enabled
      animationEasing: 'ease-out-circ', // easing of animation if enabled
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

function tippy_commit(node) {
  let a = cy.getElementById(node.id);

  let tippyA = makeTippy(a, a.id().substring(0, 5));

  tippyA.show();
}

var flat_colors = [
  '#1ABC9C',
  // '#16A085',
  '#2ECC71',
  // '#27AE60',
  '#3498DB',
  // '#2980B9',
  '#9B59B6',
  // '#8E44AD',
  // '#34495E',
  // '#2C3E50',
  '#F1C40F',
  // '#F39C12',
  '#E67E22',
  // '#D35400',
  '#E74C3C',
  // '#C0392B',
  // '#ECF0F1',
  // '#BDC3C7',
  // '#95A5A6',
  // '#7F8C8D',

];
function shuffle(arra1) {
  var ctr = arra1.length, temp, index;

// While there are elements in the array
  while (ctr > 0) {
// Pick a random index
      index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
      ctr--;
// And swap the last element with it
      temp = arra1[ctr];
      arra1[ctr] = arra1[index];
      arra1[index] = temp;
  }
  return arra1;
}

shuffle(flat_colors);
var flat_index = 0;

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  let col = flat_colors[flat_index];
  flat_index++;
  if (flat_index == flat_colors.length) flat_index = 0;
  return col;
}