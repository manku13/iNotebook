
import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000"
const notesInitial = []
const [notes, setNotes] = useState(notesInitial)

// Get all Notes
const getNotes = async () => {
  // TODO : API calls
  const response = await fetch(`${host}/api/notes/fetchallnotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY1YzAzZjg0YzY5YzU0OGM2YTY2MzhmIn0sImlhdCI6MTcxNzMwNjM4NH0.aBoFj98yftuk64MDvEoyC3py1W5hsPpA7Lv065F4gyk"
    },

  });
  const json = await response.json()
  console.log(json)
  setNotes(json)
}

// Add a Note 
const addNote = async (title, description, tags) => {
  // TODO : API calls
  const response = await fetch(`${host}/api/notes/addnote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY1YzAzZjg0YzY5YzU0OGM2YTY2MzhmIn0sImlhdCI6MTcxNzMwNjM4NH0.aBoFj98yftuk64MDvEoyC3py1W5hsPpA7Lv065F4gyk"
    },
    body: JSON.stringify({title, description, tags})
  });
  const data = await response.json()
  setNotes(notes.concat(data))
  console.log("Adding a new note" + data)
}

// Delete a Note 
const deleteNote = async (id) => {
  // API call
  const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY1YzAzZjg0YzY5YzU0OGM2YTY2MzhmIn0sImlhdCI6MTcxNzMwNjM4NH0.aBoFj98yftuk64MDvEoyC3py1W5hsPpA7Lv065F4gyk"
    }
  });
  const json = await response.json()
  console.log(json)
  
  console.log("Deleted Note with id : " + id)
  const newNote = notes.filter((note) => {return note._id !== id})
  setNotes(newNote)
}

// Add a Update 
const editNote = async (id, title, description, tags) => {
  // API call
  const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY1YzAzZjg0YzY5YzU0OGM2YTY2MzhmIn0sImlhdCI6MTcxNzMwNjM4NH0.aBoFj98yftuk64MDvEoyC3py1W5hsPpA7Lv065F4gyk"
    },
    body: JSON.stringify({title, description, tags})
  });
  const json = await response.json()
  console.log("Updated Note " + json)
  let newNote = JSON.parse(JSON.stringify(notes))

  // For cient side
  for (let index = 0; index < newNote.length; index++) {
    const element = newNote[index];
    if(element._id === id){
      newNote[index].title = title
      newNote[index].description = description
      newNote[index].tags = tags
      break;
    }


  }
  setNotes(newNote)
}
    return (
        <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState
