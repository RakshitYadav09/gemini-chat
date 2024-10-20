import { useState } from "react";

function App() {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    const surpriseOptions = [
      "What is the capital of France?",
      "What is the capital of Germany?",
      "How do you make Butter Chicken?",
    ]

    const surprise = () => {
      const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
      setValue(randomValue);
    }

    const getResponse = async() => {
      if(!value) {
        setError("Please enter a question");
        return;
      }
      try {
        const options = {
          method: "POST",
          body: JSON.stringify({history: chatHistory,
            message: value
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }

        const response = await fetch("http://localhost:8000/gemini", options);
        const data = await response.text()
        console.log (data)
        setChatHistory(oldChatHistory => [...oldChatHistory, {
          role: "user",
          parts: value
        },
        {
          role: "model",
          parts: data
        }
      ])

      setValue("");


        
      } catch (error) {
        console.error(error)
        setError("There was an error fetching the data");
        
      }
    }

    const clear = () => {
      setValue("");
      setError("");
      setChatHistory([]);
    }


  return (
      <div className="app">
        <p>Welcome to Gemini. Ask me anything!
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise Me!</button>
        </p>
        <div className="input-container">
          <input value={value} 
          placeholder="Ask me anything"
          onChange={(e) => setValue(e.target.value)}>
          
          </input>
          {!error && <button onClick={getResponse}>Ask Me</button>}
          {error &&<button onClick={clear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        <div className="search-result">
          {chatHistory.map((chatItem, _index)=><div key={""}>
            <p className="answer">{chatItem.role}: {chatItem.parts}</p>
          </div>)}
        </div>
      </div>
  );
}

export default App;
