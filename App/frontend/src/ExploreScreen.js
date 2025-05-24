import React from 'react';
import './ExploreScreen.css';
import { fetchMarkets } from './api';

const countries = ['All', 'Ghana', 'Nigeria', 'South Africa', 'Niger', 'Kenya'];

const ExploreScreen = () => {
  const [selected, setSelected] = React.useState('All');
  const [search, setSearch] = React.useState('');
  const [markets, setMarkets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchMarkets()
      .then(data => {
        setMarkets(data.products || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filteredMarkets = markets.filter(m =>
    (selected === 'All' || m.country === selected) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.country.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="explore-container">Loading...</div>;

  return (
    <div className="explore-container">
      <div className="explore-search-row">
        <input
          className="explore-search"
          placeholder="Search by shop, country, or product"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="explore-filter-btn" aria-label="Filter">🔎</button>
      </div>
      <div className="explore-country-row">
        {countries.map(c => (
          <button
            key={c}
            className={`explore-country-btn${selected === c ? ' selected' : ''}`}
            onClick={() => setSelected(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="explore-market-list">
        {filteredMarkets.length === 0 && <div>No markets found.</div>}
        {filteredMarkets.map(m => (
          <div className="explore-market-card" key={m.id}>
            <img src={m.image || '/logo192.png'} alt={m.name} className="explore-market-img" />
            <div className="explore-market-info">
              <div className="explore-market-name">{m.name}</div>
              <div className="explore-market-country">{m.country}</div>
              <div className="explore-market-desc">{m.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreScreen;
