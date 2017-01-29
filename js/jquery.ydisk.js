/*!
 * Yandex Disk REST API jQuery Plugin for Public Yandex Disk URL
 * version: 1.0.1 (April 2016)
 * requires jQuery v1.6 or later
 *
 * Examples at https://andew.ru/ru/pages/page/yandex-disk-rest-api-jquery-plugin
 * License: Free software.
 * Copyright 2016 Andrey Boldyrev, andew.ru@gmail.com, Site andew.ru
 *
 * Yandex Disk REST API Doc - https://tech.yandex.ru/disk/rest/
 *
 * Changing log
 * 1.0.1  matcher was changed
 */
;(function(window, document, $) {

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
                matcher       : /(^.{0,15}yadi\.sk\/[\w]{1}\/[\w-]{13}$)/i, //  /(^.{0,15}yadi\.sk\/i\/[\w-]{13}$)/i  --was first
                timeout       : 5000,
                async         : true,  //bool
        		afterReplace  : false, //function witch will be called after ajax success action is done
                loader        : '&nbsp;<i class="fa fa-spinner fa-spin fa-fw"></i>', //HTML code of loader, which be appendTo selector
                failed        : '&nbsp;<i title="Loading Error!" class="fa fa-info-circle fa-fw sm-red-font"></i>', //HTML code of fail icon, which be appendTo selector
                replacer      : {
                    audio : '<audio id="{id}" class="ydisk-audio pure-img" controls src="{href}"{size}></audio>',
                    video : '<video id="{id}" class="ydisk-video pure-img" controls src="{href}"{size}></video>',
                    image : '<img id="{id}" class="ydisk-image pure-img" controls src="{href}"{size}>'
                    }
                },
                options );
        
        $(this).on('onYdiskStart', function(e) {
        
            var $this = $(this);
            var url = $this.attr('href') || '';
            url = ( url.match(options.matcher) || [] )[1];
    
            if (url) {
                
                if ( options.async !== false ) {
                    options.async = true;
                }
                
                url = options.url + encodeURIComponent(url);
                
                if ( $.type(options.loader) === "string" ) {
                    $this.append( options.loader );
                }
                
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
                        
                        if (type === 'audio') {
                            replacer = options.replacer.audio;
                        } else if (type === 'video') {
                            replacer = options.replacer.video;
                        } else if (type === 'image') {
                            replacer = options.replacer.image;   
                        }
                        // TODO: add more types as text, error etc.
                        
                        if (replacer) {
    
                            var s = '',
                                w = parseInt($this.data('width')),
                                h = parseInt($this.data('height')),
                                id = $this.attr('id') || 'ydisk-replaced-' + new Date().getTime();
                            
                            if ( $.isNumeric(w) && $.isNumeric(h) ) {
                                s = ' width="' + w + '" height="' + h + '"';
                            }
                            
                            replacer = replacer.replace(/\{id\}/g, id);
                            replacer = replacer.replace(/\{href\}/g, data.href);
                            replacer = replacer.replace(/\{size\}/g, s);
                            $this.replaceWith(replacer);
                            
                            
                            // User's callback afterReplace(id, type) function
                            if ( $.type( options.afterReplace ) === 'function' ) {
                                //Call the user's function
                                try {
                                    options.afterReplace(id, type);
                                } catch (e) {}
                            }
                            
                            //Call the function with the same name as a given new element id
                            if ( typeof window[id] === 'function' ) {
                                
                                try {
                					window[id]( id, type );
                            
                				} catch (e) {}
                            }
                        }
                        
                    }, //End ajax success
                    error : function() {
                        //error(jqXHR, textStatus, errorThrown), jqXHR.status returns the status code as a number
                        if ( $.type(options.loader) === "string" && options.loader.length > 0 ) {
                            $this.html( function(indx, oldHtml) {
                                return oldHtml.substr(0, oldHtml.length - options.loader.length);
                              });
                        }
                        
                        if ( $.type(options.failed) === "string" && options.failed.length > 0 ) {
                            $this.append( options.failed );
                        }
                      
                    } //End ajax error
                                
                });//End ajax()
                
            } //End if ydisk url
            
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
        
    }; //End $.fn.ydisk plugin

})(window, document, jQuery); //End ydisk plugin
