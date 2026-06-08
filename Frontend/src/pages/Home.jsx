export default function Home() {
  return (
    <div className="content-page">
      <div className="page-header">
        <h1>🏠 Home</h1>
        <p>Your health overview and wellness tips.</p>
      </div>

      <div className="info-cards">
        <div className="info-card">
          <div className="info-card-icon">💧</div>
          <h3>Stay Hydrated</h3>
          <p>Drink at least 8 glasses of water daily for optimal health.</p>
        </div>

        <div className="info-card">
          <div className="info-card-icon">🏃</div>
          <h3>Daily Exercise</h3>
          <p>Aim for 30 minutes of physical activity every day.</p>
        </div>

        <div className="info-card">
          <div className="info-card-icon">😴</div>
          <h3>Quality Sleep</h3>
          <p>Adults should get 7–9 hours of sleep per night.</p>
        </div>

        <div className="info-card">
          <div className="info-card-icon">🥗</div>
          <h3>Balanced Diet</h3>
          <p>Eat a variety of fruits, vegetables, and whole grains.</p>
        </div>
      </div>
    </div>
  );
}