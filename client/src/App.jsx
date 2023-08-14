import { Navbar, Welcome, Footer, Services, Transactions, CryptoPrices } from "./components";
import RupeeToEtherConverter from "./components/RupeeToEtherConverter";

const App = () => (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <Navbar />
       <Welcome />
    </div>
    <section id="market">
     <CryptoPrices />
    </section>
    {/* <CryptoChart /> */}
    {/* <TypedCharts /> */}
    <section id="converter">
      <RupeeToEtherConverter />
    </section>
    <Services />
    <section id="transactions">
      <Transactions />
    </section>
    <Footer />
  </div>
);

export default App;