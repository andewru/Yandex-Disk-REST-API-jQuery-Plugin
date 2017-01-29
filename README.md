# Yandex-Disk-REST-API-jQuery-Plugin

Yandex Disk REST API jQuery Plugin выполняет вставку и размещение на вашей web странице файлов аудио, видео, фото с Яндекс Диска на основе публичной ссылки на этот файл.

Детальное описание устройства и принципа работы плагина с полным обзором его параметров и возможных вариантов подключения и использования представлено в статье [Yandex Disk REST API jQuery Plugin](https://andew.ru/ru/pages/page/yandex-disk-rest-api-jquery-plugin).

## Подключение плагина к web странице

```
<script type="text/javascript" src="js/jquery.ydisk.js"></script>
```

## Базовое применение плагина

Разместите на вашей web странице публичную ссылку(и) в теге <a> на файла с Яндекс Диска и добавьте к этой ссылке атрибут class со значением селектора, по которому вы будет применять плагин к этой ссылке.

```
<a class="ydisk-example-1" href="https://yadi.sk/i/FM8PMtzrpgYcp" target="_blank">Публичная ссылка на файла с Яндекс Диска</a>
```

Разместите нижеследующий js код в вашем кастомном js файле (или в конце страницы перед </body>), который подключается к web странице после Yandex Disk REST API jQuery Plugin.

```
$(document).ready(function() {
// Применение плагина к ссылке с классом ydisk-example-1
$("a.ydisk-example-1").ydisk();
});
```

Автор: [Андрей Болдырев](https://andew.ru/ru/pages/page/person-andrew)

## Changing log
 * 1.0.1  matcher was changed