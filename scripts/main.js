"use strict";function setAcceptNode(e,t){var a=t.part,o=e.diagram;o.startTransaction("Set Accept");var n=a.adornedPart,r=n.data;r.accept?(o.model.setDataProperty(r,"accept",!1),o.model.setDataProperty(r,"text",r.text.slice(0,-2))):(o.model.setDataProperty(r,"accept",!0),o.model.setDataProperty(r,"text",r.text+" †")),o.commitTransaction("Set Accept")}function setEntryNode(e,t){var a=t.part,o=e.diagram;o.startTransaction("Set Entry");var n=a.adornedPart,r=n.data;r.entry?(o.model.setDataProperty(r,"entry",!1),o.model.setDataProperty(r,"text",r.text.substr(2))):(o.model.setDataProperty(r,"entry",!0),o.model.setDataProperty(r,"text","► "+r.text)),o.commitTransaction("Set Entry")}function addNodeAndLink(e,t){var a=t.part,o=e.diagram;o.startTransaction("Add State");var n=a.adornedPart,r=n.data,i=o.model,l={key:keyManage+1,text:"q"+(keyManage+1),entry:!1,accept:!1};keyManage++;var c=n.location.copy();c.x+=200,l.loc=go.Point.stringify(c);var i=o.model;i.addNodeData(l);var s={from:i.getKeyForNodeData(r),to:i.getKeyForNodeData(l),text:"?"};i.addLinkData(s);var d=o.findNodeForData(l);o.select(d),o.commitTransaction("Add State"),o.scrollToRect(d.actualBounds)}function save(){document.getElementById("mySavedModel").value=myDiagram.model.toJson()}function load(){myDiagram.model=go.Model.fromJson(document.getElementById("mySavedModel").value)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function run(e){var t=Object.values(myDiagram.model.nodeDataArray),a=Object.values(myDiagram.model.linkDataArray),o=[];for(var n in t)if(t.hasOwnProperty(n)){o[n]=new Nodos(t[n].key,t[n].text,t[n].entry,t[n].accept);for(var r in a)if(a.hasOwnProperty(r)&&a[r].from==t[n].key){var i=new Enlaces(a[r].from,a[r].to,a[r].text);o[n].addEnlace(i)}}checkModel(o)&&(output.clear(),e.forEach(function(e){testWord(o,e)}))}function testWord(e,t){var a,o=!1;e.forEach(function(n){n.entry&&(checkNextNode(e,n,t,"",t)?(o=!0,a=t):a=t)}),o?output.addWord(a,!0,""):output.addWord(a,!1,"")}function checkNextNode(e,t,a,o,n){var r=!1,i=a.charAt(0);if(a.length>0&&t.enlaces){t.enlaces.forEach(function(l){l.text==i&&(o+=t.text+"-"+l.text+"->",r?checkNextNode(e,findNodeByKey(e,l.to),a.substr(1),o,n):r=checkNextNode(e,findNodeByKey(e,l.to),a.substr(1),o,n))})}else{if(0!=a.length)return!1;if(t.accept)return o+=t.text,!0}return r}function findNodeByKey(e,t){var a;return e.forEach(function(e){e.key==t&&(a=e)}),a}function checkModel(e){var t=!0,a=!1,o=!1;return e.forEach(function(e){a=!(a||!e.entry)||a,o=!(o||!e.accept)||o,e.enlaces.forEach(function(e){t=!(!e.text||"?"==e.text)&&t})}),!!(a&&t&&o)||(a||output.showError("At least one entry node must be defined, Check the model."),o||output.showError("At least one accepted node must be defined, Check the model."),t||output.showError("Undefined transitions. Check the model."),!1)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var $=go.GraphObject.make,myDiagram=$(go.Diagram,"paper",{initialContentAlignment:go.Spot.Center,"toolManager.mouseWheelBehavior":go.ToolManager.WheelZoom,"undoManager.isEnabled":!0}),model=$(go.GraphLinksModel);model.nodeDataArray=[{key:1,loc:"120 120",text:"► q1",entry:!0}],model.linkDataArray=[],myDiagram.model=model;var keyManage=myDiagram.nodes.count;myDiagram.addDiagramListener("Modified",function(e){var t=document.getElementById("SaveButton");t&&(t.disabled=!myDiagram.isModified);var a=document.title.indexOf("*");myDiagram.isModified?a<0&&(document.title+="*"):a>=0&&(document.title=document.title.substr(0,a))}),myDiagram.nodeTemplate=$(go.Node,"Auto",new go.Binding("location","loc",go.Point.parse).makeTwoWay(go.Point.stringify),$(go.Shape,"circle",{width:60,height:60,parameter1:40,fill:$(go.Brush,"Linear",{0:"rgb(51, 122, 183)",1:"rgb(33, 97, 152)"}),stroke:null,portId:"",fromLinkable:!0,fromLinkableSelfNode:!0,fromLinkableDuplicates:!0,toLinkable:!0,toLinkableSelfNode:!0,toLinkableDuplicates:!0,cursor:"pointer"}),$(go.TextBlock,{font:"bold 10pt helvetica, bold arial, sans-serif",stroke:"white",editable:!1},new go.Binding("text").makeTwoWay())),myDiagram.nodeTemplate.selectionAdornmentTemplate=$(go.Adornment,"Spot",$(go.Panel,"Auto",$(go.Shape,{fill:null,stroke:"gray",strokeWidth:2}),$(go.Placeholder)),$("Button",{alignment:go.Spot.TopRight,click:addNodeAndLink},$(go.Shape,"ACvoltageSource",{width:10,height:10,stroke:"red"})),$("Button",{alignment:go.Spot.LeftCenter,click:setEntryNode},$(go.Shape,"TriangleRight",{width:10,height:10})),$("Button",{alignment:go.Spot.BottomCenter,click:setAcceptNode},$(go.Shape,"PlusLine",{width:10,height:10}))),myDiagram.linkTemplate=$(go.Link,{curve:go.Link.Bezier,adjusting:go.Link.Stretch,reshapable:!0,relinkableFrom:!0,relinkableTo:!0,toShortLength:3},new go.Binding("points").makeTwoWay(),new go.Binding("curviness"),$(go.Shape,{strokeWidth:1.5}),$(go.Shape,{toArrow:"standard",stroke:null}),$(go.Panel,"Auto",$(go.Shape,{fill:$(go.Brush,"Radial",{0:"rgb(240, 240, 240)",.3:"rgb(240, 240, 240)",1:"rgba(240, 240, 240, 0)"}),stroke:null}),$(go.TextBlock,"?",{textAlign:"center",font:"9pt helvetica, arial, sans-serif",margin:4,editable:!0},new go.Binding("text").makeTwoWay()))),load();var _createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),Nodos=function(){function e(t,a,o,n){_classCallCheck(this,e),this.key=t,this.text=a,this.entry=o,this.accept=n,this.enlaces=[]}return _createClass(e,[{key:"addEnlace",value:function(e){this.enlaces.push(e)}}]),e}(),Enlaces=function e(t,a,o){_classCallCheck(this,e),this.from=t,this.to=a,this.text=o},_createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,a,o){return a&&e(t.prototype,a),o&&e(t,o),t}}(),JQ=jQuery;JQ.noConflict(),JQ(document).ready(function(){var e,t=JQ("#inputField"),a=JQ(".count"),o=JQ("#wordsCount");o.css("opacity",0),t.on("input",function(){if(JQ(this).val().length>0){1==JQ(this).val().length&&o.css("opacity",1);e=JQ(this).val().replace(" ","").split(","),a.html(e.length)}else o.css("opacity",0)}),t.keypress(function(a){13==a.which&&(""!=t.val()?run(e):(output.clear(),output.showError("Input field is empty.")))}),JQ("#run").on("click",function(){""!=t.val()?run(e):(output.clear(),output.showError("Input field is empty."))})});var OutputCtrl=function(){function e(){_classCallCheck(this,e),this.outputField=JQ("#output")}return _createClass(e,[{key:"clear",value:function(){this.outputField.html("")}},{key:"addLine",value:function(e){this.outputField.append("<li><span class='text-default'>"+e+"</span></li>")}},{key:"addWord",value:function(e,t,a){t?this.outputField.append("<li title='"+a+"'><span class='text-success'>"+e+" <span class='glyphicon glyphicon-ok' aria-hidden='true'></span></span></li>"):this.outputField.append("<li><span class='text-danger'>"+e+" <span class='glyphicon glyphicon-remove' aria-hidden='true'></span></span></li>")}},{key:"showError",value:function(e){this.outputField.append("<li><span class='text-danger'><strong>ERROR: </strong>"+e+"</span></li>")}}]),e}(),output=new OutputCtrl;