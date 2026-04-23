import React, { useState, useEffect, useRef } from 'react';
import '../../public/style.css';
import '../../public/dashboard.css';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-container" style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem'}}>
      <header className="app-header" style={{background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(15px)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.5)', padding: '1.2rem 2.5rem', marginBottom: '3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)'}}>
        <div className="logo">
          <div className="blood-drop"></div>
          <h1 style={{fontSize: '1.7rem', fontWeight: 950, letterSpacing: '-1.2px', background: 'linear-gradient(135deg, #1e293b, #475569)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>LIFEBLOOD</h1>
        </div>
        
        <nav className={`main-nav ${mobileMenuOpen ? 'show-mobile' : ''}`}>
          <button className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => navigate('dashboard')}>DASHBOARD</button>
          <button className={`nav-btn ${currentView === 'requests' ? 'active' : ''}`} onClick={() => navigate('requests')}>NETWORK</button>
          <button className={`nav-btn ${currentView === 'donor' ? 'active' : ''}`} onClick={() => navigate('donor')}>DONATE</button>
          <button className={`nav-btn ${currentView === 'new-request' ? 'active' : ''}`} onClick={() => navigate('new-request')}>BROADCAST</button>
          <button className={`nav-btn ${currentView === 'map' ? 'active' : ''}`} onClick={() => navigate('map')}>MAP</button>
          <button className={`nav-icon-btn ${currentView === 'profile' ? 'active' : ''}`} onClick={() => navigate('profile')} style={{marginLeft: '1rem'}}>👤</button>
        </nav>
      </header>

      <main className="main-content">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'profile' && <ProfileView />}
        {currentView === 'map' && <MapView />}
        {currentView === 'requests' && <RequestsView />}
        {currentView === 'donor' && <DonorPortal />}
        {currentView === 'new-request' && <NewRequest />}
      </main>
    </div>
  );
}

function DashboardView() {
  useEffect(() => {
    // Stat Initialization
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        counter.innerText = '0';
        const updateCounter = () => {
            const target = +counter.getAttribute('data-target');
            const c = +counter.innerText.replace(/,/g, '');
            const increment = target / 50;
            if (c < target) {
                counter.innerText = Math.ceil(c + increment).toLocaleString();
                setTimeout(updateCounter, 20);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };
        updateCounter();
    });

    if (window.Chart) {
      window.Chart.defaults.color = '#64748b';
      window.Chart.defaults.font.family = 'Outfit';
      
      const elTrend = document.getElementById('trendChart');
      if (elTrend) {
          let chartStatus = window.Chart.getChart("trendChart"); 
          if (chartStatus != undefined) chartStatus.destroy();
          
          const ctxTrend = elTrend.getContext('2d');
          const gradientLine = ctxTrend.createLinearGradient(0, 0, 0, 400);
          gradientLine.addColorStop(0, 'rgba(255, 62, 62, 0.2)');
          gradientLine.addColorStop(1, 'rgba(255, 62, 62, 0.0)');
          new window.Chart(ctxTrend, {
              type: 'line',
              data: {
                  labels: ['W1', 'W2', 'W3', 'W4'],
                  datasets: [
                      {
                          label: 'Monthly Donations',
                          data: [8, 14, 11, 16],
                          borderColor: '#ff3e3e',
                          backgroundColor: gradientLine,
                          borderWidth: 3, tension: 0.4, fill: true,
                          pointBackgroundColor: '#ff3e3e',
                      }
                  ]
              },
              options: { 
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { labels: { color: '#8b949e' } } },
                  scales: { 
                    x: { grid: { display: false }, ticks: { color: '#8b949e' } },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b949e' } }
                  }
              }
          });
      }

      const elDist = document.getElementById('distributionChart');
      if (elDist) {
         let chartStatus2 = window.Chart.getChart("distributionChart"); 
         if (chartStatus2 != undefined) chartStatus2.destroy();

         new window.Chart(elDist.getContext('2d'), {
             type: 'doughnut',
             data: {
                 labels: ['O+', 'A+', 'B+', 'AB+', 'O-', 'Others'],
                 datasets: [{
                     data: [35, 25, 20, 10, 5, 5],
                     backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#cbd5e1'],
                     borderWidth: 0, hoverOffset: 10
                 }]
             },
             options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'right' } } }
         });
      }
    }
  }, []);

  return (
    <section className="view-section active">
        <div className="dashboard-header-flex">
            <h2>Analytics Overview</h2>
            <div className="search-bar">
                <i>🔍</i>
                <input type="text" placeholder="Search records..." />
            </div>
        </div>

        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-icon red">🩸</div>
                <div className="stat-details">
                    <h3 className="counter" data-target="12">0</h3>
                    <p>Verified Donors</p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon blue">🏥</div>
                <div className="stat-details">
                    <h3 className="counter" data-target="5">0</h3>
                    <p>Live Requests</p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon green">🧬</div>
                <div className="stat-details">
                    <h3 className="counter" data-target="42">0</h3>
                    <p>Stock Units</p>
                </div>
            </div>
        </div>

        <div className="charts-grid dashboard-charts-layout">
            <div className="glass-card chart-box">
                <div className="card-top" style={{marginBottom: 0}}>
                    <h3>Donation Trends</h3>
                </div>
                <div className="chart-container" style={{height: '250px', width: '100%', position: 'relative'}}>
                    <canvas id="trendChart"></canvas>
                </div>
            </div>
            <div className="glass-card chart-box">
                <div className="card-top" style={{marginBottom: 0}}>
                    <h3>Blood Groups</h3>
                </div>
                <div className="chart-container" style={{height: '250px', display: 'flex', justifyContent: 'center', position: 'relative'}}>
                    <canvas id="distributionChart"></canvas>
                </div>
            </div>
        </div>
    </section>
  );
}

function ProfileView() {
  const [donorData, setDonorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/donors');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        
        if (data && data.length > 0) {
            setDonorData(data[0]); // Grab the first donor naturally as a profile mockup
        } else {
            setDonorData(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <section className="view-section active"><div className="loading-state">Loading your profile...</div></section>;
  if (error) return <section className="view-section active"><div style={{color:'var(--accent-red)'}}>Error: {error}</div></section>;

  const donorName = donorData ? donorData.name : "Unregistered User";
  const donorId = donorData ? donorData.id.toString().padStart(5, '0') : "-----";
  const bloodType = donorData ? donorData.blood_type : "N/A";
  const isRegistered = !!donorData;

  return (
    <section className="view-section active">
        <div className="donor-dashboard-layout" style={{display: 'flex', flexDirection: 'column', gap: '2.5rem'}}>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem'}}>
                <div className="glass-card" style={{padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)'}}>
                    <div style={{width: '90px', height: '90px', background: 'rgba(55, 66, 250, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem'}}>👤</div>
                    <div>
                        <h3 style={{fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-1px', color: '#1e293b'}}>{donorName}</h3>
                        <p style={{color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1.5px'}}>Donor ID #{donorId}</p>
                    </div>
                </div>
                
                <div className="glass-card" style={{padding: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 71, 87, 0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)'}}>
                    <div>
                        <p style={{color: '#64748b', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1.5px', marginBottom: '0.5rem'}}>Type</p>
                        <h3 style={{fontSize: '3.5rem', fontWeight: 950, color: '#ff4757', lineHeight: 1}}>{bloodType}</h3>
                    </div>
                    <div style={{width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255, 71, 87, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4757', fontSize: '1.8rem'}}>🧬</div>
                </div>
            </div>

            <div className="glass-card" style={{padding: '3rem', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)'}}>
                 <div style={{display: 'flex', alignItems: 'center', gap: '2.5rem'}}>
                    <div style={{fontSize: '3.5rem', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.05))'}}>{isRegistered ? '🛡️' : '⚠️'}</div>
                    <div style={{flex: 1}}>
                        <h2 style={{fontSize: '2.2rem', fontWeight: 950, color: isRegistered ? '#1e293b' : '#ff4757', letterSpacing: '-1px', margin: 0}}>
                            {isRegistered ? 'Life-Saving Link Operational' : 'Action Required: Network Sync'}
                        </h2>
                        <p style={{color: '#64748b', fontWeight: 600, fontSize: '1.1rem', maxWidth: '600px', margin: '0.5rem 0 0 0'}}>
                            {isRegistered ? 'Your medical vitals are synced with the global network. You are eligible to donate.' : 'Please update your health declaration to activate your donor status.'}
                        </p>
                    </div>
                 </div>
            </div>
        </div>
    </section>
  );
}

function RequestsView() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/blood-requests/active');
            if(!res.ok) throw new Error('API failed.');
            const data = await res.json();
            setRequests(data);
        } catch(err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <section className="view-section active">
            <div className="section-header">
                <h2>Urgent Blood Requests</h2>
                <button className="icon-btn" onClick={fetchRequests} title="Refresh Latest">↻</button>
            </div>
            <div className="requests-grid">
                {loading && <div className="loading-state">Loading active requests...</div>}
                {error && <div style={{color:'var(--accent-red)'}}>Error: {error} (Ensure backend on port 3000 is running)</div>}
                {!loading && requests.length === 0 && !error && <div>No active emergency requests right now. Awesome!</div>}
                {!loading && requests.map(req => {
                    const isCritical = req.urgency_level >= 4;
                    return (
                        <div key={req.id} className="card glass-card request-card">
                            <div className="card-top">
                                <span className="blood-badge">{req.required_blood_type}</span>
                                <span className={`urgency-badge ${isCritical ? 'urgency-high' : 'urgency-low'}`}>
                                    {isCritical ? 'Critical' : 'Standard'}
                                </span>
                            </div>
                            <div className="patient-info" style={{marginBottom: '1rem'}}>
                                <h3>{req.patient_name}</h3>
                                <p>🏥 {req.hospital_name}</p>
                            </div>
                            <div style={{marginTop: 'auto', borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <span style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)'}}>Needed ASAP</span>
                                <button className="nav-btn btn-primary" style={{padding: '0.5rem 1rem', background: isCritical ? 'var(--accent-red)' : 'var(--accent-blue)', color: 'white', borderRadius: '8px'}}>Donate Now</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function MapView() {
    const mapRef = useRef(null);
    const [status, setStatus] = useState('Click "Find Near Me" to locate nearby real blood banks and donation camps...');

    useEffect(() => {
        if (!window.L) return;
        if (!mapRef.current) {
            mapRef.current = window.L.map('live-map').setView([20.5937, 78.9629], 5);
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapRef.current);
            window.markersLayer = window.L.layerGroup().addTo(mapRef.current);
        }
    }, []);

    const locateMe = () => {
        if ("geolocation" in navigator) {
            setStatus('Locating you...');
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                mapRef.current.setView([lat, lon], 14);
                window.L.marker([lat, lon]).addTo(mapRef.current).bindPopup('You are here').openPopup();
                fetchNearby(lat, lon);
            }, () => setStatus('Geolocation access denied.'));
        }
    }

    const fetchNearby = async (lat, lon) => {
        setStatus('Querying live data for real hospitals & blood banks nearby...');
        window.markersLayer.clearLayers();
        const query = `[out:json][timeout:25];(node["amenity"="hospital"](around:30000,${lat},${lon});node["healthcare"="blood_donation"](around:30000,${lat},${lon});node["amenity"="clinic"](around:30000,${lat},${lon}););out body;>;out skel qt;`;
        
        try {
            const res = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: query });
            const data = await res.json();
            const places = data.elements.filter(e => e.type === "node" && e.tags && e.tags.name);
            setStatus(`Found ${places.length} nearby medical centers.`);
            
            places.forEach(place => {
                const name = place.tags.name;
                const isBg = place.tags.healthcare === 'blood_donation';
                const type = isBg ? 'Blood Donation Center' : (place.tags.amenity === 'hospital' ? 'Hospital' : 'Clinic');
                const iconColor = isBg ? '#ff4757' : (type === 'Hospital' ? '#10b981' : '#3b82f6');
                
                const customIcon = window.L.divIcon({
                    className: 'custom-pin',
                    html: `<div style="background-color:${iconColor}; width:14px; height:14px; border-radius:50%; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.4);"></div>`,
                    iconSize: [18, 18]
                });

                window.L.marker([place.lat, place.lon], { icon: customIcon })
                    .bindPopup(`<strong>${name}</strong><br/><span>${type}</span>`)
                    .addTo(window.markersLayer);
            });
        } catch(e) {
            setStatus('Error connecting to map APIs.');
        }
    };

    return (
        <section className="view-section active">
            <div className="glass-card" style={{marginBottom: '1.5rem', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', flex: 1, minWidth: '250px'}}>
                    <span style={{fontSize: '1.2rem'}}>🔍</span>
                    <input type="text" placeholder="Search by Zip Code..." style={{border: 'none', background: 'transparent', outline: 'none', flex: 1, fontFamily: 'Outfit', fontSize: '1rem'}} />
                </div>
                <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(0,0,0,0.03)', padding: '0.3rem', borderRadius: '8px'}}>
                    <button className="nav-btn active" style={{padding: '0.5rem 1rem', borderRadius: '6px'}}>All Centers</button>
                    <button className="nav-btn" style={{padding: '0.5rem 1rem', borderRadius: '6px'}}>Hospitals Only</button>
                </div>
            </div>

            <div className="section-header">
                <h2>Live Blood Banks & Camps Near You</h2>
                <button onClick={locateMe} className="submit-btn" style={{width: 'auto', padding: '0.7rem 1.2rem', margin: 0}}>📍 Find Near Me</button>
            </div>
            
            <div className="glass-card" style={{padding: '1rem'}}>
                <div id="live-map" style={{height: '500px', width: '100%', borderRadius: '12px', zIndex: 1}}></div>
                <div style={{marginTop: '1rem', color: '#a0a0b0', fontSize: '0.9rem'}}>{status}</div>
            </div>
        </section>
    );
}

function DonorPortal() {
    return (
        <section className="view-section active">
            <div style={{maxWidth: '600px', margin: '0 auto'}}>
                <h2 style={{fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1.5px'}}>Join the Network</h2>
                <p style={{color: 'var(--text-secondary)', marginBottom: '2.5rem'}}>Become a verified life-saver in less than 60 seconds.</p>
                
                <div className="glass-card" style={{padding: '3rem', background: '#0d1117'}}>
                    <form className="retro-form" onSubmit={(e) => {
                        e.preventDefault();
                        alert("Securely transmitting data...");
                    }}>
                        <div className="form-group"><label>FULL NAME</label><input type="text" required placeholder="Ex: Jane Doe"/></div>
                        <div className="form-group"><label>BLOOD TYPE</label><select required><option>A+</option><option>O-</option></select></div>
                        <div style={{display: 'flex', gap: '2rem', marginBottom: '1.5rem'}}>
                            <div className="form-group" style={{flex: 1}}><label>AGE</label><input type="number" required min="18" max="65" placeholder="18-65"/></div>
                            <div className="form-group" style={{flex: 1}}><label>WEIGHT (KG)</label><input type="number" required min="50" placeholder="Min 50"/></div>
                        </div>
                        <div className="form-group" style={{background: 'rgba(255, 62, 62, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255, 62, 62, 0.1)'}}>
                            <label style={{color: 'var(--accent-red)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px'}}>⚕️ Health Clearance</label>
                            <label style={{fontSize: '0.85rem', lineHeight: '1.5', display: 'flex', gap: '0.8rem', cursor: 'pointer', color: '#8b949e'}}>
                                <input type="checkbox" required style={{width: 'auto', marginTop: '4px'}}/>
                                I declare I am fit for donation.
                            </label>
                        </div>
                        <button type="submit" className="submit-btn" style={{marginTop: '2rem', padding: '1.4rem'}}>COMPLETE REGISTRATION</button>
                    </form>
                </div>
            </div>
        </section>
    );
}

function NewRequest() {
    return (
        <section className="view-section active">
            <div style={{maxWidth: '600px', margin: '0 auto'}}>
                <h2 style={{fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1.5px'}}>Broadcast Emergency</h2>
                <p style={{color: 'var(--text-secondary)', marginBottom: '2.5rem'}}>Instantly alert the donor network to critical needs.</p>
                <div className="glass-card" style={{padding: '3rem', background: '#0d1117'}}>
                    <form className="retro-form">
                        <div className="form-group"><label>PATIENT NAME</label><input type="text" required placeholder="Ex: Alex Johnson"/></div>
                        <div className="form-group"><label>BLOOD TYPE</label>
                            <select required style={{width: '100%', padding: '0.9rem 0', background: 'transparent', border: 'none', borderBottom: '2px solid var(--border-color)', color: 'white', outline: 'none'}}>
                                <option value="" disabled selected>Select Blood Type</option>
                                <option value="A+">A+</option><option value="A-">A-</option>
                                <option value="B+">B+</option><option value="B-">B-</option>
                                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                <option value="O+">O+</option><option value="O-">O-</option>
                            </select>
                        </div>
                        <div className="form-group"><label>HOSPITAL BRANCH</label><input type="text" required placeholder="Branch Name"/></div>
                        <div className="form-group"><label>URGENCY LEVEL</label>
                            <div style={{display:'flex', gap:'1rem', marginTop:'0.5rem'}}>
                                {[1,2,3,4,5].map(lv => (
                                    <button key={lv} type="button" style={{flex:1, padding:'0.8rem', background: lv > 3 ? 'rgba(255,62,62,0.2)' : 'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color: lv > 3 ? 'var(--accent-red)' : 'white', fontWeight: 800}}>{lv}</button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="submit-btn danger-btn" style={{marginTop: '2rem', padding: '1.4rem'}}>INITIATE BROADCAST</button>
                    </form>
                </div>
            </div>
        </section>
    );
}
