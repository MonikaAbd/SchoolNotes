const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const noteDao = require("../../dao/note-dao.js");
const categoryDao = require("../../dao/category-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    date: { type: "string", format: "date" },
    note: { type: "string" },
    categoryId: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
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

    // validate date
    if (new Date(note.date) >= new Date()) {
      res.status(400).json({
        code: "invalidDate",
        message: `date must be current day or a day in the past`,
        validationError: ajv.errors,
      });
      return;
    }

    // update note in database
    const updatednote = noteDao.update(note);

    // check if categoryId exists
    const category = categoryDao.get(updatednote.categoryId);
    if (!category) {
      res.status(400).json({
        code: "categoryDoesNotExist",
        message: `Category with id ${updatednote.categoryId} does not exist`,
        validationError: ajv.errors,
      });
      return;
    }

    if (!updatednote) {
      res.status(404).json({
        code: "noteNotFound",
        message: `note ${note.id} not found`,
      });
      return;
    }

    // return properly filled dtoOut
    updatednote.category = category;
    res.json(updatednote);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
