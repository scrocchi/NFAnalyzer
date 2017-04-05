var JQ=jQuery;
JQ.noConflict();

JQ(document).ready(function(){
    JQ('#mySavedModel').html('');
    //inputField processing
    var inputField = JQ('#inputField');
    var numberField = JQ('.count');
    var wordsCountField = JQ('#wordsCount');
    var words;
    wordsCountField.css('opacity',0);
    inputField.on('input', function(){
        if ( JQ(this).val().length > 0 ){
            if ( JQ(this).val().length == 1 ){
                wordsCountField.css('opacity',1);
            }
            var value = JQ(this).val().replace(' ', '');
            words = value.split(',');
            numberField.html(words.length);
        }else
            wordsCountField.css('opacity',0);
    })

    inputField.keypress(function(e) {
        if(e.which == 13) {
            if( inputField.val() != '' ){
                run(words);
            }
            else{
                output.clear();
                output.showError('Input field is empty.');
            }
        }
    });

    JQ('#run').on('click', function(){
        if( inputField.val() != '' ){
            run(words);
            //output.addLine();
        }
        else{
            output.clear();
            output.showError('Input field is empty.');
        }
    });

});

class OutputCtrl {
    
    constructor(){
        this.outputField = JQ('#output');
    }

    clear(){
        this.outputField.html('');
    }

    addLine(text){
        this.outputField.append('<li><span class=\'text-default\'>' + text + '</span></li>');
    }

    addWord(word, status, path){
        if(status)
            this.outputField.append('<li title=\'' + path + '\'><span class=\'text-success\'>' + word + ' <span class=\'glyphicon glyphicon-ok\' aria-hidden=\'true\'></span></span></li>');
        else
            this.outputField.append('<li><span class=\'text-danger\'>' + word + ' <span class=\'glyphicon glyphicon-remove\' aria-hidden=\'true\'></span></span></li>');
    }

    showError(text){
        this.outputField.append('<li><span class=\'text-danger\'><strong>ERROR: </strong>' + text + '</span></li>');
    }
}

const output = new OutputCtrl();

