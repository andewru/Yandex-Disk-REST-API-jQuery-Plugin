/**
 * Demo js code for Yandex Disk REST API jQuery Plugin
 * More Examples at http: https://andew.ru/ru/pages/page/yandex-disk-rest-api-jquery-plugin
 * Copyright 2016 Andrey Boldyrev - andew.ru@gmail.com
 */
"use strict";

// Глобальная пользовательская функция по имени id="myVideo" ссылки
function myVideo(id, type) {
	//здесь можно манипулировать вставленным элементом: $('.' + id).foo()...
	alert("Замена успешна! Вызвана пользовательская функция 'myVideo()' для вставленного элемента " + type + " с id='" + id + "'.");
};

// Примеры использования плагина
;(function (window, document, $, undefined) {

	$(document).ready(function() {

		//example-1 simple usage with default params
		// default is click on element
		$("a.ydisk-example-1").ydisk(); // Применение плагина к ссылке с классом ydisk-example-1

		// Применение плагина к ссылке с классом ydisk-onready-example
		// Пример On ready применения
		$("a.ydisk-onready-example")
		.ydisk({
			onType:'ready', //default is click on element
		});

		//callback функция реализации оглавления
        var ydiskPlay = function(id, type) {
                //в эту функцию передаются id заданное новому вставляемому элементу и контент тайп audio,image,video
                //try to set handler to controls buttons to play media on start time
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
        
		//применение плагина по клику на ссылках с классом ydisk-onclick
        //с вызовом callback функции ydiskPlay()
        $(".ydisk-onclick")
        .attr('target', '_blank')
        .ydisk({
            //onType     : 'ready', //'click' or 'ready', default is click on element
            //async      : false, //bool, default is true
            //HTML code of loader and failed, wich be appendTo selector //default is false
            loader       : '&nbsp;<i class="fa fa-spinner fa-spin fa-fw"></i>',
            failed       : '&nbsp;<i title="Loading Error!" class="fa fa-info-circle fa-fw sm-red-font"></i>',
            afterReplace : ydiskPlay
        });
        
        //применение плагина по окончанию загрузки страницы на ссылках с классом ydisk-onready
        //с вызовом callback функции ydiskPlay()
        $(".ydisk-onready")
        .attr('target', '_blank')
        .ydisk({
            onType     : 'ready', //'click' or 'ready', default is click on element
            //async      : false, //bool, default is true
            //HTML code of loader and failed, wich be appendTo selector //default is false
            loader       : '&nbsp;<i class="fa fa-spinner fa-spin fa-fw"></i>',
            failed       : '&nbsp;<i title="Loading Error!" class="fa fa-info-circle fa-fw sm-red-font"></i>',
            afterReplace : ydiskPlay
        });        

    }); //End ready function

}(window, document, jQuery));