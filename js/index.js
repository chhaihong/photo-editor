console.log('start');

var pUI = PhotoEditorUI.getInstance();
pUI.init();

var inputFileElmnt = document.getElementById('choose-file');
var getButton = document.getElementById('get-button');



// function setup(){
//     var  width = parseFloat(document.getElementById('width').value);
//     var  height = parseFloat(document.getElementById('height').value);

//     console.log('width:', width, ' height:', height);
//     PhotoEditorUI.getInstance().getCanvas().setDimension(width, height);
//     PhotoEditorUI.getInstance().renderLayers();
// }

/* 
    listener for file input button
*/
inputFileElmnt.onchange = function(event){
    var file = event.target.files[0];
    var fileReader = new FileReader();
    
    fileReader.onload = function(event1){
        loadImage(event1.target.result);
    }
    fileReader.readAsDataURL(file);
}


/*
    listener for url input
*/
getButton.onclick = function(){
    var url = document.getElementById('url');
    
    if(url.value){
        loadImage('image.php?url=' + url.value);
        // var img = new Image();
        // // img.setAttribute('crossOrigin', 'anonymous');
        // img.src = url.value;




        // img.onload = function(){
        //     console.info('hello lajsdlfa');
        //     // var cnvs = document.createElement('canvas');
        //     var cnvs = document.getElementById('testground');
        //     var ctx = cnvs.getContext('2d');
        //     cnvs.width = img.width;
        //     cnvs.height = img.height;
        //     ctx.drawImage(img, 0, 0);

        //     var newImage = new Image();
        //     newImage.src = cnvs.toDataURL('image/png');

        //     newImage.onload = function(){
        //         loadImage(newImage.src);
        //     }


        // }
        
    }else{
        console.log('blank');
    }
}


/*
    * loads image to the canvas
    * @param {String} src
*/
function loadImage(src){
    var img = new Image();
    img.src = src;

    var picture = new Picture();
    picture.setImage(img);

    var layer = new Layer();
    layer.setPicture(picture);
 
    var main = PhotoEditor.getInstance();
    main.addLayer(layer);
   
    picture.getImage().onload = function(){
        picture.setDimension(picture.getImage().width, picture.getImage().height);
        pUI.renderLayers();
    }
}



/*
    fits the canvas size accroding to the image content
*/
function fitToImage(){
    var layers = PhotoEditor.getInstance().getLayers();
    var minX, minY, maxX, maxY;

    if(layers.length==0){
        return null;
    }

    for(var i in layers){
        var layer = layers[i];

        var pos = layer.getPicture().getPosition();
        var dimen = layer.getPicture().getDimension();

        if(i==0){
            minX = pos.posX;
            minY = pos.posY;
            maxX = pos.posX + dimen.width;
            maxY = pos.posY + dimen.height;
        }else{
            if(minX > pos.posX){
                minX = pos.posX;
            }

            if(minY > pos.posY){
                minY = pos.posY;
            }

            if(maxX < (pos.posX + dimen.width)){
                maxX = pos.posX + dimen.width;
            }

            if(maxY < (pos.posY + dimen.height)){
                maxY = pos.posY + dimen.height;
            }
        }


    }

    var canvas = PhotoEditorUI.getInstance().getCanvas().setDimension(maxX-minX, maxY-minY);
    // document.getElementById('width').value = maxX-minX;
    // document.getElementById('height').value = maxY-minY;


    for(var i in layers){
        var layer = layers[i];
        var pos = layer.getPicture().getPosition();

        layer.getPicture().setPosition(pos.posX-minX, pos.posY-minY);

    }

    PhotoEditorUI.getInstance().renderLayers();
}


/*
    listener for download
*/
var download = document.getElementById('download');
download.addEventListener('click', function(ev1){
    var layers = PhotoEditor.getInstance().getLayers();
    if(layers.length>0){
        var canvas = PhotoEditorUI.getInstance().getCanvas();
        canvas.getContext().clearRect(0,0,canvas.width, canvas.height);
        PhotoEditorUI.getInstance().renderLayers();

        downloadCanvas(this,'playground','test.png');    
        console.info('downloaded');
    }
    
}, false);


function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}