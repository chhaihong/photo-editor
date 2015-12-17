var PropertyBarUI = (function(){
	function PropertyBarUI(){
		var parentElement;

		this.init = function(){
			console.log('property bar init');
			
			var list1 = document.createElement('li');

			var widthLabel = document.createElement('Label');
			widthLabel.innerHTML = 'width';
			var widhtInput = document.createElement('input');
			widhtInput.setAttribute('id', 'prop-width')
			widhtInput.addEventListener('change', handlerWidthChange, false);
			

			list1.appendChild(widthLabel);
			list1.appendChild(widhtInput);

			var list2 = document.createElement('Label');
			var heightLabel = document.createElement('label');
			heightLabel.innerHTML = 'height';
			var heightInput = document.createElement('input');
			heightInput.setAttribute('id', 'prop-height')
			heightInput.addEventListener('change', handlerHeightChange, false);


			list2.appendChild(heightLabel);
			list2.appendChild(heightInput);

			parentElement.appendChild(list1);
			parentElement.appendChild(list2);
		}

		this.setParent = function(pEl){
			parentElement = pEl;
			parentElement.addEventListener('layerSelectInCanvas', handlerLayerSelectInCanvas, false);
			parentElement.addEventListener('layerSelectInList', handlerLayerSelectInCanvas, false);
		}
	}

	function handlerWidthChange(e){
		var value = parseFloat(this.value);
		console.info('value:', value);
		if(value>0){
			var photoshop = Photoshop.getInstance();
			var zIndex = photoshop.getActiveLayerIndex();
			var layer = photoshop.getLayerByZIndex(zIndex);
			var pic = layer.getPicture();
			pic.setWidth(value);

			PhotoshopUI.getInstance().renderLayers();
		}
	}

	function handlerHeightChange(e){
		var value = parseFloat(this.value);
		console.info('value:', value);
		if(value>0){
			var photoshop = Photoshop.getInstance();
			var zIndex = photoshop.getActiveLayerIndex();
			var layer = photoshop.getLayerByZIndex(zIndex);
			var pic = layer.getPicture();
			pic.setHeight(value);

			PhotoshopUI.getInstance().renderLayers();
		}
	}

	function handlerLayerSelectInCanvas(e){
	    var zIndex = parseInt(e.detail);

	    var layers = Photoshop.getInstance().getLayers();
	    var widthBox = document.getElementById('prop-width');
	    var heightBox = document.getElementById('prop-height');

	    var layerIndex;
	    for(var i in layers){
	        if(layers[i].getZIndex()==zIndex){
	            var dimen = layers[i].getPicture().getDimension();
	            widthBox.value = dimen.width;
	            heightBox.value = dimen.height;
	            layerIndex = i;
	            break;
	        }
	    }

	}


	var instance;
	return {
		getInstance: function(){
			if(instance==null){
				instance = new PropertyBarUI();
				instance.constructor = null;
			}

			return instance;
		}
	}
}());