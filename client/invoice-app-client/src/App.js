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
import SettingPage from './pages/settings/SettingPage';
import NewPOPage from './pages/new_po/NewPOPage';
import PurchaseOrderPage from './pages/purchase_orders/PurchaseOrderPage';
import InventoryPage from './pages/inventory/InventoryPage';
import NotFoundPage from './pages/error/NotFoundPage';
import POMonthYearProvider from './contexts/POMonthYearProvider';
import ProfileContextProvider from './contexts/ProfileContextProvider';
import PODataProvider from './contexts/PODataProvider';
import ProductDataProvider from './contexts/ProductDataProvider';

function App() {

  return (
    <BrowserRouter>
      {/* Providers */}
      <POMonthYearProvider>
        <ProfileContextProvider>
          <PODataProvider>
            <ProductDataProvider>
              <LoginContextProvider>
                {/* Until Here*/}
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
                        <InventoryPage />
                      </Sidebar>
                    } />
                  </Route>

                  <Route path='/' element={<ProtectedRoute />}>
                    <Route path='/purchase-order' element={
                      <Sidebar>
                        <PurchaseOrderPage />
                      </Sidebar>
                    } />
                  </Route>

                  <Route path='/' element={<ProtectedRoute />}>
                    <Route path='/new-purchase' element={
                      <Sidebar>
                        <NewPOPage />
                      </Sidebar>
                    } />
                  </Route>

                  <Route path='/' element={<ProtectedRoute />}>
                    <Route path='/settings' element={
                      <Sidebar>
                        <SettingPage />
                      </Sidebar>
                    } />
                  </Route>


                  <Route path='*' element={<NotFoundPage />} />

                </Routes>
              </LoginContextProvider>
            </ProductDataProvider>
          </PODataProvider>
        </ProfileContextProvider>
      </POMonthYearProvider>
    </BrowserRouter>
  );
}

export default App;
