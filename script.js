// Ticket data with questions and answers
const ticketData = [
    // P1 Tickets (Critical)
    {
        id: "TKT-001",
        priority: "P1",
        title: "Database Server Down",
        description: "The main database server is completely unresponsive. All customer transactions are failing.",
        question: "What should be your FIRST action when the database server is down?",
        answers: [
            "Restart the application servers",
            "Check database server logs and attempt failover to backup",
            "Send notification to all customers about the outage",
            "Update the status page"
        ],
        correct: 1,
        explanation: "For P1 database issues, immediate failover to backup systems is critical to restore service quickly."
    },
    {
        id: "TKT-002",
        priority: "P1",
        title: "Payment Gateway Failure",
        description: "Payment processing is failing for all customers. Revenue is being lost every minute.",
        question: "How should you handle a complete payment gateway failure?",
        answers: [
            "Wait for the payment provider to fix the issue",
            "Immediately switch to backup payment processor and notify stakeholders",
            "Disable all payment options",
            "Ask customers to try again later"
        ],
        correct: 1,
        explanation: "P1 payment issues require immediate failover to backup systems to prevent revenue loss."
    },
    {
        id: "TKT-003",
        priority: "P1",
        title: "Security Breach Detected",
        description: "Unusual access patterns detected. Potential unauthorized access to customer data.",
        question: "What is the immediate response to a suspected security breach?",
        answers: [
            "Monitor the situation for more evidence",
            "Immediately isolate affected systems and activate incident response team",
            "Change all passwords tomorrow",
            "Send an email to the security team"
        ],
        correct: 1,
        explanation: "Security breaches require immediate isolation and incident response activation to prevent further damage."
    },

    // P2 Tickets (High)
    {
        id: "TKT-004",
        priority: "P2",
        title: "Website Loading Slowly",
        description: "Multiple customers reporting slow page load times. Performance has degraded significantly.",
        question: "How should you troubleshoot website performance issues?",
        answers: [
            "Restart all servers immediately",
            "Check server resources, database performance, and CDN status",
            "Ask customers to clear their browser cache",
            "Ignore it, it will resolve itself"
        ],
        correct: 1,
        explanation: "Performance issues require systematic checking of infrastructure components to identify bottlenecks."
    },
    {
        id: "TKT-005",
        priority: "P2",
        title: "Email System Outage",
        description: "Company email system is down. Internal and external communications are affected.",
        question: "What's the best approach for email system outages?",
        answers: [
            "Tell everyone to use personal email",
            "Check email server status, restart services, and implement temporary workarounds",
            "Wait until tomorrow to fix it",
            "Switch to a completely new email provider"
        ],
        correct: 1,
        explanation: "Email outages require quick diagnosis and temporary solutions while working on permanent fixes."
    },
    {
        id: "TKT-006",
        priority: "P2",
        title: "API Rate Limiting Issues",
        description: "Third-party API is rate limiting our requests, causing service disruptions.",
        question: "How should you handle API rate limiting problems?",
        answers: [
            "Keep making requests until it works",
            "Implement request queuing and contact API provider for limit increase",
            "Stop using the API completely",
            "Switch to a different API immediately"
        ],
        correct: 1,
        explanation: "Rate limiting requires implementing proper queuing mechanisms and negotiating with providers."
    },

    // P3 Tickets (Medium)
    {
        id: "TKT-007",
        priority: "P3",
        title: "User Interface Bug",
        description: "Button alignment is incorrect on the checkout page, but functionality works.",
        question: "How should UI bugs be prioritized and handled?",
        answers: [
            "Fix immediately, dropping all other work",
            "Schedule fix in next sprint, document workaround if needed",
            "Ignore it completely",
            "Ask users to use a different browser"
        ],
        correct: 1,
        explanation: "UI bugs should be scheduled appropriately while ensuring functionality isn't impacted."
    },
    {
        id: "TKT-008",
        priority: "P3",
        title: "Report Generation Slow",
        description: "Monthly reports are taking longer than usual to generate, but they complete successfully.",
        question: "What's the appropriate response to slow report generation?",
        answers: [
            "Stop generating reports",
            "Analyze query performance and optimize during maintenance window",
            "Tell users reports are no longer available",
            "Generate reports manually"
        ],
        correct: 1,
        explanation: "Performance optimization should be done during planned maintenance to avoid disrupting operations."
    },
    {
        id: "TKT-009",
        priority: "P3",
        title: "Feature Request",
        description: "Users requesting a new dashboard widget for better data visualization.",
        question: "How should feature requests be handled?",
        answers: [
            "Implement immediately without planning",
            "Evaluate requirements, estimate effort, and add to product backlog",
            "Reject all feature requests",
            "Tell users to use existing features"
        ],
        correct: 1,
        explanation: "Feature requests require proper evaluation and planning before implementation."
    },

    // P4 Tickets (Low)
    {
        id: "TKT-010",
        priority: "P4",
        title: "Documentation Update",
        description: "User manual needs updating to reflect recent feature changes.",
        question: "When should documentation updates be scheduled?",
        answers: [
            "Immediately, stopping all development work",
            "Schedule during low-priority work periods or assign to technical writers",
            "Never update documentation",
            "Ask users to figure it out themselves"
        ],
        correct: 1,
        explanation: "Documentation updates are important but can be scheduled during appropriate times."
    },
    {
        id: "TKT-011",
        priority: "P4",
        title: "Color Scheme Feedback",
        description: "Some users prefer a different color scheme for the dashboard.",
        question: "How should cosmetic feedback be handled?",
        answers: [
            "Change colors immediately for everyone",
            "Collect more feedback and consider for future UI improvements",
            "Ignore all cosmetic feedback",
            "Let each user customize everything"
        ],
        correct: 1,
        explanation: "Cosmetic changes should be evaluated with broader user feedback and planned appropriately."
    },
    {
        id: "TKT-012",
        priority: "P4",
        title: "Legacy System Cleanup",
        description: "Old unused code and files should be removed from the system.",
        question: "When should legacy system cleanup be performed?",
        answers: [
            "During critical system outages",
            "During planned maintenance windows with proper backup procedures",
            "Never clean up old code",
            "Remove everything immediately"
        ],
        correct: 1,
        explanation: "Legacy cleanup should be done carefully during maintenance windows with proper backups."
    }
];

let currentScore = 0;
let solvedTickets = 0;
let currentFilter = 'all';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderTickets();
    setupEventListeners();
});

function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.priority;
            renderTickets();
        });
    });

    // Modal close
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('ticketModal')) {
            closeModal();
        }
    });
}

function renderTickets() {
    const container = document.getElementById('ticketContainer');
    const filteredTickets = currentFilter === 'all' 
        ? ticketData 
        : ticketData.filter(ticket => ticket.priority === currentFilter);

    container.innerHTML = filteredTickets.map(ticket => `
        <div class="ticket ${ticket.priority.toLowerCase()} ${ticket.solved ? 'solved' : ''} ${ticket.correct !== undefined ? (ticket.correct ? 'correct' : 'incorrect') : ''}" 
             onclick="openTicket('${ticket.id}')">
            <div class="ticket-header">
                <span class="ticket-id">${ticket.id}</span>
                <span class="priority ${ticket.priority.toLowerCase()}">${ticket.priority}</span>
            </div>
            <div class="ticket-title">${ticket.title}</div>
            <div class="ticket-description">${ticket.description}</div>
            <div class="ticket-status">
                <span class="status ${ticket.solved ? 'solved' : 'open'}">
                    ${ticket.solved ? 'Solved' : 'Open'}
                </span>
                ${ticket.solved ? `<span>${ticket.correct ? '✅ Correct' : '❌ Incorrect'}</span>` : ''}
            </div>
        </div>
    `).join('');
}

function openTicket(ticketId) {
    const ticket = ticketData.find(t => t.id === ticketId);
    if (ticket.solved) return; // Don't open solved tickets

    const modal = document.getElementById('ticketModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="ticket-header">
            <span class="ticket-id">${ticket.id}</span>
            <span class="priority ${ticket.priority.toLowerCase()}">${ticket.priority}</span>
        </div>
        <h2>${ticket.title}</h2>
        <p><strong>Description:</strong> ${ticket.description}</p>
        
        <div class="question">
            <h3>${ticket.question}</h3>
            <div class="answers">
                ${ticket.answers.map((answer, index) => `
                    <button class="answer-btn" onclick="selectAnswer('${ticketId}', ${index})">
                        ${answer}
                    </button>
                `).join('')}
            </div>
        </div>
        
        <div id="feedback-${ticketId}" class="feedback">
            <!-- Feedback will appear here -->
        </div>
    `;

    modal.style.display = 'block';
}

function selectAnswer(ticketId, selectedIndex) {
    const ticket = ticketData.find(t => t.id === ticketId);
    const isCorrect = selectedIndex === ticket.correct;
    
    // Update ticket data
    ticket.solved = true;
    ticket.correct = isCorrect;
    
    // Update score
    if (isCorrect) {
        currentScore++;
    }
    solvedTickets++;
    
    // Update UI
    updateStats();
    
    // Show feedback
    const feedback = document.getElementById(`feedback-${ticketId}`);
    const answerButtons = document.querySelectorAll('.answer-btn');
    
    answerButtons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === ticket.correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    feedback.innerHTML = `
        <strong>${isCorrect ? 'Correct! 🎉' : 'Incorrect ❌'}</strong><br>
        ${ticket.explanation}
    `;
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.style.display = 'block';
    
    // Auto-close modal after 3 seconds
    setTimeout(() => {
        closeModal();
        renderTickets();
        
        // Check if all tickets are solved
        if (solvedTickets === ticketData.length) {
            showResults();
        }
    }, 3000);
}

function closeModal() {
    document.getElementById('ticketModal').style.display = 'none';
}

function updateStats() {
    document.getElementById('score').textContent = currentScore;
    document.getElementById('solved').textContent = solvedTickets;
}

function showResults() {
    document.getElementById('results').style.display = 'block';
    document.getElementById('finalScore').textContent = currentScore;
    document.getElementById('ticketContainer').style.display = 'none';
}

function resetChallenge() {
    // Reset all data
    currentScore = 0;
    solvedTickets = 0;
    currentFilter = 'all';
    
    // Reset ticket data
    ticketData.forEach(ticket => {
        ticket.solved = false;
        delete ticket.correct;
    });
    
    // Reset UI
    updateStats();
    document.getElementById('results').style.display = 'none';
    document.getElementById('ticketContainer').style.display = 'grid';
    
    // Reset filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-priority="all"]').classList.add('active');
    
    renderTickets();
}
