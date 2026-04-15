document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navBtns = {
        'dashboard': document.getElementById('btn-dashboard'),
        'system-mgmt': document.getElementById('btn-system-mgmt'),
        'requests': document.getElementById('btn-requests'),
        'donor': document.getElementById('btn-donor'),
        'new-request': document.getElementById('btn-new-request')
    };

    const views = {
        'dashboard': document.getElementById('view-dashboard'),
        'system-mgmt': document.getElementById('view-system-mgmt'),
        'requests': document.getElementById('view-requests'),
        'donor': document.getElementById('view-donor'),
        'new-request': document.getElementById('view-new-request')
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
                        <div class="patient-info">
                            <h3>${req.patient_name}</h3>
                            <p>🏥 ${req.hospital_name}</p>
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

    const allRequests = [
        { patient: "Alexander Pierce", blood: "O-", hospital: "City General", status: "Urgent", statusClass: "status-urgent" },
        { patient: "Sarah Jenkins", blood: "A+", hospital: "Mercy Central", status: "Pending", statusClass: "status-pending" }
    ];
    const tableBody = document.getElementById('interactive-table');

    function renderTable(data) {
        tableBody.innerHTML = data.map(req => `
            <tr>
                <td style="font-weight:600;">${req.patient}</td>
                <td><span style="color:var(--accent-red); font-weight:700;">${req.blood}</span></td>
                <td><i style="color:var(--text-muted);">🏥</i> ${req.hospital}</td>
                <td><span class="status-capsule ${req.statusClass}">${req.status}</span></td>
            </tr>
        `).join('');
    }
    renderTable(allRequests);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const f = e.target.getAttribute('data-filter');
            if(f === 'all') renderTable(allRequests);
            else renderTable(allRequests.filter(r => r.status.toLowerCase() === f));
        });
    });

    document.getElementById('global-search').addEventListener('keyup', (e) => {
        const term = e.target.value.toLowerCase();
        renderTable(allRequests.filter(req => req.patient.toLowerCase().includes(term) || req.hospital.toLowerCase().includes(term)));
    });
}

window.triggerPulse = function(element) {
    const icon = element.querySelector('.stat-icon');
    if (icon) {
        icon.style.transform = 'scale(1.15) rotate(10deg)';
        setTimeout(() => icon.style.transform = '', 300);
    }
};
