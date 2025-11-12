//src/app.js
import React from "react";
import CounterFunction from "./CounterFunction";
import CounterClass from "./CounterClass";

function App() {
  return (
    <div>
      <h1>Counter Application</h1>
      <CounterFunction />
      <CounterClass />
    </div>
  );
}

export default App;



//CounterFunction.js
import React, { useState, useEffect } from "react";

function CounterFunction() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount(0);
    }, 2000); // initializes after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (count === null) return <h2>Loading counter...</h2>;

  return (
    <div>
      <h2>Functional Counter: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(count * 2)}>Double</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default CounterFunction;



//CounterClass.js
import React, { Component } from "react";

class CounterClass extends Component {
  constructor(props) {
    super(props);
    this.state = { count: null };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ count: 0 });
    }, 2000); // initializes after 2 seconds
  }

  render() {
    const { count } = this.state;

    if (count === null) return <h2>Loading counter...</h2>;

    return (
      <div style={{ margin: "20px", padding: "20px", border: "1px solid black" }}>
        <h2>Class Counter: {count}</h2>

        <button onClick={() => this.setState({ count: count + 1 })}>Increment</button>
        <button onClick={() => this.setState({ count: count - 1 })}>Decrement</button>
        <button onClick={() => this.setState({ count: count * 2 })}>Double</button>
        <button onClick={() => this.setState({ count: 0 })}>Reset</button>
      </div>
    );
  }
}

export default CounterClass
