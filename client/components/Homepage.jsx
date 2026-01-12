import React from 'react';
import {useState, useEffect} from 'react';
import {Link, useNavigate } from 'react-router-dom';
import axios from'axios';
import Post from './Post.jsx';
import Timer from './Timer.jsx';
import {promptWinner, awardCeremony} from '../badgeHelpers/bestOf.jsx';
import User from './User.jsx';
import { useAuth } from './AuthContext.jsx';
import { useSocket } from './SocketContext.jsx';
// import Text from './Text.jsx';


function Homepage() {
  // initialize navigate
  const navigate = useNavigate();

  //setting states of generated word, current story, and input using hooks
  
  // access the user state with data from context
  const { user, logout } = useAuth();
  const { prompt: words, responses: posts, story, endTime, socket } = useSocket();
  
  // // Check if the user is authenticated before rendering content
  // if (!user) {
  //   // Redirect or show a message to unauthenticated users
  //   navigate({ pathname: '/' });
  // }
  
  const [input, setInput] = useState('')
  const [textCount, setTextCount] = useState(0)

  //function to handle input change
  const handleInput = (event) => {
    setInput(event.target.value)
    setTextCount(event.target.value.length)
  }

  //function to handle user submit
  const handleSubmit = () => {
    if (input !== '') {
      socket.emit('new text', input, user.id, user.username); // do I need to send the current prompt (in case of race conditions?)
      // or can I safely assume that it goes with the server's current prompt?
      setInput('');
      setTextCount(0);
    }
  }

  //return dom elements and structure
  return (
    <div>
      <nav className='nav-btn' >
        <div className='user-div'>
          <Link to="/user">
            <button className='user-btn'>User</button>
          </Link>
          <Link to='/bookshelf' >
            <button className='user-bookshelf-button'>bookshelf</button>
          </Link>
          <div>
              <button className='user-btn' onClick={ () => {
                logout();
                navigate({ pathname: '/' });
              } }>Logout</button>
          </div>
          <Timer timerOnly={true} />
        </div>
      </nav>

    {/* //div for wrapper containing all homepage elements */}
    <div className='wrapper'>

      <div className='word-container'>
        {words.map((word, i) => (
        <span key={i}>{word } </span>
      ))}
      </div>

      <div className='story-container'>
        {
          story.map((text, i) => {
            return <div key={`${text}-${i}`}>{text}</div>
          })
        }
      </div>
      <div >
        <textarea
        className='user-input'
        type='text'
        placeholder='Add to the story!'
        onChange={handleInput}
        value={input}
        maxLength={150}
        />
        <div className='text-count'>
          {textCount}/150
        </div>
        <div className='submit'>
        <button className='submit-btn' onClick={handleSubmit}>Submit</button>
        </div>
        <div>
          {
            Object.keys(posts).map((postId) => {
              return <Post key={postId} text={posts[postId]} postId={postId}/>
            })
          }
        </div>
      </div>
    </div>
  </div>
  )
};

export default Homepage;