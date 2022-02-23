import { useEffect, useState , useRef} from 'react';
import randomWords from 'random-words'
import './App.css';

function App() {
  //constants 
  const  NUMB_OF_WORDS = 200
  const SECONDS = 60
  const [words,setWords] = useState([])
  const [currentInput, setCurrentInput] = useState("")
  const [countdown, setCountdown] = useState(SECONDS)
  const [currentWordIndex, setcurrentWordIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(-1)
  const [currentChar, setCurrentChar] = useState("")
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0)
  const [status, setStatus] = useState("waiting")
  const textInput = useRef(null)

  useEffect(()=>{
    setWords(generateWords())
  },[])

  useEffect(()=>{
    if(status === 'started'){
      textInput.current.focus()
    }
  },[status])

  //generate words (library used - random words)
  const generateWords = () =>{
    return new Array(NUMB_OF_WORDS).fill(null).map(() => randomWords())
  }

  
  const start = () =>{
    //clear everything
    if(status === "finished"){
      setWords(generateWords())
      setcurrentWordIndex(0)
      setCorrect(0)
      setIncorrect(0)
      setCurrentCharIndex(-1)
      setCurrentChar("")
    }
    // decrements the time 
    if(status !== 'started'){
      setStatus('started')
      let interval = setInterval(()=>{
        setCountdown((prevCountdown) => {
          //condition to break the loop else it will go to negative
          if(prevCountdown === 0){
            clearInterval(interval)
            setStatus('finished')
            setCurrentInput("")
            return SECONDS
          }else{
            return prevCountdown - 1
          } 
      })
      }, 1000)
    }
  }

  // keeps the typed key track
  const handleKeyDown = ({keyCode, key}) => {
    // increments index when clicked on space bar
    if(keyCode === 32){
      checkMatch()
      setCurrentInput("")
      setcurrentWordIndex(currentWordIndex + 1)
      setCurrentCharIndex(-1)
    }else{
      setCurrentCharIndex(currentCharIndex + 1)
      setCurrentChar(key)
    }
  }

  // compares the words
  const checkMatch = () =>{
    const wordToCompare = words[currentWordIndex]
    const doesItMatch = wordToCompare === currentInput.trim()
    if(doesItMatch){
      setCorrect(correct + 1)
    }else{
      setIncorrect(incorrect + 1)
    }
  }

  // highlight the char
  const getCharClass = (wordIndex, charIndex, char ) =>{
    if(wordIndex === currentWordIndex && charIndex === currentCharIndex && currentChar && status !== 'finished'){
        if(char === currentChar){
          return 'has-background-success'
        }else{
          return 'has-background-danger'
        }
    }else{
      return ''
    }
  }
  return (
    <div className="App">
      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h2>{countdown}</h2>
        </div>
      </div>
      <div className="control is-expanded section">
        <input ref={textInput} disabled={status !== "started"} type="text" className='input' onKeyDown={handleKeyDown} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} />
      </div>
      <div className="section">
        <button className='button is-info is-fullwidth' onClick={start}>
          Start
        </button>
      </div>
      {/* display when status is started */}
      {status === "started" && (
        <div className="section">
        <div className="card">
          <div className="card-content">
            <div className="content">
              {words.map((word,i) =>(
                <>
                <span key={i}>
                {word.split("").map((char,idx)=>(
                  <span className={getCharClass(i,idx,char)} key={idx}>{char}</span>
                ))}
                </span>
                <span> </span>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}
       {/* display when status is finished */}
      {status === 'finished' && (
        <div className="section">
        <div className="columns">
          <div className="column has-text-centered">
            <p className="is-size-5">Words per minute : </p>
            <p className='has-text-primary is-size-1'>{(correct/5)/0.5}</p>
          </div>
          <div className="column has-text-centered">
            <p className="is-size-5">Incorrect words : </p>
            <p className='has-text-danger is-size-1'>{incorrect}</p>
          </div>
          <div className="column has-text-centered">
            <p className="is-size-5">Accuracy : </p>
            <p className='has-text-primary is-size-1'>{Math.round((correct/(correct + incorrect)) * 100)}%</p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default App;
