<!DOCTYPE html>
<!DOCTYPE html>
<html>
<head>

<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />

<title>VIRTUAL/BIRD</title>

<style>
@font-face {
        font-family: 'PCSenior';
        src: url('assets/fonts/pcsenior.ttf');
}
body { margin: 0px; padding: 0px; background: #000; overflow: hidden; }
canvas { cursor: none; }
div#contain { display: none; width: 640px; height: 480px; position: absolute; top: 50%; left: 50%; margin: -240px 0px 0px -320px; z-index: 1000; }
a.link { display: block; position: absolute; height: 40px; left: 175px;  }
a.link:hover { border-bottom: 2px solid #FFF; }
a#mantiseyelabs { top: 175px; width: 350px; }
a#roccow { top: 330px; width: 420px; }
</style>

<script src="<%= pkg.name %>.min.js"></script>
        
</head>
<body>
        <div id="contain">
                <a href="http://mantiseyelabs.com/" class="link" id="mantiseyelabs" target="_blank"></a>
                <a href="http://soundcloud.com/roccow" class="link" id="roccow" target="_blank"></a>
        </div>
</body>
</html>
