const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const noteFolderPath = path.join(
  __dirname,
  "storage",
  "noteList"
);

// Method to read a note from a file
function get(noteId) {
  try {
    const filePath = path.join(noteFolderPath, `${noteId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadnote", message: error.message };
  }
}

// Method to write a note to a file
function create(note) {
  try {
    note.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(noteFolderPath, `${note.id}.json`);
    const fileData = JSON.stringify(note);
    fs.writeFileSync(filePath, fileData, "utf8");
    return note;
  } catch (error) {
    throw { code: "failedToCreatenote", message: error.message };
  }
}

// Method to update note in a file
function update(note) {
  try {
    const currentnote = get(note.id);
    if (!currentnote) return null;
    const newnote = { ...currentnote, ...note };
    const filePath = path.join(noteFolderPath, `${note.id}.json`);
    const fileData = JSON.stringify(newnote);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newnote;
  } catch (error) {
    throw { code: "failedToUpdatenote", message: error.message };
  }
}

// Method to remove a note from a file
function remove(noteId) {
  try {
    const filePath = path.join(noteFolderPath, `${noteId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemovenote", message: error.message };
  }
}

// Method to list notes in a folder
function list(filter = {}) {
  try {
    const files = fs.readdirSync(noteFolderPath);
    let noteList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(noteFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    const filterDate = filter.date
      ? new Date(filter.date).getFullYear()
      : new Date().getFullYear();
    noteList = noteList.filter(
      (item) => new Date(item.date).getFullYear() === filterDate
    );
    noteList.sort((a, b) => new Date(a.date) - new Date(b.date));

    return noteList;
  } catch (error) {
    throw { code: "failedToListnotes", message: error.message };
  }
}

// Method to list notes by categoryId
function listByCategoryId(categoryId) {
  const noteList = list();
  return noteList.filter((item) => item.categoryId === categoryId);
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  listByCategoryId,
};
