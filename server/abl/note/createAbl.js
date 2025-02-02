const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const noteDao = require("../../dao/note-dao.js");
const categoryDao = require("../../dao/category-dao.js");

const schema = {
  type: "object",
  properties: {
    date: { type: "string", format: "date" },
    note: { type: "string", maxLength: 10000 },
    categoryId: { type: "string" },
  },
  required: ["date", "categoryId"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let note = req.body;

    // validate input
    const valid = ajv.validate(schema, note);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // check if categoryId exists
    const category = categoryDao.get(note.categoryId);

    if (!category) {
      res.status(400).json({
        code: "categoryDoesNotExist",
        message: `category with id ${note.categoryId} does not exist`,
        validationError: ajv.errors,
      });
      return;
    }

    // store note to persistent storage
    note = noteDao.create(note);
    note.category = category;

    // return properly filled dtoOut
    res.json(note);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
