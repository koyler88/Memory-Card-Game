import { useState, useEffect, useRef } from 'react';
import './App.css'
import { Welcome } from './Welcome';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


function App() {


  const [difficulty, setDifficulty] = useState('easy');
  const [page, setPage] =  useState("welcome")
  const [score, setScore] =  useState(0)
  const [highScore, setHighScore] =  useState(() => {
    const saved = localStorage.getItem(`highScore_${difficulty}`);
    return saved ? Number(saved) : 0;
  });

  let clickedCards = useRef([])

  useEffect(() => {
    const savedHighScore = localStorage.getItem(`highScore_${difficulty}`);
    if (savedHighScore) {
      setHighScore(Number(savedHighScore));
    }
  }, [difficulty]);

  function handleGameStart() {
    const selectedDifficulty = document.getElementById("difficulty-select").value
    setDifficulty(selectedDifficulty)
    setPage("game")
    populate(selectedDifficulty)
  }

  const [pokemonIdList, setPokemonIdList] = useState([])

  function populate(diff) {
    let cardAmount = 10;
    if (diff === "medium") cardAmount = 20;
    if (diff === "hard") cardAmount = 50;
  
    const newList = [];
    while (newList.length < cardAmount) {
      const num = Math.floor(Math.random() * 1025) + 1;
      if (!newList.includes(num)) {
        newList.push(num);
      }
    }
  
    setPokemonIdList(newList);
  }
  

  function handleCardClick(e) {
    const cardValue = e.target.dataset.id
    if (clickedCards.current.includes(cardValue)) {
      if (highScore < score) {
        setHighScore(score)
      }
      setPage("gameover")
    } else {
      let newScore = score + 1
      clickedCards.current = [...clickedCards.current, cardValue]
      setScore(newScore)
      if (newScore > 9 && difficulty === "easy") {
        if (highScore < newScore) {
          setHighScore(newScore)
        }
        setPage("win")
      } else if (newScore > 19 && difficulty === "medium") {
        if (highScore < newScore) {
          setHighScore(newScore)
        }
        setPage("win")
      } else if (newScore > 49 && difficulty === "hard") {
        if (highScore < newScore) {
          setHighScore(newScore)
        }
        setPage("win")
      } 
      setPokemonIdList(prev => shuffleArray([...prev]))
    }
    
  }
  

  function CreateCard({id}) {
    const [pName, setpName] = useState(null)
    const [url, setUrl] = useState(null);

  
    useEffect(() => {

      async function fetchData() {
        const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const json = await result.json();
        const url = json.sprites.front_default
        const pName = json.species.name
        setUrl(url);
        setpName(pName)
        console.log("effect run")
      }

      fetchData()

    }, [id]);
  
    return (
      
      <div onClick={handleCardClick} className="card" data-id={id}>
        <img className='pokemon-img unclickable' src={url} alt="" />
        <p className="pokemon-name unclickable">{pName}</p>
      </div>
      
    );
  }

  function MyComponent({ pokemonIdList }) {
    return (
      <>
        {pokemonIdList.map((id) => (
          <CreateCard
          key={id}
          id={id}
          />
        ))}
      </>
    );
  }

  function resetGameState() {
    setScore(0);
    clickedCards.current = [];
  }
  

  function handlePlayAgain() {
    resetGameState();
    populate(difficulty)
    setPage("game")
  }

  function handleMainMenu() {
    resetGameState();
    setPage("welcome")
  }

  // Save high score whenever it changes
  useEffect(() => {
    localStorage.setItem(`highScore_${difficulty}`, highScore);
  }, [highScore, difficulty]);
  


  return (
    <>
      {page === "welcome" && (
        <Welcome
        handleClick={handleGameStart}/>
      )}
      {page === "game" && (
        <>
        <h4>Score: {score}</h4>
        <h4>High Score: {highScore}</h4>
        <h3 className='center-self'>Get points by clicking on an image but don't click on any more than once!</h3>
        <div className="cards-container">
          <MyComponent
          pokemonIdList={pokemonIdList}
          />
        </div>
        </>
      )}
      {page === "gameover" && (
        <>
        <h1>Game over!</h1>
        <h3>Your Score: {score}</h3>
        <h3>High Score: {highScore}</h3>
        <button onClick={handlePlayAgain}>Play Again</button>
        <button onClick={handleMainMenu}>Main Menu</button>
        </>
      )}
      {page === "win" && (
        <>
        <h1>You Win!</h1>
        <h3>Your Score: {score}</h3>
        <h3>High Score: {highScore}</h3>
        <button onClick={handlePlayAgain}>Play Again</button>
        <button onClick={handleMainMenu}>Main Menu</button>
        </>
      )}
      
    </>
    
    
  )
}

export default App
