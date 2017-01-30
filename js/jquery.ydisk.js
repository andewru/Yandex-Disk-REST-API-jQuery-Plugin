/*!
 * Yandex Disk REST API jQuery Plugin for Public Yandex Disk URL
 * version: 1.0.2 (January 2017)
 * requires jQuery v1.6 or later
 *
 * Examples at https://andew.ru/ru/pages/page/yandex-disk-rest-api-jquery-plugin
 * License: Free software.
 * Copyright 2017 Andrey Boldyrev, andew.ru@gmail.com, https://andew.ru
 *
 * Yandex Disk REST API Doc - https://tech.yandex.ru/disk/rest/
 *
 * Changing log:
 * 1.0.2  matcher was changed, Download link functionality was added
 */
;(function (window, document, $, undefined) {
	"use strict";

    var ydiskQueue = $({}),
    ajaxQueue = function( ajaxOpts ) {
        
        var jqXHR,
            dfd = $.Deferred(),
            promise = dfd.promise();
    
         // run the actual query $.ajax()
        function doRequest( next ) {
            jqXHR = $.ajax( ajaxOpts );
            jqXHR.done( dfd.resolve )
                 .fail( dfd.reject )
                 .then( next, next );
        };
    
        //queue our ajax request
        ydiskQueue.queue( doRequest );
        
        return promise;
    };

    // jQuery plugin initialization
    $.fn.ydisk = function(options) {
    
    	options = $.extend( true, {
    	   
                onType        : 'click', //'click' or 'ready', default is click on element
        		url           : 'https://cloud-api.yandex.net:443/v1/disk/public/resources/download?public_key=',
                matcher       : /(^.{0,15}yadi\.sk\/[\w]{1,5}\/[\w-]{1,32}$)/i,
                timeout       : 5000,
                async         : true,  //bool
        		afterReplace  : false, //function witch will be called after ajax success action is done
                loader        : false, //HTML code of loader, which be appendTo selector
                failed        : false, //HTML code of fail icon, which be appendTo selector
                replacer      : {
                    audio : '<audio id="{id}" class="ydisk-audio" controls src="{href}"{size}></audio>',
                    video : '<video id="{id}" class="ydisk-video" controls src="{href}"{size}></video>',
                    image : '<img id="{id}" class="ydisk-image" controls src="{href}"{size}>',
					dload : '<a id="{id}" class="ydisk-dload" download href="{href}">Download {html}</a>'
                    }
                },
                options );
        
        $(this).on('onYdiskStart', function(e) {
        
            var $this = $(this);
            var url = $this.attr('href') || '';
            url = ( url.match(options.matcher) || [] )[1];
    
            if (url) {
				
				var fHtml = $this.html() || '';
                
                if ( options.async !== false ) {
                    options.async = true;
                };
                
                url = options.url + encodeURIComponent(url);
                
                if ( $.type(options.loader) === "string" ) {
                    $this.append( options.loader );
                };
                
                // run the actual $.ajax() by ajaxQueue()
                ajaxQueue({
                    url: url,
                    async: options.async,
                    timeout: options.timeout,
                    success: function(data) {
                        
                        var replacer,
                        mediaType = function( url ) {
                                //for yandex disk ...&media_type=image&...audio,image,text,video
                                // returns a media_type name from Yandex disk download URL or 'error'
                                url = url || '';
                                url = url.match(/media_type\=([^\&]+)/i);
                                if (url) {
                                    return url[1] || 'error';
                                };
                                return 'error';
                  		};
                      
                        var type = mediaType(data.href);
						
						//if there is download="download" attribute in incoming link
						if ($this.attr('download')) {
							//as download
							replacer = options.replacer.dload;
							
						} else {
                        
							if (type === 'audio') {
								replacer = options.replacer.audio;
							} else if (type === 'video') {
								replacer = options.replacer.video;
							} else if (type === 'image') {
								replacer = options.replacer.image;   
							} else if (type === 'compressed') {
								replacer = options.replacer.dload;
							} else {
								//in other cases be as download
								replacer = options.replacer.dload;
							};
						};
						
                        if (replacer) {
    
                            var s = '',
                                w = parseInt($this.data('width')),
                                h = parseInt($this.data('height')),
                                id = $this.attr('id') || 'ydisk-replaced-' + new Date().getTime();
                            
                            if ( $.isNumeric(w) && $.isNumeric(h) ) {
                                s = ' width="' + w + '" height="' + h + '"';
                            };
                            
                            replacer = replacer.replace(/\{id\}/g, id);
                            replacer = replacer.replace(/\{href\}/g, data.href);
                            replacer = replacer.replace(/\{size\}/g, s);
							replacer = replacer.replace(/\{html\}/g, fHtml);
                            $this.replaceWith(replacer);
                            
                            
                            // User's callback afterReplace(id, type) function
                            if ( $.type( options.afterReplace ) === 'function' ) {
                                //Call the user's function
                                try {
                                    options.afterReplace(id, type);
                                } catch (e) {}
                            };
                            
                            //Call the function with the same name as a given new element id
                            if ( typeof window[id] === 'function' ) {
                                
                                try {
                					window[id]( id, type );
                            
                				} catch (e) {}
                            };
							
                        }; // End if replacer
                        
                    }, //End ajax success
                    error : function() {
                        //error(jqXHR, textStatus, errorThrown), jqXHR.status returns the status code as a number
                        if ( $.type(options.loader) === "string" && options.loader.length > 0 ) {
                            $this.html( function(indx, oldHtml) {
                                return oldHtml.substr(0, oldHtml.length - options.loader.length);
                              });
                        };
                        
                        if ( $.type(options.failed) === "string" && options.failed.length > 0 ) {
                            $this.append( options.failed );
                        };
                      
                    } //End ajax error
                                
                });//End ajax()
                
            }; //End if ydisk url
            
        }); // End 'onYdiskStart' event handler
              
        if (options.onType === 'ready') {
            $(this).trigger('onYdiskStart');
        } else {
            //only one attempt
            $(this).one('click', function(e) {
                e.preventDefault(); //<-- important!
                $(this).trigger('onYdiskStart');
            });
        };

        return this; //for chains calling
        
    }; //End $.fn.ydisk plugin -------------------------------------------------




/* ***************PLUGIN APPLYING EXAMPLES (MAY BE CHANGED OR REMOVED)********************** */
	// You can store your plugin applying code here or in your main js file of site.
	// If you are going to keep the plugin applying code here then uncomment and tune it.
	// After that just include only plugin file in your web page.
	// If you going to apply plugin in your site's main js, then delete this template block.

	
/* 	uncomment here

	// Examples of Yandex Disk REST API jQuery Plugin usage
	$(document).ready(function() {
		
		// Example of user's afterReplace callback function to make interactive video contents
		var ydiskPlay = function(id, type) {
				//var id is new element id attribute value, type stores file media tape and can be as audio,image,video
				// to catch here the id and type as audio,image,video for inserted media object
				// try to set handler to controls buttons to play media on start time
				if ( type === 'audio' || type === 'video' ) {
					
					 $('.' + id).click(function(el) {
						
						el.preventDefault(); // <-- important!
						var obj = document.getElementById(id),
							time = parseInt($(this).data('start-time'));

						if ( $.type( obj ) === "object" && $.isNumeric(time) ) {
							obj.currentTime = time;
							obj.play();
						}

					 }); //End media handler
				}
		}// ydiskPlay
		
		// Example of plugin applying on link with .ydisk-onclick class by onclick event on it
		// and calling callback user's function named ydiskPlay()
		$(".ydisk-onclick")
		.attr('target', '_blank')
		.ydisk({
			//onType     : 'ready', //'click' or 'ready', default is click on element
			//async      : false, //bool, default is true
			//HTML code of loader and failed, which be appendTo selector //default is false
			loader       : '&nbsp;<i class="fa fa-spinner fa-spin fa-fw"></i>', //as example
			failed       : '&nbsp;<i title="Loading Error!" class="fa fa-info-circle fa-fw sm-red-font"></i>', //as example
			afterReplace : ydiskPlay
		});
		
		// Example of plugin applying on link with .ydisk-onready class by page ready event
		// and calling callback user's function named ydiskPlay()
		$(".ydisk-onready")
		.attr('target', '_blank')
		.ydisk({
			onType     : 'ready', //'click' or 'ready', default is click on element
			//async      : false, //bool, default is true
			//HTML code of loader and failed, which be appendTo selector //default is false
			loader       : '&nbsp;<i class="fa fa-spinner fa-spin fa-fw"></i>', //as example
			failed       : '&nbsp;<i title="Loading Error!" class="fa fa-info-circle fa-fw sm-red-font"></i>', //as example
			afterReplace : ydiskPlay
		});

	}); //End ydisk ready function

uncomment here */


/* ***************END PLUGIN APPLYING EXAMPLES (MAY BE CHANGED OR REMOVED)********************** */



}(window, document, jQuery)); //End ydisk plugin



// PLUGIN USAGE EXAMPLES *******************************************************

	// Examples of plugin applying with <a> tags.
	// Simple link example: <a class="ydisk-onready" href="https://yadi.sk/i/file-id">myVideo1 Title</a>
	// Extended link example: <a class="ydisk-onready" href="https://yadi.sk/i/file-id" id="myVideo" data-width="300" data-height="200">myVideo Title</a>

	//How to add plugin on your WEB page:
	//add these <script> tags in head section of web page.
	//<script defer type="text/javascript" src="https://yastatic.net/jquery/2.2.0/jquery.min.js"></script>
	//<script defer type="text/javascript" src="/path_to/jquery.ydisk.js"></script>

	// Example of dynamic plugin loading if ydisk-onclick or ydisk-onready selectors are existing on web page
	// Insert this code into your main js file on web page.
	// $(document).ready(function() {
		// if ($(".ydisk-onclick, .ydisk-onready").length > 0) {
				  // var fTag = document.createElement('script');
				  // fTag.async = true;
				  // fTag.type = 'text/javascript';
				  // fTag.src = "/path-to/jquery.ydisk.min.js";
				  // var firstScriptTag = document.getElementsByTagName('script')[0];
				  // firstScriptTag.parentNode.insertBefore(fTag, firstScriptTag);
		// }
	// });

	//Example of global user's callback function on WEB page:
	//This global function can be be anywhere on your WEB page and must has the same name as id value <a> element.
	//If this function is exist, it be called after success replacing
	//Link example in this case: <a class="ydisk-onready" href="https://yadi.sk/i/file-id" id="myVideo" data-width="300" data-height="200">myVideo Title</a>
	//Callback function for this <a> tag will be as:
	//This is example of global user's function with the same name as id="myVideo" attribute on link
	//function myVideo(id, type) {
		// to catch here the inserted media object by its id
		//your code
		//alert("It was run! id is " + id + ", type is " + type + "." ); //example action
	//} //End your global callback function

//END PLUGIN USAGE EXAMPLES*****************************************************
