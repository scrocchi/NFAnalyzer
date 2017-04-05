
var $ = go.GraphObject.make;  // for conciseness in defining templates

var myDiagram =
    $(go.Diagram, 'paper',  // must name or refer to the DIV HTML element
      {
        // start everything in the middle of the viewport
        initialContentAlignment: go.Spot.Center,
        // have mouse wheel events zoom in and out instead of scroll up and down
        'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom,
        // support double-click in background creating a new node
        //"clickCreatingTool.archetypeNodeData": { text: "new node" },
        // enable undo & redo
        'undoManager.isEnabled': true
    });

var model = $(go.GraphLinksModel);
model.nodeDataArray =
    [
{'key':1, 'loc':'120 120', 'text':'► q1', 'entry':true}
]
model.linkDataArray =
    [];
myDiagram.model = model;
var keyManage = myDiagram.nodes.count;
// when the document is modified, add a "*" to the title and enable the "Save" button
myDiagram.addDiagramListener('Modified', function(e) {
    var button = document.getElementById('SaveButton');
    if (button) button.disabled = !myDiagram.isModified;
    var idx = document.title.indexOf('*');
    if (myDiagram.isModified) {
        if (idx < 0) document.title += '*';
    } else {
        if (idx >= 0) document.title = document.title.substr(0, idx);
    }
});

// define the Node template
myDiagram.nodeTemplate =
    $(go.Node, 'Auto',
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      // define the node's outer shape, which will surround the TextBlock
      $(go.Shape, 'circle',
        {
    width: 60,
    height: 60,
    parameter1: 40,  // the corner has a large radius
    fill: $(go.Brush, 'Linear', { 0: 'rgb(51, 122, 183)', 1: 'rgb(33, 97, 152)' }),
    stroke: null,
    portId: '',  // this Shape is the Node's port, not the whole Node
    fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
    toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
    cursor: 'pointer'
}),
      $(go.TextBlock,
        {
    font: 'bold 10pt helvetica, bold arial, sans-serif',
    stroke: 'white',
    editable: false  // editing the text automatically updates the model data
},
        new go.Binding('text').makeTwoWay())
     );

// unlike the normal selection Adornment, this one includes a Button
myDiagram.nodeTemplate.selectionAdornmentTemplate =
    $(go.Adornment, 'Spot',
      $(go.Panel, 'Auto',
        $(go.Shape, { fill: null, stroke: 'gray', strokeWidth: 2 }),
        $(go.Placeholder)  // a Placeholder sizes itself to the selected Node
       ),
      // the button to create a "next" node, at the top-right corner
      $('Button',
        {
    alignment: go.Spot.TopRight,
    click: addNodeAndLink  // this function is defined below
},
        $(go.Shape, 'ACvoltageSource', { width: 10, height: 10 , stroke: 'red'})
       ),
      //Button to define an entry Node
      $('Button',
        {
    alignment: go.Spot.LeftCenter,
    click: setEntryNode  // this function is defined below
},
        $(go.Shape, 'TriangleRight', { width: 10, height: 10 })
       ), // end button
      //Button to define a success Node
      $('Button',
        {
    alignment: go.Spot.BottomCenter,
    click: setAcceptNode  // this function is defined below
},
        $(go.Shape, 'PlusLine', { width: 10, height: 10 })
       ) // end button
     ); // end Adornment


// clicking the button sets the actual node as accepted
function setAcceptNode(e, obj) {
    var adornment = obj.part;
    var diagram = e.diagram;
    diagram.startTransaction('Set Accept');

    // get the node data for which the user clicked the button
    var Node = adornment.adornedPart;
    var Data = Node.data;
    if(!Data.accept){
        diagram.model.setDataProperty(Data, 'accept', true);
        diagram.model.setDataProperty(Data, 'text', Data.text+' †');
    }
    else{
        diagram.model.setDataProperty(Data, 'accept', false);
        diagram.model.setDataProperty(Data, 'text', Data.text.slice(0,-2) );
    }
    console.log(Data);
    diagram.commitTransaction('Set Accept');
}

function setEntryNode(e, obj) {
    var adornment = obj.part;
    var diagram = e.diagram;
    diagram.startTransaction('Set Entry');

    // get the node data for which the user clicked the button
    var Node = adornment.adornedPart;
    var Data = Node.data;
    if(!Data.entry){
        diagram.model.setDataProperty(Data, 'entry', true);
        diagram.model.setDataProperty(Data, 'text', '► '+Data.text);
    }
    else{
        diagram.model.setDataProperty(Data, 'entry', false);
        diagram.model.setDataProperty(Data, 'text', Data.text.substr(2) );
    }
    console.log(Data);
    diagram.commitTransaction('Set Entry');
}



// clicking the button inserts a new node to the right of the selected node,
// and adds a link to that new node
function addNodeAndLink(e, obj) {
    var adornment = obj.part;
    var diagram = e.diagram;
    diagram.startTransaction('Add State');

    // get the node data for which the user clicked the button
    var fromNode = adornment.adornedPart;
    var fromData = fromNode.data;
    var model = diagram.model;

    // create a new "State" data object, positioned off to the right of the adorned Node
    var toData = {
        key: (keyManage+1),
        text: 'q' + (keyManage+1),
        entry: false,
        accept: false
    };
    keyManage++;
    var p = fromNode.location.copy();
    p.x += 200;
    toData.loc = go.Point.stringify(p);  // the "loc" property is a string, not a Point object
    // add the new node data to the model
    var model = diagram.model;
    model.addNodeData(toData);

    // create a link data from the old node data to the new node data
    var linkdata = {
        from: model.getKeyForNodeData(fromData),  // or just: fromData.id
        to: model.getKeyForNodeData(toData),
        text: '?'
    };
    // and add the link data to the model
    model.addLinkData(linkdata);

    // select the new Node
    var newnode = diagram.findNodeForData(toData);
    diagram.select(newnode);

    diagram.commitTransaction('Add State');

    // if the new node is off-screen, scroll the diagram to show the new node
    diagram.scrollToRect(newnode.actualBounds);
}

// replace the default Link template in the linkTemplateMap
myDiagram.linkTemplate =
    $(go.Link,  // the whole link panel
      {
    curve: go.Link.Bezier, adjusting: go.Link.Stretch,
    reshapable: true, relinkableFrom: true, relinkableTo: true,
    toShortLength: 3
},
      new go.Binding('points').makeTwoWay(),
      new go.Binding('curviness'),
      $(go.Shape,  // the link shape
        { strokeWidth: 1.5 }),
      $(go.Shape,  // the arrowhead
        { toArrow: 'standard', stroke: null }),
      $(go.Panel, 'Auto',
        $(go.Shape,  // the label background, which becomes transparent around the edges
          {
    fill: $(go.Brush, 'Radial',
            { 0: 'rgb(240, 240, 240)', 0.3: 'rgb(240, 240, 240)', 1: 'rgba(240, 240, 240, 0)' }),
    stroke: null
}),
        $(go.TextBlock, '?',  // the label text
          {
    textAlign: 'center',
    font: '9pt helvetica, arial, sans-serif',
    margin: 4,
    editable: true  // enable in-place editing
},
          // editing the text automatically updates the model data
          new go.Binding('text').makeTwoWay())
       )
     );

// read in the JSON data from the "mySavedModel" element
load();

// Show the diagram's model in JSON format
function save() {
    document.getElementById('mySavedModel').value = myDiagram.model.toJson();
}
function load() {
    myDiagram.model = go.Model.fromJson(document.getElementById('mySavedModel').value);
    //keyManage = myDiagram.nodes.count;
}