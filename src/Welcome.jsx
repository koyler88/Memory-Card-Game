import './Welcome.css'
import React, { useState } from 'react';


export function Welcome({handleClick}) {

    const [difficulty, setDifficulty] = useState('easy');

    function DifficultySelector() {
        
    
        const handleDifficultyChange = (event) => {
            setDifficulty(event.target.value);
        };
    
        return (
            <div>
                <select
                    id="difficulty-select"
                    value={difficulty}
                    onChange={handleDifficultyChange}
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
        );
    }

    return (
        <div className="page-container">
            <h1>Welcome to the Pokemon Memory Card Game!</h1>

            <h2>Select Difficulty</h2>

            <DifficultySelector/>

            <br />

            <button onClick={handleClick}>Start Game</button>
        </div>
        
    )
}