// packageImage is now stored as a self-contained data URI (see
// routes/packages.js's fileToDataUri), so no host/base URL needs to be
// prepended anymore -- we just pass it straight through.
const buildImageUrl = (_req, packageImage) => packageImage || "";

const attachImageUrl = (req, pkg) => {
  const obj = pkg.toObject ? pkg.toObject() : { ...pkg };
  if (obj.packageImage) {
    obj.packageImageUrl = buildImageUrl(req, obj.packageImage);
  }
  return obj;
};

module.exports = { buildImageUrl, attachImageUrl };
  