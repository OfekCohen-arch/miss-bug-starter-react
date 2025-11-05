import express from 'express'
import { bugService } from './services/bug.service.local.js'

const app = express()


app.get('/', (req, res) => res.send('Hello there'))
app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt:req.query.txt,
        minSeverity:+req.query.minSeverity
    }
    bugService.query(filterBy)
    .then(bugs=>res.send(bugs))
})
app.get('/api/bug/save', (req, res) => {
    const {id:_id,title,description,severity,createdAt} = req.query
    const bug = {_id,title,description,severity,createdAt}
    bugService.save(bug)
    .then(bug=>res.send(bug))
})
app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.id
    bugService.getById(bugId)
    .then(bug => res.send(bug))
})
app.get('/api/bug/:bugId/remove', (req, res) => {
    const bugId = req.params.id
    bugService.remove(bugId)
    .then(res.send('OK'))
})
const port = 3030
app.listen(port)

