document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('show-mobile');
        });
    }

    // Navigation
    const navBtns = {
        'dashboard': document.getElementById('btn-dashboard'),
        'requests': document.getElementById('btn-requests'),
        'donor': document.getElementById('btn-donor'),
        'new-request': document.getElementById('btn-new-request'),
        'map': document.getElementById('btn-map'),
        'profile': document.getElementById('btn-profile'),
        'system-mgmt': document.getElementById('btn-system-mgmt')
    };

    const views = {
        'dashboard': document.getElementById('view-dashboard'),
        'requests': document.getElementById('view-requests'),
        'donor': document.getElementById('view-donor'),
        'new-request': document.getElementById('view-new-request'),
        'map': document.getElementById('view-map'),
        'profile': document.getElementById('view-profile'),
        'system-mgmt': document.getElementById('view-system-mgmt')
    };

    function switchView(viewName) {
        Object.keys(navBtns).forEach(key => {
            navBtns[key].classList.remove('active');
            views[key].classList.remove('active');
        });
        navBtns[viewName].classList.add('active');
        views[viewName].classList.add('active');

        if (viewName === 'requests') {
            fetchRequests();
        } else if (viewName === 'dashboard') {
            if(!window.dashboardInitialized) initDashboard();
        } else if (viewName === 'profile') {
            fetchProfile();
        } else if (viewName === 'map') {
            if(!window.mapInitialized) setTimeout(initLiveMap, 100);
            else if(window.leafletMap) window.leafletMap.invalidateSize();
        }

        // Close mobile nav automatically on link click
        if (mainNav && mainNav.classList.contains('show-mobile')) {
            mainNav.classList.remove('show-mobile');
        }
    }

    Object.keys(navBtns).forEach(key => {
        navBtns[key].addEventListener('click', () => switchView(key));
    });

    // Fetch Active Requests
    const requestsContainer = document.getElementById('requests-container');
    const refreshBtn = document.getElementById('refresh-btn');

    async function fetchRequests() {
        requestsContainer.innerHTML = '<div class="loading-state">Loading active requests...</div>';
        try {
            const res = await fetch('/api/blood-requests/active');
            
            // If they are on 404/html page it might fail json parse
            if (!res.ok) throw new Error('API failed to return OK status.');
            
            const data = await res.json();
            
            if (data.length === 0) {
                requestsContainer.innerHTML = '<div style="color:var(--text-secondary); width:100%; grid-column: 1 / -1; text-align:center; padding: 3rem; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);">No active emergency requests right now. Awesome!</div>';
                return;
            }

            requestsContainer.innerHTML = data.map(req => {
                let urgencyClass = 'urgency-low';
                let urgencyText = 'Low Priority';
                if (req.urgency_level >= 4) {
                    urgencyClass = 'urgency-high';
                    urgencyText = `Critical (Lv ${req.urgency_level})`;
                } else if (req.urgency_level === 3) {
                    urgencyClass = 'urgency-med';
                    urgencyText = 'Moderate';
                }

                return `
                    <div class="card glass-card request-card">
                        <div class="card-top">
                            <span class="blood-badge">${req.required_blood_type}</span>
                            <span class="urgency-badge ${urgencyClass}">${urgencyText}</span>
                        </div>
                        <div class="patient-info" style="margin-bottom: 1rem;">
                            <h3>${req.patient_name}</h3>
                            <p>🏥 ${req.hospital_name}</p>
                        </div>
                        <div style="margin-top: auto; border-top: 1px dashed rgba(0,0,0,0.1); padding-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Needed ASAP</span>
                            <button class="nav-btn btn-primary" style="padding: 0.5rem 1rem; background: ${req.urgency_level >= 4 ? 'var(--accent-red)' : 'var(--accent-blue)'}; color: white; border-radius: 8px;">Donate Now</button>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (err) {
            requestsContainer.innerHTML = `<div style="color:var(--accent-red); grid-column: 1 / -1;">Error: ${err.message}. Make sure server.js is running.</div>`;
        }
    }

    refreshBtn.addEventListener('click', () => {
        const icon = refreshBtn;
        icon.style.transform = 'rotate(360deg)';
        fetchRequests().then(() => {
            setTimeout(() => icon.style.transform = '', 300);
        });
    });

    // Fetch Profile
    async function fetchProfile() {
        try {
            const res = await fetch('/api/donors');
            if (!res.ok) throw new Error('Failed to fetch donors');
            const data = await res.json();
            
            const profileView = document.getElementById('view-profile');
            if (data && data.length > 0) {
                const donor = data[0]; // grab the very first registered donor realistically
                const firstName = donor.name.split(' ')[0];
                
                // Name injections
                profileView.querySelector('.profile-summary h3').textContent = donor.name;
                profileView.querySelector('.profile-summary p').textContent = `Donor ID: #${donor.id.toString().padStart(5, '0')}`;
                profileView.querySelector('.dashboard-main-panel h2').textContent = `Welcome back, ${firstName}!`;
                
                // Blood type injection
                const bloodTypeEl = profileView.querySelector('.glass-card div[style*="var(--accent-red)"]');
                if(bloodTypeEl) bloodTypeEl.textContent = donor.blood_type;
                
                // Status injection
                const statusH2 = profileView.querySelector('h2[style*="#2ed573"]');
                if(statusH2) statusH2.textContent = 'ELIGIBLE TO DONATE';
            } else {
                profileView.querySelector('.profile-summary h3').textContent = 'Unregistered User';
                profileView.querySelector('.profile-summary p').textContent = 'Donor ID: #-----';
                profileView.querySelector('.dashboard-main-panel h2').textContent = 'Welcome back, friend!';
                const statusH2 = profileView.querySelector('h2[style*="#2ed573"]');
                if(statusH2) {
                    statusH2.textContent = 'NOT REGISTERED';
                    statusH2.style.color = '#ff4757';
                }
                const bloodTypeEl = profileView.querySelector('.glass-card div[style*="var(--accent-red)"]');
                if(bloodTypeEl) bloodTypeEl.textContent = 'N/A';
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Form Submissions
    const donorForm = document.getElementById('donor-form');
    const donorStatus = document.getElementById('donor-status');

    donorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        donorStatus.className = 'status-msg';
        
        const payload = {
            name: document.getElementById('donor-name').value,
            blood_type: document.getElementById('donor-blood-type').value,
            contact: document.getElementById('donor-contact').value,
            city: document.getElementById('donor-city').value,
            age: parseInt(document.getElementById('donor-age').value, 10),
            weight: parseInt(document.getElementById('donor-weight').value, 10),
            health_clearance: document.getElementById('donor-health').checked
        };

        try {
            const res = await fetch('/api/donors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || 'Failed to register');
            
            donorStatus.textContent = 'Donor registered successfully!';
            donorStatus.classList.add('success');
            donorForm.reset();
        } catch (err) {
            donorStatus.textContent = err.message;
            donorStatus.classList.add('error');
        }
    });

    const requestForm = document.getElementById('request-form');
    const requestStatus = document.getElementById('request-status');

    requestForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        requestStatus.className = 'status-msg';
        
        const payload = {
            patient_name: document.getElementById('req-patient').value,
            required_blood_type: document.getElementById('req-blood-type').value,
            hospital_name: document.getElementById('req-hospital').value,
            urgency_level: parseInt(document.getElementById('req-urgency').value, 10),
        };

        try {
            const res = await fetch('/api/blood-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || 'Failed to create request');
            
            requestStatus.textContent = 'Blood request submitted successfully!';
            requestStatus.classList.add('success');
            requestForm.reset();
        } catch (err) {
            requestStatus.textContent = err.message;
            requestStatus.classList.add('error');
        }
    });

    // Initial Fetch
    initDashboard(); // Initialize Dashboard first since it is default active
});

function initDashboard() {
    window.dashboardInitialized = true;
    
    // 1. Animated Counters for Stat Cards
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

    if(!document.getElementById('trendChart')) return;

    // 2. Initialize Interactive Charts (Chart.js)
    Chart.defaults.color = '#64748b';
    Chart.defaults.font.family = 'Outfit';

    const ctxTrend = document.getElementById('trendChart').getContext('2d');
    const gradientLine = ctxTrend.createLinearGradient(0, 0, 0, 400);
    gradientLine.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
    gradientLine.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
            datasets: [
                {
                    label: 'Donations Received',
                    data: [120, 190, 150, 280, 220],
                    borderColor: '#3b82f6',
                    backgroundColor: gradientLine,
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#3b82f6',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 7
                },
                {
                    label: 'Urgent Requests',
                    data: [60, 110, 80, 130, 90],
                    borderColor: '#ef4444',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', padding: 12, cornerRadius: 8, titleColor: '#fff', bodyColor: '#fff' } },
            scales: {
                y: { grid: { color: 'rgba(0, 0, 0, 0.05)' }, beginAtZero: true },
                x: { grid: { display: false } }
            }
        }
    });

    const ctxDistribution = document.getElementById('distributionChart').getContext('2d');
    new Chart(ctxDistribution, {
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

window.triggerPulse = function(element) {
    const icon = element.querySelector('.stat-icon');
    if (icon) {
        icon.style.transform = 'scale(1.15) rotate(10deg)';
        setTimeout(() => icon.style.transform = '', 300);
    }
};

// --- Real-time Map functionality using Leaflet and Overpass API ---
function initLiveMap() {
    window.mapInitialized = true;
    const mapStatus = document.getElementById('map-status');
    const locateBtn = document.getElementById('locate-me-btn');

    // Default to center of India
    const defaultCoords = [20.5937, 78.9629];
    let map = L.map('live-map').setView(defaultCoords, 5);
    window.leafletMap = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let userMarker;
    let markersLayer = L.layerGroup().addTo(map);

    locateBtn.addEventListener('click', () => {
        if ("geolocation" in navigator) {
            mapStatus.textContent = 'Locating you...';
            mapStatus.style.color = 'var(--text-color)';
            
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                if (userMarker) map.removeLayer(userMarker);
                userMarker = L.marker([lat, lon], {
                    icon: L.divIcon({
                        className: 'user-marker',
                        html: '<div style="background-color:#3b82f6; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 0 10px rgba(0,0,0,0.3);"></div>',
                        iconSize: [20, 20]
                    })
                }).addTo(map).bindPopup('You are here').openPopup();

                map.setView([lat, lon], 15);
                fetchNearbyCenters(lat, lon);
            }, () => {
                mapStatus.textContent = 'Geolocation access denied or failed. You can browse the map manually.';
                mapStatus.style.color = 'var(--accent-red)';
            }, { timeout: 10000 });
        } else {
            mapStatus.textContent = 'Geolocation is not supported by your browser.';
            mapStatus.style.color = 'var(--accent-red)';
        }
    });

    async function fetchNearbyCenters(lat, lon) {
        mapStatus.textContent = 'Querying live data for real hospitals & blood banks nearby...';
        markersLayer.clearLayers();

        // 30km radius for healthcare=blood_donation or amenity=hospital
        const query = `
            [out:json][timeout:25];
            (
              node["amenity"="hospital"](around:30000,${lat},${lon});
              node["healthcare"="blood_donation"](around:30000,${lat},${lon});
              node["amenity"="clinic"](around:30000,${lat},${lon});
            );
            out body;
            >;
            out skel qt;
        `;
        const overpassUrl = "https://overpass-api.de/api/interpreter";

        try {
            const response = await fetch(overpassUrl, {
                method: "POST",
                body: query
            });
            if(!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            
            const places = data.elements.filter(e => e.type === "node" && e.tags && e.tags.name);
            
            if (places.length === 0) {
                mapStatus.textContent = 'No hospitals/blood banks found within 30km in OpenStreetMap.';
                return;
            }

            mapStatus.textContent = `Found ${places.length} nearby medical centers.`;
            
            places.forEach(place => {
                const name = place.tags.name;
                const isBloodBank = place.tags.healthcare === 'blood_donation';
                const type = isBloodBank ? 'Blood Donation Center' : (place.tags.amenity === 'hospital' ? 'Hospital' : 'Clinic');
                const phone = place.tags.phone || place.tags['contact:phone'] || 'N/A';
                
                let iconColor = isBloodBank ? '#ff4757' : (type === 'Hospital' ? '#10b981' : '#3b82f6');
                
                const customIcon = L.divIcon({
                    className: 'custom-pin',
                    html: `<div style="background-color:${iconColor}; width:14px; height:14px; border-radius:50%; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.4);"></div>`,
                    iconSize: [18, 18]
                });

                L.marker([place.lat, place.lon], { icon: customIcon })
                    .bindPopup(`
                        <div style="font-family: 'Outfit'; padding: 5px;">
                            <strong style="font-size:1.1rem; color:#1e293b;">${name}</strong><br>
                            <span style="color:${iconColor}; font-weight:600; font-size:0.9rem;">${type}</span><br>
                            <span style="font-size:0.85rem; color:#64748b;">Phone: ${phone}</span><br>
                            <a href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}" target="_blank" style="display:inline-block; margin-top:8px; padding:4px 8px; background:#3b82f6; color:white; border-radius:4px; text-decoration:none; font-size:0.8rem;">Get Directions</a>
                        </div>
                    `)
                    .addTo(markersLayer);
            });
            
            // Keep map zoomed in tightly on the user's exact location
            map.setView([lat, lon], 14);

        } catch (error) {
            console.error("Overpass API error:", error);
            mapStatus.textContent = 'Error connecting to real-time map data. Try again later.';
            mapStatus.style.color = 'var(--accent-red)';
        }
    }
}

