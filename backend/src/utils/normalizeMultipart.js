// multer parses multipart text fields into flat strings, so nested objects
// (sender, receiver, dimensions) arrive JSON-encoded and numbers arrive as
// strings. Rehydrate them before express-validator runs, otherwise the
// existing `body("sender.name")` style validators see undefined.

const OBJECT_FIELDS = ["sender", "receiver", "dimensions"];
const NUMBER_FIELDS = ["weight", "quantity"];

module.exports = function normalizeMultipart(req, _res, next) {
  if (!req.is("multipart/form-data") || !req.body) return next();

  OBJECT_FIELDS.forEach((key) => {
    const value = req.body[key];
    if (typeof value !== "string") return;
    try {
      req.body[key] = JSON.parse(value);
    } catch {
      // Leave it alone; validation will report it.
    }
  });

  NUMBER_FIELDS.forEach((key) => {
    if (req.body[key] !== undefined && req.body[key] !== "") {
      const n = Number(req.body[key]);
      if (!Number.isNaN(n)) req.body[key] = n;
    }
  });

  const dims = req.body.dimensions;
  if (dims && typeof dims === "object") {
    ["length", "width", "height"].forEach((k) => {
      const n = Number(dims[k]);
      if (!Number.isNaN(n)) dims[k] = n;
    });
  }

  next();
};
