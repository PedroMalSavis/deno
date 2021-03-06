// Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.
import { testPerm, assert, assertEqual } from "./test_util.ts";

// SYNC

testPerm({ write: true }, function removeSyncDirSuccess() {
  // REMOVE EMPTY DIRECTORY
  const path = Deno.makeTempDirSync() + "/dir/subdir";
  Deno.mkdirSync(path);
  const pathInfo = Deno.statSync(path);
  assert(pathInfo.isDirectory()); // check exist first
  Deno.removeSync(path); // remove
  // We then check again after remove
  let err;
  try {
    Deno.statSync(path);
  } catch (e) {
    err = e;
  }
  // Directory is gone
  assertEqual(err.kind, Deno.ErrorKind.NotFound);
  assertEqual(err.name, "NotFound");
});

testPerm({ write: true }, function removeSyncFileSuccess() {
  // REMOVE FILE
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const filename = Deno.makeTempDirSync() + "/test.txt";
  Deno.writeFileSync(filename, data, { perm: 0o666 });
  const fileInfo = Deno.statSync(filename);
  assert(fileInfo.isFile()); // check exist first
  Deno.removeSync(filename); // remove
  // We then check again after remove
  let err;
  try {
    Deno.statSync(filename);
  } catch (e) {
    err = e;
  }
  // File is gone
  assertEqual(err.kind, Deno.ErrorKind.NotFound);
  assertEqual(err.name, "NotFound");
});

testPerm({ write: true }, function removeSyncFail() {
  // NON-EMPTY DIRECTORY
  const path = Deno.makeTempDirSync() + "/dir/subdir";
  const subPath = path + "/subsubdir";
  Deno.mkdirSync(path);
  Deno.mkdirSync(subPath);
  const pathInfo = Deno.statSync(path);
  assert(pathInfo.isDirectory()); // check exist first
  const subPathInfo = Deno.statSync(subPath);
  assert(subPathInfo.isDirectory()); // check exist first
  let err;
  try {
    // Should not be able to recursively remove
    Deno.removeSync(path);
  } catch (e) {
    err = e;
  }
  // TODO(ry) Is Other really the error we should get here? What would Go do?
  assertEqual(err.kind, Deno.ErrorKind.Other);
  assertEqual(err.name, "Other");
  // NON-EXISTENT DIRECTORY/FILE
  try {
    // Non-existent
    Deno.removeSync("/baddir");
  } catch (e) {
    err = e;
  }
  assertEqual(err.kind, Deno.ErrorKind.NotFound);
  assertEqual(err.name, "NotFound");
});

testPerm({ write: false }, function removeSyncPerm() {
  let err;
  try {
    Deno.removeSync("/baddir");
  } catch (e) {
    err = e;
  }
  assertEqual(err.kind, Deno.ErrorKind.PermissionDenied);
  assertEqual(err.name, "PermissionDenied");
});

testPerm({ write: true }, function removeAllSyncDirSuccess() {
  // REMOVE EMPTY DIRECTORY
  let path = Deno.makeTempDirSync() + "/dir/subdir";
  Deno.mkdirSync(path);
  let pathInfo = Deno.statSync(path);
  assert(pathInfo.isDirectory()); // check exist first
  Deno.removeSync(path, { recursive: true }); // remove
  // We then check again after remove
  let err;
  try {
    Deno.statSync(path);
  } catch (e) {
    err = e;
  }
  // Directory is gone
  assertEqual(err.kind, Deno.ErrorKind.NotFound);
  assertEqual(err.name, "NotFound");
  // REMOVE NON-EMPTY DIRECTORY
  path = Deno.makeTempDirSync() + "/dir/subdir";
  const subPath = path + "/subsubdir";
  Deno.mkdirSync(path);
  Deno.mkdirSync(subPath);
  pathInfo = Deno.statSync(path);
  assert(pathInfo.isDirectory()); // check exist first
  const subPathInfo = Deno.statSync(subPath);
  assert(subPathInfo.isDirectory()); // check exist first
  Deno.removeSync(path, { recursive: true }); // remove
  // We then check parent directory again after remove
  try {
    Deno.statSync(path);
  } catch (e) {
    err = e;
  }
  // Directory is gone
  assertEqual(err.kind, Deno.ErrorKind.NotFound);
  assertEqual(err.name, "NotFound");
});

testPerm({ write: true }, function removeAllSyncFileSuccess() {
  // REMOVE FILE
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const filename = Deno.makeTempDirSync() + "/test.txt";
  Deno.writeFileSync(filename, data, { perm: 0o666 });
  const fileInfo = Deno.statSync(filename);
  assert(fileInfo.isFile()); // check exist first
  Deno.removeSync(filename, { recursive: true }); // remove
  // We then check again after remove
  let err;
  try {
    Deno.statSync(filename);
  } catch (e) {
    err = e;
  }
  // File is gone
  assertEqual(err.kind, Deno.ErrorKind.NotFound);
  assertEqual(err.name, "NotFound");
});

testPerm({ write: true }, function removeAllSyncFail() {
  // NON-EXISTENT DIRECTORY/FILE
  let err;
  try {
    // Non-existent
    Deno.removeSync("/baddir", { recursive: true });
  } catch (e) {
    err = e;
  }
  assertEqual(err.kind, Deno.ErrorKind.NotFound);
  assertEqual(err.name, "NotFound");
});

testPerm({ write: false }, function removeAllSyncPerm() {
  let err;
  try {
    Deno.removeSync("/baddir", { recursive: true });
  } catch (e) {
    err = e;
  }
  assertEqual(err.kind, Deno.ErrorKind.PermissionDenied);
  assertEqual(err.name, "PermissionDenied");
});

// ASYNC

testPerm({ write: true }, async function removeDirSuccess() {
  // REMOVE EMPTY DIRECTORY
  const path = Deno.makeTempDirSync() + "/dir/subdir";
  Deno.mkdirSync(path);
  const pathInfo = Deno.statSync(path);
  assert(pathInfo.isDirectory()); // check exist first
  await Deno.remove(path); // remove
  // We then check again after remove
  let err;
  try {
    Deno.statSync(path);
  } catch (e) {
    err = e;
  }
  // Directory is gone
  assertEqual(err.kind, Deno.ErrorKind.NotFound);
  assertEqual(err.name, "NotFound");
});

testPerm({ write: true }, async function removeFileSuccess() {
  // REMOVE FILE
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const filename = Deno.makeTempDirSync() + "/test.txt";
  Deno.writeFileSync(filename, data, { perm: 0o666 });
  const fileInfo = Deno.statSync(filename);
  assert(fileInfo.isFile()); // check exist first
  await Deno.remove(filename); // remove
  // We then check again after remove
  let err;
  try {
    Deno.statSync(filename);
  } catch (e) {
    err = e;
  }
  // File is gone
  assertEqual(err.kind, Deno.ErrorKind.NotFound);
  assertEqual(err.name, "NotFound");
});

testPerm({ write: true }, async function removeFail() {
  // NON-EMPTY DIRECTORY
  const path = Deno.makeTempDirSync() + "/dir/subdir";
  const subPath = path + "/subsubdir";
  Deno.mkdirSync(path);
  Deno.mkdirSync(subPath);
  const pathInfo = Deno.statSync(path);
  assert(pathInfo.isDirectory()); // check exist first
  const subPathInfo = Deno.statSync(subPath);
  assert(subPathInfo.isDirectory()); // check exist first
  let err;
  try {
    // Should not be able to recursively remove
    await Deno.remove(path);
  } catch (e) {
    err = e;
  }
  assertEqual(err.kind, Deno.ErrorKind.Other);
  assertEqual(err.name, "Other");
  // NON-EXISTENT DIRECTORY/FILE
  try {
    // Non-existent
    await Deno.remove("/baddir");
  } catch (e) {
    err = e;
  }
  assertEqual(err.kind, Deno.ErrorKind.NotFound);
  assertEqual(err.name, "NotFound");
});

testPerm({ write: false }, async function removePerm() {
  let err;
  try {
    await Deno.remove("/baddir");
  } catch (e) {
    err = e;
  }
  assertEqual(err.kind, Deno.ErrorKind.PermissionDenied);
  assertEqual(err.name, "PermissionDenied");
});

testPerm({ write: true }, async function removeAllDirSuccess() {
  // REMOVE EMPTY DIRECTORY
  let path = Deno.makeTempDirSync() + "/dir/subdir";
  Deno.mkdirSync(path);
  let pathInfo = Deno.statSync(path);
  assert(pathInfo.isDirectory()); // check exist first
  await Deno.remove(path, { recursive: true }); // remove
  // We then check again after remove
  let err;
  try {
    Deno.statSync(path);
  } catch (e) {
    err = e;
  }
  // Directory is gone
  assertEqual(err.kind, Deno.ErrorKind.NotFound);
  assertEqual(err.name, "NotFound");
  // REMOVE NON-EMPTY DIRECTORY
  path = Deno.makeTempDirSync() + "/dir/subdir";
  const subPath = path + "/subsubdir";
  Deno.mkdirSync(path);
  Deno.mkdirSync(subPath);
  pathInfo = Deno.statSync(path);
  assert(pathInfo.isDirectory()); // check exist first
  const subPathInfo = Deno.statSync(subPath);
  assert(subPathInfo.isDirectory()); // check exist first
  await Deno.remove(path, { recursive: true }); // remove
  // We then check parent directory again after remove
  try {
    Deno.statSync(path);
  } catch (e) {
    err = e;
  }
  // Directory is gone
  assertEqual(err.kind, Deno.ErrorKind.NotFound);
  assertEqual(err.name, "NotFound");
});

testPerm({ write: true }, async function removeAllFileSuccess() {
  // REMOVE FILE
  const enc = new TextEncoder();
  const data = enc.encode("Hello");
  const filename = Deno.makeTempDirSync() + "/test.txt";
  Deno.writeFileSync(filename, data, { perm: 0o666 });
  const fileInfo = Deno.statSync(filename);
  assert(fileInfo.isFile()); // check exist first
  await Deno.remove(filename, { recursive: true }); // remove
  // We then check again after remove
  let err;
  try {
    Deno.statSync(filename);
  } catch (e) {
    err = e;
  }
  // File is gone
  assertEqual(err.kind, Deno.ErrorKind.NotFound);
  assertEqual(err.name, "NotFound");
});

testPerm({ write: true }, async function removeAllFail() {
  // NON-EXISTENT DIRECTORY/FILE
  let err;
  try {
    // Non-existent
    await Deno.remove("/baddir", { recursive: true });
  } catch (e) {
    err = e;
  }
  assertEqual(err.kind, Deno.ErrorKind.NotFound);
  assertEqual(err.name, "NotFound");
});

testPerm({ write: false }, async function removeAllPerm() {
  let err;
  try {
    await Deno.remove("/baddir", { recursive: true });
  } catch (e) {
    err = e;
  }
  assertEqual(err.kind, Deno.ErrorKind.PermissionDenied);
  assertEqual(err.name, "PermissionDenied");
});
