<!DOCTYPE html>
<!DOCTYPE html>
<html>
<head>

<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />

<title></title>

<style>
@font-face {
        font-family: 'PCSenior';
        src: url('assets/fonts/pcsenior.ttf');
}
body { margin: 0px; padding: 0px; background: #000; overflow: hidden; }
canvas { /*cursor: url('assets/img/crosshair01.png'), crosshair;*/ cursor: none; }
div#dragbar { position: absolute; top: 0px; left: 0px; width: 100%; height: 16px; -webkit-app-region: drag; cursor: pointer; }
</style>

<script src="<%= pkg.name %>.min.js"></script>
        
</head>
<body>
        <div id="dragbar"></div>
</body>
</html>
