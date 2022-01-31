import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import ProtectedRoute from './components/react_router/ProtectedRoute';
import LoginContextProvider from './contexts/LoginContextProvider';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/home/HomePage';
import LoadingBar from 'react-top-loading-bar';
import { loadingRef } from './refs/LoadingRef';
import BaseRedirectPage from './pages/home/BaseRedirectPage';

function App() {

  return (
    <BrowserRouter>
      <LoginContextProvider>
        <LoadingBar ref={loadingRef} color='#0BC5EA' />

        <Routes>
          <Route path='/login' element={<LoginPage />} />

          <Route path='/' element={<BaseRedirectPage />} />

          <Route path='/' element={<ProtectedRoute />}>
            <Route path='/home' element={
              <Sidebar>
                <HomePage />
              </Sidebar>
            } />
          </Route>

          <Route path='/' element={<ProtectedRoute />}>
            <Route path='/inventory' element={
              <Sidebar>
                <HomePage />
              </Sidebar>
            } />
          </Route>

          <Route path='/' element={<ProtectedRoute />}>
            <Route path='/purchase-order' element={
              <Sidebar>
                PO Page
              </Sidebar>
            } />
          </Route>

          <Route path='/' element={<ProtectedRoute />}>
            <Route path='/new-purchase' element={
              <Sidebar>
                New Purchase
              </Sidebar>
            } />
          </Route>

          <Route path='/' element={<ProtectedRoute />}>
            <Route path='/settings' element={
              <Sidebar>
                Settings
              </Sidebar>
            } />
          </Route>

        </Routes>
      </LoginContextProvider>
    </BrowserRouter>
  );
}

export default App;
