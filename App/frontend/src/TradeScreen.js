import React, { useState, useEffect } from 'react';
import './TradeScreen.css';
import { fetchTradeOffers } from './api';

const TradeScreen = () => {
	const [tab, setTab] = useState('offers');
	const [offers, setOffers] = useState([]);
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		Promise.all([
			fetchTradeOffers('offers'),
			fetchTradeOffers('requests'),
		])
			.then(([offersData, requestsData]) => {
				setOffers(offersData || []);
				setRequests(requestsData || []);
				setLoading(false);
			})
			.catch(() => {
				setError('Could not load trade data');
				setLoading(false);
			});
	}, []);

	const activeList = tab === 'offers' ? offers : requests;

	return (
		<div className="trade-container">
			<div className="trade-tabs">
				<button
					className={`trade-tab${
						tab === 'offers' ? ' active' : ''
					}`}
					onClick={() => setTab('offers')}
				>
					Offers (For Sale)
				</button>
				<button
					className={`trade-tab${
						tab === 'requests' ? ' active' : ''
					}`}
					onClick={() => setTab('requests')}
				>
					Buyers' Requests
				</button>
			</div>
			<div className="trade-list">
				{loading && <div>Loading...</div>}
				{error && <div>{error}</div>}
				{!loading && !error && activeList.map((item) => (
					<div className="trade-card" key={item.id}>
						{item.image ? (
							<img
								src={item.image}
								alt={item.title}
								className="trade-card-img"
							/>
						) : (
							<div className="trade-card-img trade-card-img-placeholder">
								{tab === 'offers' ? '🛢️' : '📦'}
							</div>
						)}
						<div className="trade-card-info">
							<div className="trade-card-title">{item.title}</div>
							<div className="trade-card-details">{item.details}</div>
						</div>
						<button className="trade-card-cta">
							{tab === 'offers' ? 'Negotiate Now' : 'Submit Offer'}
						</button>
					</div>
				))}
			</div>
			<button className="trade-live-btn">🔴 Live Negotiation</button>
			{/* Trade Insights section will be added below */}
		</div>
	);
};

export default TradeScreen;
