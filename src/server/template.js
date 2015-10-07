export default
`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1">
    <title>Nelper</title>
    <link href="{styles}" rel="stylesheet" type="text/css">
    <link rel="shortcut icon" href="/favicon.ico">
    <link href="https://fonts.googleapis.com/css?family=Lato:400,400italic,300,700" rel="stylesheet" type="text/css">
  </head>
  <body>
    <div id="app" class="main-app">{content}</div>
    <div id="fb-root"></div>
    <script src="{shared}"></script>
    <script src="{main}"></script>
  </body>
</html>`;
