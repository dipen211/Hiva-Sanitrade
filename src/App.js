import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CircularProgress, ThemeProvider } from '@mui/material';
import { theme } from "./theme";
import './App.css';
import Layout from "./shared/Layout";
import CompanyList from "./components/company/CompanyList";
import AddCompanyForm from "./components/company/AddCompanyForm";
import CompanyPage from "./components/items/ItemsList";
import Invoice from "./components/invoice/Invoice";
import InvoiceDetails from "./components/invoice/InvoiceDetails";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import ProductList from "./components/items/ProductsList";
import InvoiceList from "./components/invoice/InvoiceList";
import { GeneralContextProvider } from "./context/GeneralContext";

function App() {
  const domain = process.env.REACT_APP_AUTH_CLIENT_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH_CLIENT_CLIENT_ID;

  return (
    <ThemeProvider theme={theme}>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        cacheLocation="localstorage"
        useRefreshTokens={true}
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >
        <Router>
          <MainContent />
        </Router>
      </Auth0Provider>
    </ThemeProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  return children;
};

function MainContent() {
  return (
    <Routes>
      <Route path="/invoice/your-invoice/:id" element={<InvoiceDetails />} />

      <Route
        path="*"
        element={
          <ProtectedRoute>
            <GeneralContextProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<CompanyList />} />
                  <Route path="/add-company" element={<AddCompanyForm />} />
                  <Route path="/company/:id" element={<CompanyPage />} />
                  <Route path="/invoice" element={<Invoice />} />
                  <Route path="/invoice/:id" element={<Invoice />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/invoiceList" element={<InvoiceList />} />
                </Routes>
              </Layout>
            </GeneralContextProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
