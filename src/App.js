import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router and Routes
import { ThemeProvider } from '@mui/material';
import { theme } from "./theme";
import './App.css';
import Layout from "./shared/Layout";
import CompanyList from "./components/company/CompanyList";
import AddCompanyForm from "./components/company/AddCompanyForm";
import CompanyPage from "./components/items/ItemsList";
import Invoice from "./components/invoice/Invoice";
import InvoiceDetails from "./components/invoice/InvoiceDetails";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<CompanyList />} />
            <Route path="/add-company" element={<AddCompanyForm />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/invoice/your-invoice/:id" element={<InvoiceDetails />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
