import {
  makeId,
  readJsonFile,
  writeJsonFile,
} from "../services/util.service.js";

export const bugService = {
  query,
  getById,
  remove,
  save,
};
const PAGE_SIZE = 3;
const bugs = readJsonFile("./data/bug.json");

function query({ filterBy, sortBy }) {
  var filteredBugs = bugs;

  if (filterBy.txt) {
    const regExp = new RegExp(filterBy.txt, "i");
    filteredBugs = filteredBugs.filter((bug) => regExp.test(bug.title));
  }

  if (filterBy.minSeverity) {
    filteredBugs = filteredBugs.filter(
      (bug) => bug.severity >= filterBy.minSeverity
    );
  }
  if (sortBy.sortField === "severity" || sortBy.sortField === "createdAt") {
    const { sortField } = sortBy;

    filteredBugs.sort(
      (bug1, bug2) => (bug1[sortField] - bug2[sortField]) * sortBy.sortDir
    );
  } else if (sortBy.sortField === "title") {
    filteredBugs.sort(
      (bug1, bug2) => bug1.title.localeCompare(bug2.title) * sortBy.sortDir
    );
  }
  if (filterBy.paginationOn) {
    const startIdx = PAGE_SIZE * filterBy.pageIdx;
    const endIdx = startIdx + PAGE_SIZE;
    filteredBugs = filteredBugs.slice(startIdx, endIdx);
  }
  return Promise.resolve(filteredBugs);
}

function getById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId);
  if (!bug) return Promise.reject("Bug not found");
  return Promise.resolve(bug);
}

function remove(bugId) {
  const idx = bugs.findIndex((bug) => bug._id === bugId);

  if (idx === -1) return Promise.reject("Bug not found");

  bugs.splice(idx, 1);
  return _saveBugs();
}

function save(bug) {
  if (bug._id) {
    const idx = bugs.findIndex((b) => b._id === bug._id);
    if (idx === -1) return Promise.reject("Bug not found");
    bugs[idx] = { ...bugs[idx], ...bug }; // patch
  } else {
    bug._id = makeId();
    bug.createdAt = Date.now();
    bugs.push(bug);
  }
  return _saveBugs().then(() => bug);
}

function _saveBugs() {
  return writeJsonFile("./data/bug.json", bugs);
}
