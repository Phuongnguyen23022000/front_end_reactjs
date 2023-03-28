/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import Note from "./components/note/Note"
import axios from 'axios';
import noteService from "./services/notes/note"
import "./index.css";
import { Notification } from "./components/notifi";
import { Footer } from "./components/Footer";
const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState(' ')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error..')

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  })
  // useEffect(() => {
  //   // console.log('effect')
  //   axios
  //     .get('http://localhost:3001/notes')
  //     .then(response => {
  //       // console.log("result")
  //       setNotes(response.data)
  //     })
  // }, [])
  // console.log("render", notes.length, "notes")

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log("result ", event.target)
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: notes.length + 1
    }
    // setNotes(notes.concat(noteObject));
    // setNewNote('')
    axios
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }


  const handleChange = (event) => {
    // console.log("result", event.target.value)
    setNewNote(event.target.value)
  }

  const noteToShow = showAll ? notes : notes.filter(note => note.important === true)

  const toggleImportanceOf = id => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changeNote = { ...note, important: !note.important }

    noteService
      .update(id, changeNote).then(returnedNote => {
        setNotes(notes.map(n => n.id !== id ? n : returnedNote))
      })
      .catch(error => {
        setErrorMessage(`the note '${note.content} was already deleted from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }
  return (
    <div>
      <h1>newNote</h1>
      <Notification message={errorMessage} />
      <div><button onClick={() => setShowAll(!showAll)}>show{showAll ? 'important' : 'all'}</button></div>
      <ul>
        {noteToShow.map(note =>
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" value={newNote} onChange={handleChange} />
        <button type="submits">Submit</button>
      </form>
      <Footer />
    </div>
  )
}

export default App