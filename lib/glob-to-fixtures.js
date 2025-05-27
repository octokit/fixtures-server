import { dirname, basename, resolve } from "node:path";

import { globSync as glob } from "tinyglobby";
import { readFileSync } from "node:fs";

export default function globToFixtures(path) {
  return glob(path).reduce((map, path) => {
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
