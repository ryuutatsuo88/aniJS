(function( $ ){

  var methods = {
     init : function( options ) {
		
		return this.each(function() {  
			var settings = {
				image: "",
				fps: 50,
				isReady : function () {}
			};
			
			var defaults = {
				image : "",
				xpos : 0,
				ypos : 0,
				index : 0,
				imageWidth: 0,
				imageHeight : 0,
				numFrames : 0,
				state : false
			}
		
      		if ( options ) {
      			$.extend( settings, options );
      		}
			
			var $this = $(this);
			$this.addClass('imgAnimate-identifier');
			
			if (settings.frameWidth === undefined || settings.frameHeight === undefined) {
                settings.frameWidth = parseFloat($this.width());
                settings.frameHeight = parseFloat($this.height());
            } else {
                $this.css({
                    width: settings.frameWidth,
                    height: settings.frameHeight
                });
            }
            
            defaults.image = document.createElement('img');
			defaults.image.onload = function () {
				defaults.imageWidth = parseFloat(this.width);
				defaults.imageHeight = parseFloat(this.height);
				defaults.numFrames = (defaults.imageWidth * defaults.imageHeight) / (settings.frameWidth * settings.frameHeight);
				$this.animationReady();
				$this.trigger('startLoop.anijs');
			};
			defaults.image.src = settings.image;
			$this.css('background', 'url(' + defaults.image.src + ') no-repeat');
			
			
			$this.animationReady = function() {
				settings.isReady($this);
			};
			
			$this.bind("gameLoop.anijs", function () {
				$this.css('background-position', (-defaults.xpos) + "px " + (-defaults.ypos) + "px");
				defaults.xpos += settings.frameWidth;
				defaults.index += 1;
				if (defaults.index >= defaults.numFrames) {
					defaults.xpos = 0;
					defaults.ypos = 0;
					defaults.index = 0;							
				} else if (defaults.xpos + settings.frameWidth > defaults.imageWidth) {
					defaults.xpos = 0;
					defaults.ypos += settings.frameHeight;
				}			
				if (defaults.state) {
					defaults.gLoop = setTimeout(function () {
						$this.trigger('gameLoop.anijs');
					}, 1000 / settings.fps);
				}	
			});
			
			$this.bind("startLoop.anijs", function () {
				defaults.state = true;
				$this.trigger('gameLoop.anijs');
			});
			
			$this.bind("stopLoop.anijs", function () {
				//defaults.index = 0;
				defaults.state = false;
			});
      			
     	});
     },
     enable : function(){
		return this.each(function(){
			$(this).trigger('startLoop.anijs');
		});
	 },
	 disable : function(){
		return this.each(function(){
			$(this).trigger('stopLoop.anijs');
		});
	 },
	 destroy : function(){
		return this.each(function(){
			$(this).trigger('stopLoop.anijs');
			$(this).removeClass('imgAnimate-identifier');
			$(this).css("background-position", "");
		});
	 }
  };   	 	

  $.fn.anijs = function( method ) {
    
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.anijs' );
    }    
  
  };

})( jQuery );