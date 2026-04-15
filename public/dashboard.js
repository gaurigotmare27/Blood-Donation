document.addEventListener('DOMContentLoaded', () => {
    // 1. Animated Counters for Stat Cards
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        counter.innerText = '0';
        const updateCounter = () => {
            const target = +counter.getAttribute('data-target');
            const c = +counter.innerText.replace(/,/g, '');
            const increment = target / 50; // Speed of animation

            if (c < target) {
                counter.innerText = Math.ceil(c + increment).toLocaleString();
                setTimeout(updateCounter, 20);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };
        updateCounter();
    });

    // 2. Initialize Interactive Charts (Chart.js)
    Chart.defaults.color = '#8b949e';
    Chart.defaults.font.family = 'Outfit';

    // A. Trend Line Chart
    const ctxTrend = document.getElementById('trendChart').getContext('2d');
    
    // Create gradient for line chart
    const gradientLine = ctxTrend.createLinearGradient(0, 0, 0, 400);
    gradientLine.addColorStop(0, 'rgba(88, 166, 255, 0.5)');
    gradientLine.addColorStop(1, 'rgba(88, 166, 255, 0.0)');

    new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
            datasets: [
                {
                    label: 'Donations Received',
                    data: [120, 190, 150, 280, 220],
                    borderColor: '#58a6ff',
                    backgroundColor: gradientLine,
                    borderWidth: 3,
                    tension: 0.4, // Smooth curve
                    fill: true,
                    pointBackgroundColor: '#0a0c10',
                    pointBorderColor: '#58a6ff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 7
                },
                {
                    label: 'Urgent Requests',
                    data: [60, 110, 80, 130, 90],
                    borderColor: '#f85149',
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
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                tooltip: {
                    backgroundColor: 'rgba(20,20,22,0.95)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    cornerRadius: 8
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    beginAtZero: true
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });

    // B. Doughnut Chart
    const ctxDistribution = document.getElementById('distributionChart').getContext('2d');
    new Chart(ctxDistribution, {
        type: 'doughnut',
        data: {
            labels: ['O+', 'A+', 'B+', 'AB+', 'O-', 'Others'],
            datasets: [{
                data: [35, 25, 20, 10, 5, 5],
                backgroundColor: [
                    '#58a6ff', '#3fb950', '#bc8cff', '#d29922', '#f85149', '#8b949e'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: { boxWidth: 12, usePointStyle: true }
                },
                tooltip: {
                    backgroundColor: 'rgba(20,20,22,0.95)',
                    padding: 10,
                    cornerRadius: 8
                }
            }
        }
    });

    // 3. Interactive Data Table Logic
    const allRequests = [
        { id: 'REQ-01', patient: "Alexander Pierce", blood: "O-", hospital: "City General", date: "Today", status: "Urgent", statusClass: "status-urgent" },
        { id: 'REQ-02', patient: "Sarah Jenkins", blood: "A+", hospital: "Mercy Central", date: "Today", status: "Pending", statusClass: "status-pending" },
        { id: 'REQ-03', patient: "Michael Chang", blood: "AB-", hospital: "Memorial Hospital", date: "Yesterday", status: "Fulfilled", statusClass: "status-fulfilled" },
        { id: 'REQ-04', patient: "Emma Watson", blood: "B+", hospital: "Valley Health", date: "Yesterday", status: "Pending", statusClass: "status-pending" },
        { id: 'REQ-05', patient: "David Rodriguez", blood: "O+", hospital: "City General", date: "Oct 24", status: "Urgent", statusClass: "status-urgent" }
    ];

    const tableBody = document.getElementById('interactive-table');

    function renderTable(data) {
        tableBody.innerHTML = '';
        if(data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem;">No matching requests found.</td></tr>';
            return;
        }

        data.forEach(req => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div style="font-weight:600;">${req.patient}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${req.id}</div>
                </td>
                <td><span style="color:var(--accent-red); font-weight:700; font-size: 1.1rem;">${req.blood}</span></td>
                <td><i style="color:var(--text-muted);">🏥</i> ${req.hospital}</td>
                <td>${req.date}</td>
                <td><span class="status-capsule ${req.statusClass}">${req.status}</span></td>
                <td><button class="btn-action" onclick="alert('Viewing details for ${req.patient}...')">View</button></td>
            `;
            tableBody.appendChild(tr);
        });
    }

    renderTable(allRequests);

    // 4. Interactive Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Filter logic
            const filterType = e.target.getAttribute('data-filter');
            if (filterType === 'all') {
                renderTable(allRequests);
            } else if (filterType === 'urgent') {
                renderTable(allRequests.filter(r => r.status === 'Urgent'));
            } else if (filterType === 'pending') {
                renderTable(allRequests.filter(r => r.status === 'Pending'));
            }
        });
    });

    // 5. Global Search Bar
    const searchInput = document.getElementById('global-search');
    searchInput.addEventListener('keyup', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allRequests.filter(req => 
            req.patient.toLowerCase().includes(term) || 
            req.hospital.toLowerCase().includes(term) ||
            req.id.toLowerCase().includes(term) ||
            req.blood.toLowerCase().includes(term)
        );
        renderTable(filtered);
    });
});

// Custom inline hover effect function for HTML
window.triggerPulse = function(element) {
    const icon = element.querySelector('.stat-icon');
    if (icon) {
        icon.style.transform = 'scale(1.15) rotate(10deg)';
        setTimeout(() => icon.style.transform = '', 300);
    }
};
