const path = require('path');
const fs = require('fs');

const prettier = require('prettier');
const { getPackagesSync } = require('@manypkg/get-packages');

async function main(nextFrontendVersion) {
  const appPkgJson = require('../package.json');
  const workspace = path.join(__dirname, '../../../');
  const versions = {
    version: nextFrontendVersion || appPkgJson.version,
    deps: {},
  };

  const getCode = (info) => {
    return `
    (function () {
      window.__frontend = ${JSON.stringify(info, null, 2)};
    })();
    `;
  };

  const { packages } = getPackagesSync(workspace);

  packages.forEach((pkg) => {
    const pkgInFrontend = appPkgJson.dependencies[pkg.packageJson.name];
    if (pkgInFrontend) {
      versions.deps[pkg.packageJson.name] = pkg.packageJson.version;
    }
  });

  fs.writeFileSync(
    path.join(__dirname, '../public/version.js'),
    prettier.format(getCode(versions), {
      singleQuote: true,
      trailingComma: 'all',
      proseWrap: 'never',
      endOfLine: 'lf',
      tabWidth: 2,
      printWidth: 120,
    }),
    'utf-8',
  );

  console.log('inject frontend info success!');
}

module.exports = main;
