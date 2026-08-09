import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const SettingsContext = createContext();

export function useSettings() {
  return useContext(SettingsContext);
}

const translations = {
  English: {
    "Dashboard": "Dashboard",
    "Explorer": "Explorer",
    "Analytics": "Analytics",
    "Payments": "Payments",
    "Security": "Security",
    "Terminal": "Terminal",
    "Profile": "Profile",
    "Settings": "Settings",
    "Treasury Balance": "Treasury Balance",
    "Add Funds": "Add Funds",
    "Transaction History": "Transaction History",
    "Send": "Send",
    "Receiver Address": "Receiver Address",
    "Amount": "Amount",
    "Recent Activity": "Recent Activity",
    "Platform & Security Settings": "Platform & Security Settings",
    "Logout": "Logout",
    "Home": "Home",
    "Portfolio Value": "Portfolio Value",
    "Pending Kyc": "Pending KYC",
    "Verified": "Verified",
    "Transfer Funds": "Transfer Funds",
    "Network Stats": "Network Stats",
    "Account Defaults": "Account Defaults",
    "Interface Language": "Interface Language",
    "Base Reporting Currency": "Base Reporting Currency"
  },
  Spanish: {
    "Dashboard": "Panel",
    "Explorer": "Explorador",
    "Analytics": "Analítica",
    "Payments": "Pagos",
    "Security": "Seguridad",
    "Terminal": "Terminal",
    "Profile": "Perfil",
    "Settings": "Ajustes",
    "Treasury Balance": "Saldo de Tesorería",
    "Add Funds": "Añadir Fondos",
    "Transaction History": "Historial de Transacciones",
    "Send": "Enviar",
    "Receiver Address": "Dirección del Receptor",
    "Amount": "Cantidad",
    "Recent Activity": "Actividad Reciente",
    "Platform & Security Settings": "Ajustes de Plataforma",
    "Logout": "Cerrar Sesión",
    "Home": "Inicio",
    "Portfolio Value": "Valor de la Cartera",
    "Pending Kyc": "KYC Pendiente",
    "Verified": "Verificado",
    "Transfer Funds": "Transferir Fondos",
    "Network Stats": "Estadísticas de Red",
    "Account Defaults": "Valores Predeterminados",
    "Interface Language": "Idioma de la Interfaz",
    "Base Reporting Currency": "Moneda de Reporte Base"
  },
  French: {
    "Dashboard": "Tableau de Bord",
    "Explorer": "Explorateur",
    "Analytics": "Analytique",
    "Payments": "Paiements",
    "Security": "Sécurité",
    "Terminal": "Terminal",
    "Profile": "Profil",
    "Settings": "Paramètres",
    "Treasury Balance": "Solde de Trésorerie",
    "Add Funds": "Ajouter des Fonds",
    "Transaction History": "Historique des Transactions",
    "Send": "Envoyer",
    "Receiver Address": "Adresse du Destinataire",
    "Amount": "Montant",
    "Recent Activity": "Activité Récente",
    "Platform & Security Settings": "Paramètres de Plateforme",
    "Logout": "Déconnexion",
    "Home": "Accueil",
    "Portfolio Value": "Valeur du Portefeuille",
    "Pending Kyc": "KYC en Attente",
    "Verified": "Vérifié",
    "Transfer Funds": "Transférer des Fonds",
    "Network Stats": "Statistiques Réseau",
    "Account Defaults": "Paramètres par Défaut",
    "Interface Language": "Langue de l'Interface",
    "Base Reporting Currency": "Devise de Base"
  },
  German: {
    "Dashboard": "Dashboard",
    "Explorer": "Entdecker",
    "Analytics": "Analytik",
    "Payments": "Zahlungen",
    "Security": "Sicherheit",
    "Terminal": "Terminal",
    "Profile": "Profil",
    "Settings": "Einstellungen",
    "Treasury Balance": "Treasury-Saldo",
    "Add Funds": "Geld Hinzufügen",
    "Transaction History": "Transaktionsverlauf",
    "Send": "Senden",
    "Receiver Address": "Empfängeradresse",
    "Amount": "Betrag",
    "Recent Activity": "Letzte Aktivität",
    "Platform & Security Settings": "Plattform",
    "Logout": "Abmelden",
    "Home": "Startseite",
    "Portfolio Value": "Portfoliowert",
    "Pending Kyc": "Ausstehendes KYC",
    "Verified": "Verifiziert",
    "Transfer Funds": "Geld Überweisen",
    "Network Stats": "Netzwerkstatistiken",
    "Account Defaults": "Kontostandards",
    "Interface Language": "Sprache der Benutzeroberfläche",
    "Base Reporting Currency": "Basiswährung für Berichte"
  }
};

const exchangeRates = {
  "USD": { rate: 1.0, symbol: "$", prefix: true },
  "EUR": { rate: 0.92, symbol: "€", prefix: false },
  "GBP": { rate: 0.79, symbol: "£", prefix: true },
  "JPY": { rate: 155.0, symbol: "¥", prefix: true },
  "ETH": { rate: 0.00028, symbol: "Ξ", prefix: true },
  "BTC": { rate: 0.000014, symbol: "₿", prefix: true },
  "USDC": { rate: 1.0, symbol: "USDC ", prefix: true },
  "USDT": { rate: 1.0, symbol: "USDT ", prefix: true },
  "AUD": { rate: 1.5, symbol: "A$", prefix: true },
  "CAD": { rate: 1.36, symbol: "C$", prefix: true },
  "CHF": { rate: 0.9, symbol: "CHF ", prefix: true },
  "CNY": { rate: 7.2, symbol: "¥", prefix: true },
  "INR": { rate: 83.5, symbol: "₹", prefix: true }
};

export function SettingsProvider({ children }) {
  const { user } = useAuth();
  
  const language = user?.language || "English";
  const currency = user?.currency || "USD";
  
  // Translation function
  const t = (key) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    if (translations["English"][key]) {
      return translations["English"][key];
    }
    return key;
  };

  // Currency Formatter function
  const formatCurrency = (amountInUSD) => {
    const config = exchangeRates[currency] || exchangeRates["USD"];
    const convertedAmount = amountInUSD * config.rate;
    
    let formattedNumber = convertedAmount.toLocaleString(undefined, {
      minimumFractionDigits: (currency === 'BTC' || currency === 'ETH') ? 4 : 2,
      maximumFractionDigits: (currency === 'BTC' || currency === 'ETH') ? 6 : 2
    });
    
    if (config.prefix) {
      return `${config.symbol}${formattedNumber}`;
    } else {
      return `${formattedNumber} ${config.symbol}`;
    }
  };

  const getExchangeRate = () => {
     return exchangeRates[currency]?.rate || 1.0;
  };
  
  const getCurrencySymbol = () => {
     return exchangeRates[currency]?.symbol || "$";
  }

  return (
    <SettingsContext.Provider value={{ t, formatCurrency, getExchangeRate, getCurrencySymbol, language, currency }}>
      {children}
    </SettingsContext.Provider>
  );
}
