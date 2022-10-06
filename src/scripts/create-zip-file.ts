#!/usr/bin/env node

/**
 * Create the main zip file used by lambdas.
 */
(async () => {
  const fs = require("fs-extra");
  const path = require("path");
  const archiver = require("archiver");
  const root: string = path.join(__dirname, "..", "..");
  const rimraf = require("rimraf");

  const target = path.join(root, "3StrikesGame.zip");
  rimraf.sync(target);
  const output = fs.createWriteStream(target);
  const archive = archiver("zip");

  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed."
    );
  });

  archive.on("error", function (err: Error) {
    throw err;
  });

  archive.pipe(output);

  // append files from a sub-directory and naming it `new-subdir` within the archive
  archive.directory(path.join(root, "dist"), "dist");
  archive.directory(
    path.join(root, "workspace", "node_modules"),
    "node_modules"
  );

  archive.finalize();
})();
