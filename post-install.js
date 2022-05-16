const path = require('path');

const fs = require('fs-extra');
const download = require('download');
const PLUGIN = require("./");

const VERSION = '1.3.0';
const DL_PREFIX = 'https://github.com/grpc/grpc-web/releases/download/';
const BIN_DIR = path.resolve(__dirname, "bin");
const EXT = process.platform === 'win32' ? '.exe' : '';
const PLATFORM_NAME = process.platform === 'win32' ? 'windows' : process.platform;

async function run() {
  if (process.arch !== 'x64') {
    console.log(process.arch, process.platform);
    if (process.arch === "arm64" && process.platform === "darwin") {
      console.log(
        "macos arm64 platform detected, using x64 until https://github.com/grpc/grpc-web/issues/1159 is resolved"
      );
    } else {
      throw new Error(
        `Unsupported arch: only support x86_64, but you're using ${process.arch}`
      );
    }
  }

  await fs.ensureDir(BIN_DIR);
  const execFilename = `protoc-gen-grpc-web-${VERSION}-${PLATFORM_NAME}-x86_64${EXT}`;

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
