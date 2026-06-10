import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const EXPECTED_VERSION = '1.4.0-bio-alpha.8.2';
const EXPECTED_ARCHIVE_NAME = `hosted-demo-evidence-v${EXPECTED_VERSION}.zip`;
const REQUIRED_FILES = [
  'desktop-first-screen.png',
  'mobile-first-screen.png',
  'strategic-mode.png',
  'biopolitical-mode.png',
  'visible-text-ar.json',
  'visible-text-en.json',
  'visible-text-fr.json',
  'hosted-demo-metadata.json'
];

const root = process.cwd();
const fail = (message) => {
  console.error(`Hosted demo evidence archive check failed: ${message}`);
  process.exit(1);
};

const normalizeEntryName = (name) => name.replace(/\\/g, '/').replace(/^\.\//, '');
const basenameMap = (entries) => {
  const map = new Map();
  for (const [name, data] of entries) {
    const base = path.posix.basename(normalizeEntryName(name));
    if (map.has(base)) fail(`duplicate archive basename is ambiguous: ${base}`);
    map.set(base, data);
  }
  return map;
};

const readJsonFromMap = (map, fileName) => {
  if (!map.has(fileName)) fail(`archive missing JSON evidence file: ${fileName}`);
  try {
    return JSON.parse(map.get(fileName).toString('utf8'));
  } catch (error) {
    fail(`archive has invalid JSON evidence file: ${fileName} (${error.message})`);
  }
};

const assertEvidenceIdentity = (readJson, sourceLabel) => {
  const metadata = readJson('hosted-demo-metadata.json');
  if (metadata.app_version !== EXPECTED_VERSION) fail(`${sourceLabel}: metadata app_version must be ${EXPECTED_VERSION}`);
  if (metadata.evidence_version !== EXPECTED_VERSION) fail(`${sourceLabel}: metadata evidence_version must be ${EXPECTED_VERSION}`);
  if (metadata.evidence_version !== metadata.app_version) fail(`${sourceLabel}: metadata evidence_version must match metadata app_version`);
  if (metadata.archive_name !== EXPECTED_ARCHIVE_NAME) fail(`${sourceLabel}: metadata archive_name must be ${EXPECTED_ARCHIVE_NAME}`);
  if (metadata.archive_identity_guard !== true) fail(`${sourceLabel}: metadata archive_identity_guard must be true`);
  if (metadata.archive_format !== 'zip') fail(`${sourceLabel}: metadata archive_format must be zip`);
  for (const fileName of REQUIRED_FILES) {
    if (!Array.isArray(metadata.required_files) || !metadata.required_files.includes(fileName)) {
      fail(`${sourceLabel}: metadata required_files must include ${fileName}`);
    }
    if (!Array.isArray(metadata.archive_required_files) || !metadata.archive_required_files.includes(fileName)) {
      fail(`${sourceLabel}: metadata archive_required_files must include ${fileName}`);
    }
  }
  for (const lang of ['ar', 'en', 'fr']) {
    const snapshot = readJson(`visible-text-${lang}.json`);
    if (snapshot.app_version !== EXPECTED_VERSION) fail(`${sourceLabel}: visible-text-${lang}.json app_version must be ${EXPECTED_VERSION}`);
    if (snapshot.expected_app_version !== EXPECTED_VERSION) fail(`${sourceLabel}: visible-text-${lang}.json expected_app_version must be ${EXPECTED_VERSION}`);
    if (snapshot.app_version !== metadata.app_version) fail(`${sourceLabel}: visible-text-${lang}.json app_version must match metadata app_version`);
    if (snapshot.app_version_source !== 'meta[name="app-version"]') {
      fail(`${sourceLabel}: visible-text-${lang}.json app_version_source must identify the runtime app-version meta tag`);
    }
  }
};

const assertNoStaleHostedEvidenceArchives = () => {
  for (const item of fs.readdirSync(root)) {
    if (!/^hosted-demo-evidence.*\.zip$/.test(item)) continue;
    if (item !== EXPECTED_ARCHIVE_NAME) {
      fail(`stale or unversioned hosted evidence archive found: ${item}; expected ${EXPECTED_ARCHIVE_NAME}`);
    }
  }
};

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c >>> 0;
  }
  return table;
})();

const crc32 = (buffer) => {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};

const collectEvidenceEntries = (dir) => {
  if (!fs.existsSync(dir)) fail(`missing evidence directory: ${path.relative(root, dir) || dir}`);
  if (!fs.statSync(dir).isDirectory()) fail(`evidence path is not a directory: ${path.relative(root, dir) || dir}`);
  const entries = [];
  for (const fileName of REQUIRED_FILES) {
    const filePath = path.join(dir, fileName);
    if (!fs.existsSync(filePath)) fail(`missing required evidence file: ${fileName}`);
    if (!fs.statSync(filePath).isFile()) fail(`required evidence path is not a file: ${fileName}`);
    const data = fs.readFileSync(filePath);
    if (data.length <= 0) fail(`required evidence file is empty: ${fileName}`);
    entries.push([fileName, data]);
  }
  return entries.sort(([a], [b]) => a.localeCompare(b));
};

const writeVersionedZip = (archivePath, entries) => {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  for (const [entryName, data] of entries) {
    const name = Buffer.from(normalizeEntryName(entryName), 'utf8');
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(0, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    localParts.push(local, name, data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(0, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, name);
    offset += local.length + name.length + data.length;
  }

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralSize, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);
  fs.writeFileSync(archivePath, Buffer.concat([...localParts, ...centralParts, eocd]));
};

const findEndOfCentralDirectory = (buffer) => {
  for (let offset = buffer.length - 22; offset >= 0; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) return offset;
  }
  fail('archive missing ZIP end-of-central-directory record');
};

const readZipEntries = (archivePath) => {
  if (path.basename(archivePath) !== EXPECTED_ARCHIVE_NAME) {
    fail(`archive filename must be ${EXPECTED_ARCHIVE_NAME}`);
  }
  const buffer = fs.readFileSync(archivePath);
  if (buffer.length <= 0) fail('archive file is empty');
  const eocdOffset = findEndOfCentralDirectory(buffer);
  const entryCount = buffer.readUInt16LE(eocdOffset + 10);
  const centralOffset = buffer.readUInt32LE(eocdOffset + 16);
  const entries = new Map();
  let cursor = centralOffset;
  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(cursor) !== 0x02014b50) fail('archive central directory is invalid');
    const method = buffer.readUInt16LE(cursor + 10);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const uncompressedSize = buffer.readUInt32LE(cursor + 24);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const localOffset = buffer.readUInt32LE(cursor + 42);
    const name = normalizeEntryName(buffer.slice(cursor + 46, cursor + 46 + nameLength).toString('utf8'));

    if (buffer.readUInt32LE(localOffset) !== 0x04034b50) fail(`archive local header is invalid for ${name}`);
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = buffer.slice(dataOffset, dataOffset + compressedSize);
    let data;
    if (method === 0) data = compressed;
    else if (method === 8) data = zlib.inflateRawSync(compressed);
    else fail(`archive entry uses unsupported compression method ${method}: ${name}`);
    if (data.length !== uncompressedSize) fail(`archive entry size mismatch: ${name}`);
    entries.set(name, data);
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
};

const validateArchive = (archivePath) => {
  const entries = readZipEntries(archivePath);
  const byBaseName = basenameMap(entries);
  for (const fileName of REQUIRED_FILES) {
    if (!byBaseName.has(fileName)) fail(`archive missing required evidence file: ${fileName}`);
    if (byBaseName.get(fileName).length <= 0) fail(`archive required evidence file is empty: ${fileName}`);
  }
  assertEvidenceIdentity((fileName) => readJsonFromMap(byBaseName, fileName), `archive ${path.basename(archivePath)}`);
};

const requestedPath = process.argv[2];
if (requestedPath && requestedPath.endsWith('.zip')) {
  validateArchive(path.resolve(root, requestedPath));
  console.log(`Hosted demo evidence archive check passed: ${requestedPath}`);
  process.exit(0);
}

const evidenceDir = path.resolve(root, requestedPath || process.env.HOSTED_DEMO_EVIDENCE_DIR || 'hosted-demo-evidence-local');
const entries = collectEvidenceEntries(evidenceDir);
assertEvidenceIdentity((fileName) => JSON.parse(fs.readFileSync(path.join(evidenceDir, fileName), 'utf8')), path.relative(root, evidenceDir) || evidenceDir);
assertNoStaleHostedEvidenceArchives();
const archivePath = path.join(root, EXPECTED_ARCHIVE_NAME);
if (fs.existsSync(archivePath)) fs.rmSync(archivePath, { force: true });
writeVersionedZip(archivePath, entries);
validateArchive(archivePath);
console.log(`Hosted demo evidence archive check passed: ${EXPECTED_ARCHIVE_NAME}`);
