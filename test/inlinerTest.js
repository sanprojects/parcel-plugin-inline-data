'use strict';
var fs = require('fs')
const { expect } = require('chai');
const { replaceData, replace, normalizePath } = require('../inliner');

before(function () {
    process.chdir(require('path').resolve(__dirname, '.'));
});



it('normalizePath', async () => {
    const path = normalizePath(`/assets/arrowDown.svg`, ['/test']);
    expect(path).to.eql(`assets/arrowDown.svg`);
});

it('replaceData html', async () => {
    const html = await replaceData(`<img src="assets/arrowDown.svg#inline">`);
    expect(html).to.eql(`<img src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBkPSJNNDQ4IDQ0OFYxOTJIMTkydjI1NkgwbDMyMCAzODQgMzIwLTM4NEg0NDh6IiAvPgo8L3N2Zz4=">`);
});

it('replaceData html absolute oath', async () => {
    const html = await replaceData(`<img id="arrowUpIcon" style="display: none" inline="" src="/assets/arrowDown.svg#inline">`, {
        rootpath: [__dirname]
    });
    expect(html).to.eql(`<img id="arrowUpIcon" style="display: none" inline="" src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBkPSJNNDQ4IDQ0OFYxOTJIMTkydjI1NkgwbDMyMCAzODQgMzIwLTM4NEg0NDh6IiAvPgo8L3N2Zz4=">`);
});

it('replaceData external url', async () => {
    const html = await replaceData(`<img src="https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/decimal.svg#inline">`);
    expect(html).to.eql(`<img src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMTI1IDgwJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPgogIDx0ZXh0IHk9Ijc1IiBmb250LXNpemU9IjEwMCIgZm9udC1mYW1pbHk9InNlcmlmIj48IVtDREFUQVsxMF1dPjwvdGV4dD4KPC9zdmc+Cg==">`);
});

it('replaceData css', async () => {
    const html = await replaceData(`background-image: url(assets/arrowDown.svg#inline);`);
    expect(html).to.eql(`background-image: url(data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBkPSJNNDQ4IDQ0OFYxOTJIMTkydjI1NkgwbDMyMCAzODQgMzIwLTM4NEg0NDh6IiAvPgo8L3N2Zz4=);`);
});

it('replaceData js', async () => {
    const html = await replaceData(`let img = 'assets/arrowDown.svg#inline';`);
    expect(html).to.eql(`let img = 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBkPSJNNDQ4IDQ0OFYxOTJIMTkydjI1NkgwbDMyMCAzODQgMzIwLTM4NEg0NDh6IiAvPgo8L3N2Zz4=';`);
});

it('replaceData file not exists', async () => {
    const html = await replaceData(`<img src="assets/notExists.svg#inline">`);
    expect(html).to.eql(`<img src="assets/notExists.svg#inline">`);
});

it('replace in file', async () => {
    try {
        fs.unlinkSync('assets/out.html');
    } catch (e) {
        // do nothing
    }
    await replace('assets/test.html', {outputFile: 'assets/out.html'});
    let html = fs.readFileSync('assets/out.html').toString();
    expect(html).to.eql(`<img src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdpZHRoPSI2NDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBkPSJNNDQ4IDQ0OFYxOTJIMTkydjI1NkgwbDMyMCAzODQgMzIwLTM4NEg0NDh6IiAvPgo8L3N2Zz4=">`);
});
