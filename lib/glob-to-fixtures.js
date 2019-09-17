module.exports = globToFixtures;

const { dirname, basename, resolve } = require("path");

const glob = require("glob");

function globToFixtures(path) {
  return glob.sync(path).reduce((map, path) => {
    path = resolve(process.cwd(), path);
    const fixture = require(path);
    if (/\/normalized-fixture.json$/.test(path)) {
      path = dirname(path);
    }
    const name = basename(path, ".json");
    map[name] = fixture;
    return map;
  }, {});
}
