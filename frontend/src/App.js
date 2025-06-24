import './App.css';
import {
  Routes,
  Route
} from "react-router-dom";
import Auth from './Components/Auth/Auth.component';
import Home from './Components/Home/Home.component' 
import MyHousesComponent from './Components/MyHouses/MyHouses.component';
import AllUsersComponent from './Components/AllUsers/AllUsers.component';
import { fetchUser } from './redux/action';
import { connect } from 'react-redux';
import OtherComponent from './Components/Other/Other.component';

function App({state}) {
  return(
    <div className="App">
        <Routes>
          <Route index path="/auth" element={<Auth/>}/>
          <Route path="/" element={<Home/>}/>
          {state.user!=='' && state.user.role!=='regular' &&<Route path="/MyHouses" element={<MyHousesComponent/>}/>}
          {state.user!=='' && state.user.role==='admin' && <Route path="/AllUsers" element={<AllUsersComponent/>}/>}
          {state.user==='' &&<Route path="*" element={<OtherComponent/>}/>}
        </Routes>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
      state: state
    }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: () => dispatch(fetchUser()),

  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(App)