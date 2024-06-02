const express = require("express")
const router = express.Router()
var fetchuser = require("../Middleware/fetchuser")
const Notes = require("../models/Notes")
const { body, validationResult } = require("express-validator")


router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

// Router 2: Add a new Note using: Post 
router.post("/addnote", fetchuser, [
    body("title", "Title must contains 3 letters").isLength({ min: 3 }),
    body("description", "Description must be at least 5 characters long").isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body
        // if there are errors, return Bad request and the errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return req.status(400).json({ errors: errors.array() })
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Invternal Server Error")
    }
})

// Route 3 : Update a existing note - 
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body
    try {
        // crate a newNote object
        const newNote = {}
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        // Find the note to be updated and updata it
        let note = await Notes.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not Found")
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Invternal Server Error")
    }
})

// Route 4 : Deleting a existing note - DELELTE
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let note = await Notes.findById(req.params.id)
        if (!note) {
            return res.status(404).send("Not Found")
        }
        // Checking whether the note belong the user or not
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Sucess": "Note has been deleted", note: note })

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Invternal Server Error")
    }
})

module.exports = router