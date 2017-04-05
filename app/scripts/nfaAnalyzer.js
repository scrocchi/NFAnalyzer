/*
{ "class": "go.GraphLinksModel",
  "nodeDataArray": [ 
{"key":1, "loc":"120 120", "text":"► q1", "entry":true},
{"key":2, "text":"q2", "loc":"320 120"},
{"key":3, "text":"q3", "loc":"520 120"},
{"key":4, "text":"q4 †", "loc":"720 120", "accept":true}
 ],
  "linkDataArray": [ 
{"from":1, "to":2, "text":"a", "points":[186.80673974317554,137.8796332539333,231.317032351793,127.8258056836922,275.7128263677349,128.26857247360843,320.0137483895028,139.20812936308909]},
{"from":2, "to":3, "text":"b", "points":[371.8080652858426,139.90670590000818,421.16591658170677,129.1916264450567,470.5591623885011,128.97370723521416,520.0096385901338,139.2528519322366]},
{"from":3, "to":4, "text":"a", "points":[581.8085184152632,138.98639803445255,627.8316435337509,129.18770273075057,673.8904302462113,128.96585311830552,720.0104649067897,138.98639803445255]}
 ]}
 */

class Nodos {
    constructor(key, text, entry, accept){
        this.key = key;
        this.text = text;
        this.entry = entry;
        this.accept = accept;
        this.enlaces = [];
    }
    addEnlace(enlace){
        this.enlaces.push(enlace);
    }
}

class Enlaces {
    constructor(from, to, text){
        this.from = from;
        this.to = to;
        this.text = text;
    }
}



function run(words){

    //var entrada = word;
    var modelNodes = Object.values(myDiagram.model.nodeDataArray);
    var modelLinks = Object.values(myDiagram.model.linkDataArray);

    //start creating nodes/links object
    var nodos = [];
    //console.log(nodos.enlacesx());
    //console.log(modelNodes.length);
    //console.log(modelNodes);

    for (var key in modelNodes) {
        if ( modelNodes.hasOwnProperty(key) ) {

            //Iterate with nodes object
            nodos[key] = new Nodos(
                modelNodes[key].key,
                modelNodes[key].text,
                modelNodes[key].entry,
                modelNodes[key].accept
            );

            //Iterate with links object
            for (var from in modelLinks) {
                if ( modelLinks.hasOwnProperty(from) ) {
                    if( modelLinks[from].from == modelNodes[key].key ){
                        var enlace = new Enlaces(
                            modelLinks[from].from,
                            modelLinks[from].to,
                            modelLinks[from].text
                        );
                        nodos[key].addEnlace(enlace);
                        //console.log(modelLinks[from].from + '->' +modelLinks[from].to );
                    }
                }
            }
            //console.log(nodos[0].enlaces[1].from + '->' + nodos[0].enlaces[1].to);
        }
    }
    //end creating nodes/links object

    //console.log('check: ' + checkModel(nodos));
    if (checkModel( nodos )){
        output.clear();
        words.forEach( word => {
            testWord( nodos, word );
        });
    }
}

function testWord( nodes, word ){
    //find entry nodes in the model and test the word on each one
    var path = "";
    var isAccepted = false;
    var tempWord;
    nodes.forEach( node => {
        if( node.entry ){
            if( !checkNextNode( nodes, node, word , path, word) ){
                console.log(tempWord);
                tempWord = word;
            }
            else{
                isAccepted = true;
                tempWord = word;
            }
        }
    });
    if(!isAccepted)
        output.addWord(tempWord,false,path);
    else
        output.addWord(tempWord,true,path);
}

//recursive function, test the word all over the model.
function checkNextNode( nodes, actualNode, truncatedWord, path, word ){

    var accepted = false;
    //console.log(word.length+' '+node.enlaces.length);
    //console.log('>>>'+nodes);
    //console.log('T: '+ actualNode.text + ' ' + truncatedWord.length + ' ' + truncatedWord);
    //console.log(actualNode);
    var letter = truncatedWord.charAt(0);
    if( truncatedWord.length > 0 && actualNode.enlaces ){
        var nodeLinks = actualNode.enlaces;
        nodeLinks.forEach( link => {
            if( link.text == letter ){
                path += actualNode.text + "-" + link.text + "->";
                if( accepted ){
                    checkNextNode( nodes, findNodeByKey( nodes, link.to ), truncatedWord.substr(1) , path, word);
                }
                else
                {
                    accepted = checkNextNode( nodes, findNodeByKey( nodes, link.to ), truncatedWord.substr(1) , path, word);
                }
            }
        });
    }else 
        if( truncatedWord.length == 0 ){
            if( actualNode.accept ){
                path += actualNode.text;
                //output.addWord(word,true,path);
                return true;
            }
        }else{
            return false;
        }
    return accepted;
}

function findNodeByKey( nodes, key ){
    //console.log(nodes);
    var found;
    nodes.forEach( node => {
        if ( node.key == key ){
            found = node;
        }
    });
    return found;
}

//check if model have >=1 entries/accepted states and every transitions is defined 
function checkModel( nodes ){
    var transitionStatus = true;
    var entryStatus = false;
    var acceptStatus = false;

    nodes.forEach( nodo => {
        //Validates model entries/accepted status, must have at least one.
        entryStatus = ( !entryStatus && nodo.entry ) ? true : entryStatus;
        acceptStatus = ( !acceptStatus && nodo.accept ) ? true : acceptStatus;
        nodo.enlaces.forEach( enlace => {
            transitionStatus = ( enlace.text && enlace.text != '?' ) ? transitionStatus : false;
            //console.log(nodo.text + ' : ' + enlace.to);
        });
    });
    //console.log('entries: ' + entryStatus + ', acceptation: ' + acceptStatus + ', transitions:' + transitionStatus);
    if( entryStatus && transitionStatus && acceptStatus )
        return true; 
    else{
        if(!entryStatus)
            output.showError('At least one entry node must be defined, Check the model.');
        if(!acceptStatus)
            output.showError('At least one accepted node must be defined, Check the model.');
        if(!transitionStatus)
            output.showError('Undefined transitions. Check the model.');
        return false;
    }
}



