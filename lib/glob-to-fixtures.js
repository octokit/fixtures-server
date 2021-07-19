export default globToFixtures;

import { dirname, basename, resolve } from "path";

import glob from "glob";
import { readFileSync } from "fs";

function globToFixtures(path) {
  return glob.sync(path).reduce((map, path) => {
    path = resolve(process.cwd(), path);
    const fixture = JSON.parse(readFileSync(path).toString());
    if (/\/normalized-fixture.json$/.test(path)) {
      path = dirname(path);
    }
    const name = basename(path, ".json");
    map[name] = fixture;
    return map;
  }, {});
}
