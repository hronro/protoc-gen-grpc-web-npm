const path = require('path');

const fs = require('fs-extra');
const download = require('download');
const PLUGIN = require("./");

const VERSION = '1.0.3';
const DL_PREFIX = `https://github.com/grpc/grpc-web/releases/download/`;
const BIN_DIR = path.resolve(__dirname, "bin");
const EXT = process.platform === 'win32' ? '.exe' : '';

async function run() {
  if (process.arch !== 'x64') {
    throw new Error(`Unsupported arch: only support x86_64, but you're using ${process.arch}`);
  }

  await fs.ensureDir(BIN_DIR);
  const packageJsonPath = path.resolve(__dirname, 'package.json');
  // const execFilename = 'protoc-gen-grpc-web-' + process.platform + '-x86_64' + EXT;
  const execFilename = `protoc-gen-grpc-web-${VERSION}-${process.platform}-x86_64${EXT}`;

  const downloadUrl = DL_PREFIX + VERSION + '/' + execFilename;

  console.log("Downloading", downloadUrl);
  const buffer = await download(downloadUrl).catch(err => {
    console.error(err.message);
    process.exit(1);
  });

  const pluginStream = fs.createWriteStream(PLUGIN);
  pluginStream.write(buffer);
  pluginStream.end(() => {
    fs.chmodSync(PLUGIN, '0755');
  });
}

try {
  run();
} catch (error) {
  throw error;
}