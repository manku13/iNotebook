import React, {useContext, useState} from 'react'
import noteContext from "../context/notes/noteContext"

const AddNote = (props) => {
    const context = useContext(noteContext);
    const {addNote} = context;

    const [note, setNote] = useState({title: "", description: "", tag: ""})

    const handleClick = (e)=>{
        e.preventDefault();
        addNote(note.title, note.description, note.tag)
        setNote({title: "", description: "", tag: ""})
        props.showAlert("Note Added Successfully", "success")


    }

    const onChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }
    return (
            <div className='container my-3'>
                <h1>Add a Note</h1>
                <div className="mb-3 my-3">
                    <label forhtml="title" className="form-label">Title </label>
                    <input type="text" className="sform-control" id="title" name = "title" placeholder="Title" onChange={onChange} value = {note.title}/>
                </div>
                <div className="mb-3">
                    <label forhtml="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description"  name="description" rows="3" onChange={onChange} value = {note.description}></textarea>
                </div>
                <div className="mb-3 my-3">
                    <label forhtml="tag" className="form-label">Title </label>
                    <input type="text" className="sform-control" id="tag" name = "tag" placeholder="tag" onChange={onChange} value = {note.tag}/>
                </div>
                <button disabled={note.title.length < 5 || note.description.length < 5} type='submit' className='btn btn-primary' onClick={handleClick}>Add Note</button>
            </div>
    )
}

export default AddNote
