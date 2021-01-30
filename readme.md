## Parcel files inliner
Parcel plugin for an inline any type of files into a html, css and even js files.


## Install

```bash
$ yarn add --dev https://github.com/sanprojects/parcel-plugin-inline-data
```

## How it works
Plugin search urls like `filename.svg#inline` in all html, css, js files and replaces it with base64 data-url.  


## Examples
HTML:
```
<img src="../assets/arrowRight.svg#inline">
```
Result:
```
<img src="data:image/svg+xml;base64,xxxxxxxxx">
```

CSS:
```
background-image: url(../assets/arrowRight.svg#inline);
```
Result:
```
background-image: url(data:image/svg+xml;base64,xxxxxxxxx);
``` 

JS:
```
let img = '../assets/arrowRight.svg#inline';
```
Result:
```
let img = 'data:image/svg+xml;base64,xxxxxxxxx';
```