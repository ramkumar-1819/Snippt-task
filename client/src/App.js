import Login from './Components/Login';
import Faculty from './Components/Faculty';
import Student from './Components/Student';
import { BrowserRouter as Router,Link,Switch,Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
          <Route exact path='/' component={Login} />
          <Route path='/Home' component={Login} />
          <Route path='/Faculty' component={Faculty}/>
          <Route path='/Student' component={Student}/>
      </Switch>
    </Router>
  );
}

export default App;
