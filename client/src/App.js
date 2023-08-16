import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import {useNavigate} from 'react-router-dom';
import {checkAuthAC} from './action';
import { useDispatch } from 'react-redux';

function App() {
   const navigate = useNavigate();
   const dispatch = useDispatch();
  useEffect(()=>{
    //console.log('checking Auth');
    dispatch(checkAuthAC(navigate));
  },[])
  return (
     <Outlet />
  );
}

export default App;