import { dirname, basename, resolve } from "path";

import { globSync as glob } from "glob";
import { readFileSync } from "fs";

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
