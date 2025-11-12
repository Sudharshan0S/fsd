// App.js

import React, { useState } from 'react';
import IssueList from './components/IssueList';
import AddIssue from './components/AddIssue';
import FilterIssue from './components/FilterIssue';

function App() {
  const [issues, setIssues] = useState([
    { id: 1, title: 'Login bug', status: 'open' },
    { id: 2, title: 'UI glitch', status: 'closed' },
    { id: 3, title: 'Performance lag', status: 'open' }
  ]);

  const [filter, setFilter] = useState('all');

  const addIssue = (title, status) => {
    const newIssue = {
      id: Date.now(),
      title,
      status
    };
    setIssues([...issues, newIssue]);
  };

  const filteredIssues = filter === 'all'
    ? issues
    : issues.filter(issue => issue.status === filter);

  return (
    <div>
      <h1>Issue Tracker</h1>
      <AddIssue onAdd={addIssue} />
      <FilterIssue onFilter={setFilter} />
      <IssueList issues={filteredIssues} />
    </div>
  );
}

export default App;



// IssueList.js

function IssueList({ issues }) {
  return (
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {issues.map(issue => (
          <tr key={issue.id}>
            <td>{issue.title}</td>
            <td>{issue.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default IssueList;



// AddIssue.js

import React, { useState } from 'react';

function AddIssue({ onAdd }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('open');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title, status);
      setTitle('');
      setStatus('open');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Issue title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>
      <button type="submit">Add Issue</button>
    </form>
  );
}

export default AddIssue;




// FilterIssue.js

import React, { useState } from 'react';

function FilterIssue({ onFilter }) {
  const [selected, setSelected] = useState('all');

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    onFilter(value);
  };

  return (
    <div>
      <label>Filter Issues: </label>
      <select value={selected} onChange={handleChange}>
        <option value="all">All</option>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>
    </div>
  );
}

export default FilterIssue;



// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);


<!-- public/index.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#666666" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
