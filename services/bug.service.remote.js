import { get } from "http";
import { utilService} from "./util.service.js";

const BASE_URL = "/api/bug";
const BUG_KEY = "bugDB";


export const bugService = {
  query,
  getById,
  remove,
  save,
  getEmptyBug,
  getDefaultFilter,
};
const bugs = utilService.readJsonFile('./data/bug.json')
function query(filterBy = {}) {
    var filteredBugs = bugs
    if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
        }

        if (filterBy.minSeverity) {
            filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
        }
    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
   const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('bug not found')
        return Promise.resolve(bug)
}

function remove(bugId){
    const idx = bugs.findIndex(bug => bug._id === bugId)

    if (idx === -1) return Promise.reject('bug not found')
        bugs.splice(idx, 1)
    
    return _saveBugs()
}
function save(bug){
     if (bug._id) {
        const idx = bugs.findIndex(c => c._id === bug._id)
        if (idx === -1) return Promise.reject('bug not found')
        bugs[idx] = bug
    } else {
        bug._id = makeId()
        bugs.push(bug)
    }
    return _saveBugs()
        .then(() => bug)
}
function getEmptyBug(title='',description='',severity='',createdAt=Date.now()){
    return {title,description,severity,createdAt}
}
function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}

function _saveBugs() {
    return utilService.writeJsonFile('./data/bug.json', bugs)
}