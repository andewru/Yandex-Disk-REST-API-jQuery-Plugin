/**
 * Demo js code for Yandex Disk REST API jQuery Plugin
 * More Examples at http: https://andew.ru/ru/pages/page/yandex-disk-rest-api-jquery-plugin
 * Copyright 2016 Andrey Boldyrev, andew.ru@gmail.com, Andew.ru
 */
"use strict";

// This is example of global user's function with the same name as id="myVideo" attribute on link
function myVideo(id, type) {
	// to catch here the inserted media object by its id
	alert("It works! Media element " + type + " with id='" + id + "' inserted.");
};

// Examples of Yandex Disk REST API jQuery Plugin usage
;(function (window, document, $, undefined) {

	$(document).ready(function() {

		// simple usage with default params (onclick)
		$("a.ydisk-example-1").ydisk();

		// simple usage with On ready params
		$("a.ydisk-onready-example")
		.ydisk({
			onType:'ready',
		});

		//Example of user's callback function to make interactive video contents
        var ydiskPlay = function(id, type) {
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

                     }); // End media handler
                }
        }// ydiskPlay

		// Examples of plugin applying with <a> tags.
		// Simple link example: <a class="ydisk-onready" href="https://yadi.sk/i/file-id">myVideo1 Title</a>
		// Extended link example: <a class="ydisk-onready" href="https://yadi.sk/i/file-id" id="myVideo" data-width="300" data-height="200">myVideo Title</a>

		//How to add plugin on your WEB page:
		//add these <script> tags in head section of web page.
		//<script defer type="text/javascript" src="https://yastatic.net/jquery/2.2.0/jquery.min.js"></script>
		//<script defer type="text/javascript" src="/path_to/jquery.ydisk.js"></script>
        
		// Example of plugin applying on link with .ydisk-onclick class by onclick event on it
        // and calling callback user's function named ydiskPlay()
        $(".ydisk-onclick")
        .attr('target', '_blank')
        .ydisk({
            //onType     : 'ready', // 'click' or 'ready', default is click on element
            //async      : false, // bool, default is true
            //HTML code of loader and failed, which be appendTo selector //default is false
            loader       : '&nbsp;<i class="fa fa-spinner fa-spin fa-fw"></i>',
            failed       : '&nbsp;<i title="Loading Error!" class="fa fa-info-circle fa-fw sm-red-font"></i>',
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
            loader       : '&nbsp;<i class="fa fa-spinner fa-spin fa-fw"></i>',
            failed       : '&nbsp;<i title="Loading Error!" class="fa fa-info-circle fa-fw sm-red-font"></i>',
            afterReplace : ydiskPlay
        });        

    }); //End ready function

}(window, document, jQuery));