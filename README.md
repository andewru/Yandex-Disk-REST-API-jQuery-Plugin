# Yandex-Disk-REST-API-jQuery-Plugin АРХИВ

**ПЛАГИН УСТАРЕЛ, НЕ ИСПОЛЬЗОВАТЬ**

Yandex Disk REST API jQuery Plugin выполняет вставку и размещение на web странице объектов аудио, видео, фото или Download ссылки для файлов с Яндекс Диска на основе публичной ссылки на файл.

В файле index.html представлены инструкция и demo примеры. Детальное описание устройства и принципа работы плагина с полным обзором его параметров и возможных вариантов подключения и использования представлено в статье [Yandex Disk REST API jQuery Plugin](https://andew.ru/ru/pages/page/yandex-disk-rest-api-jquery-plugin) и [Применение Yandex Disk REST API jQuery Plugin](https://andew.ru/ru/pages/page/yandex-disk-rest-api-jquery-plugin-usage)



## Подключение плагина к web странице

```
<script type="text/javascript" src="js/jquery.ydisk.min.js"></script>
```

## Базовое применение плагина

Разместите на web странице публичную ссылку(и) в теге &lt;a&gt; на файла с Яндекс Диска и добавьте к этой ссылке атрибут class со значением селектора, по которому вы будет применять плагин к этой ссылке.

```
<a class="ydisk-example-1" href="https://yadi.sk/i/FM8PMtzrpgYcp" target="_blank">Публичная ссылка на файла с Яндекс Диска</a>
```

Разместите нижеследующий js код в вашем кастомном js файле (или в конце страницы перед &lt;/body&gt;), который подключается к web странице после Yandex Disk REST API jQuery Plugin.

```
$(document).ready(function() {
// Применение плагина к ссылке с классом ydisk-example-1
$("a.ydisk-example-1").ydisk();
});
```


## Changing log

### 1.0.2
* Download link functionality was added
* matcher was changed 

### 1.0.1
* matcher was changed


Автор: [Андрей Болдырев](https://andew.ru/ru/pages/page/person-andrew)
