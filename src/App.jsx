import { useEffect, useState } from "react";
import { MessageForm } from "./components/MessageForm";

const App = () => {
  const [userName, setUserName] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName');

    if (name) {
      setUserName(name);
    }
    // localStorage.clear()
  }, []);

  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName])

  const handleSubmit = async event => {
    event.preventDefault();

    const trimmedName = value.trim();

    if (!trimmedName) {
      return;
    }

    setUserName(trimmedName);
  }

  return (
    <div className="App">
      <h1 className="title">Chat application</h1>
      {!userName ? (
        <form
          className="field is-horizontal"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="input"
            placeholder="Enter your name"
            value={value}
            name="name"
            onChange={event => setValue(event.target.value)}
          />
          <button className="button" type="submit">Set</button>
        </form>        
      ) : (
        <MessageForm userName={userName} />
      )}
    </div>
  );
}

export default App;