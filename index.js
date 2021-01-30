const process = require('process');
const { replace } = require('./inliner');

module.exports = bundler => {
    bundler.on('bundled', async (bundle) => {
        const bundles = Array.from(bundle.childBundles).concat([bundle]);

        return Promise.all(
            bundles.map(async bundle => {
                if (bundle.entryAsset && ['html','css','js'].indexOf(bundle.entryAsset.type) !== -1) {
                    await replace(bundle.name, {
                        rootpath: [
                            bundle.entryAsset.options.outDir,
                            bundle.entryAsset.options.rootDir,
                        ],
                    });
                }
            })
        );
    });
};