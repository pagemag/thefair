// Question database
const questions = {
    P1: [
        {
            title: "Critical System Outage",
            description: "Customer reports that the entire application is down and they cannot access any features. Multiple users are affected and business operations have stopped.",
            answers: [
                "Ask the customer to restart their browser and try again",
                "Immediately escalate to the engineering team and post a status page update",
                "Schedule a call with the customer for next week to discuss the issue",
                "Send them a link to our FAQ section"
            ],
            correct: 1,
            explanation: "For P1 critical issues affecting multiple users, immediate escalation and transparent communication through status updates is essential."
        },
        {
            title: "Database Connection Failure",
            description: "Multiple customers reporting they cannot save their work due to database connection errors. The issue started 5 minutes ago.",
            answers: [
                "Tell customers to try again later",
                "Immediately alert the on-call engineer and investigate database status",
                "Create a knowledge base article about the issue",
                "Ask customers for more details about their setup"
            ],
            correct: 1,
            explanation: "Database issues affecting multiple customers require immediate technical intervention and alerting the on-call team."
        }
    ],
    P2: [
        {
            title: "Payment Processing Issue",
            description: "A customer cannot complete their subscription payment. They've tried multiple cards and browsers. Other payment features seem to be working.",
            answers: [
                "Ask them to try again tomorrow",
                "Check payment processor status and escalate to payments team if needed",
                "Suggest they contact their bank",
                "Offer them a free trial extension while investigating the issue"
            ],
            correct: 3,
            explanation: "For payment issues, provide immediate relief to the customer while investigating the root cause with the payments team."
        },
        {
            title: "Feature Not Working",
            description: "Customer reports that the export feature is not working properly. Files are being corrupted during export. This affects their daily workflow.",
            answers: [
                "Tell them to use a different browser",
                "Escalate to product team and provide a workaround if available",
                "Ask them to provide more screenshots",
                "Suggest they use a different feature instead"
            ],
            correct: 1,
            explanation: "High priority functional issues should be escalated to the product team while offering workarounds to minimize customer impact."
        }
    ],
    P3: [
        {
            title: "UI Display Issue",
            description: "Customer reports that some buttons appear misaligned on their dashboard. The functionality works but the appearance is unprofessional.",
            answers: [
                "Ignore it since functionality works",
                "Log the issue for the next design sprint and provide a temporary workaround",
                "Ask them to change their screen resolution",
                "Tell them it's a known issue with no timeline"
            ],
            correct: 1,
            explanation: "UI issues should be documented for future fixes while providing workarounds. Good communication about timelines is important."
        },
        {
            title: "Integration Question",
            description: "Customer wants to integrate our API with their CRM system but is having trouble understanding the documentation.",
            answers: [
                "Send them the documentation link again",
                "Schedule a technical call to walk through the integration process",
                "Tell them to hire a developer",
                "Suggest they use a different integration method"
            ],
            correct: 1,
            explanation: "For integration support, providing hands-on assistance helps ensure successful implementation and customer satisfaction."
        }
    ],
    P4: [
        {
            title: "Feature Request",
            description: "Customer would like to see dark mode added to the application. They mention it would improve their user experience during night work.",
            answers: [
                "Tell them it's not possible",
                "Thank them for the feedback and add it to the product roadmap for consideration",
                "Suggest they adjust their monitor brightness",
                "Ask them why they need dark mode"
            ],
            correct: 1,
            explanation: "Feature requests should be acknowledged positively and added to the product roadmap for evaluation by the product team."
        },
        {
            title: "General Inquiry",
            description: "New customer asking about best practices for organizing their workspace and maximizing productivity with our tool.",
            answers: [
                "Tell them to figure it out themselves",
                "Provide helpful resources and offer to schedule an onboarding session",
                "Send them a link to the user manual",
                "Ask them to contact sales instead"
            ],
            correct: 1,
            explanation: "General inquiries are opportunities to provide excellent customer service and ensure successful product adoption."
        }
    ]
};

// Game state
let currentPriority = '';
let currentQuestion = null;
let selectedAnswer = null;
let timer = null;
let timeLeft = 0;
let startTime = 0;
let totalTime = 0;

// Time limits in seconds
const timeLimits = {
    P1: 30,
    P2: 60,
    P3: 90,
    P4: 120
};

function startChallenge(priority) {
    currentPriority = priority;
    currentQuestion = getRandomQuestion(priority);
    selectedAnswer = null;
    
    // Set up timer
    totalTime = timeLimits[priority];
    timeLeft = totalTime;
    startTime = Date.now();
    
    // Update UI
    showPage('question-page');
    displayQuestion();
    startTimer();
}

function getRandomQuestion(priority) {
    const priorityQuestions = questions[priority];
    return priorityQuestions[Math.floor(Math.random() * priorityQuestions.length)];
}

function displayQuestion() {
    // Update priority badge
    const priorityBadge = document.getElementById('current-priority');
    priorityBadge.textContent = currentPriority;
    priorityBadge.className = `priority-badge ${currentPriority.toLowerCase()}-badge`;
    
    // Update ticket number
    document.getElementById('ticket-number').textContent = `Ticket #${Math.floor(Math.random() * 10000) + 1000}`;
    
    // Update question content
    document.getElementById('question-title').textContent = currentQuestion.title;
    document.getElementById('question-description').textContent = currentQuestion.description;
    
    // Display answers
    const answersList = document.getElementById('answers-list');
    answersList.innerHTML = '';
    
    currentQuestion.answers.forEach((answer, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        answerDiv.textContent = answer;
        answerDiv.onclick = () => selectAnswer(index);
        answersList.appendChild(answerDiv);
    });
    
    // Reset submit button
    document.getElementById('submit-btn').disabled = true;
}

function selectAnswer(index) {
    // Remove previous selection
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    document.querySelectorAll('.answer-option')[index].classList.add('selected');
    selectedAnswer = index;
    
    // Enable submit button
    document.getElementById('submit-btn').disabled = false;
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    const timerFill = document.getElementById('timer-fill');
    
    timer = setInterval(() => {
        timeLeft--;
        
        // Update timer display
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update timer bar
        const percentage = (timeLeft / totalTime) * 100;
        timerFill.style.width = `${percentage}%`;
        
        // Add warning classes
        if (timeLeft <= 10) {
            timerElement.classList.add('critical');
        } else if (timeLeft <= 20) {
            timerElement.classList.add('warning');
        }
        
        // Time's up
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitAnswer(true);
        }
    }, 1000);
}

function submitAnswer(timeUp = false) {
    clearInterval(timer);
    
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    // Show correct/incorrect answers
    document.querySelectorAll('.answer-option').forEach((option, index) => {
        if (index === currentQuestion.correct) {
            option.classList.add('correct');
        } else if (index === selectedAnswer && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    // Disable further interaction
    document.querySelectorAll('.answer-option').forEach(option => {
        option.onclick = null;
    });
    document.getElementById('submit-btn').style.display = 'none';
    
    // Show result after a delay
    setTimeout(() => {
        showResult(isCorrect, timeTaken, timeUp);
    }, 2000);
}

function showResult(isCorrect, timeTaken, timeUp) {
    showPage('result-page');
    
    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const resultExplanation = document.getElementById('result-explanation');
    
    if (timeUp) {
        resultIcon.textContent = '⏰';
        resultTitle.textContent = 'Time\'s Up!';
        resultMessage.textContent = 'You ran out of time to answer this support ticket.';
    } else if (isCorrect) {
        resultIcon.textContent = '✅';
        resultTitle.textContent = 'Excellent Support!';
        resultMessage.textContent = 'You provided the best response for this customer issue.';
    } else {
        resultIcon.textContent = '❌';
        resultTitle.textContent = 'Not Quite Right';
        resultMessage.textContent = 'That wasn\'t the best response for this situation.';
    }
    
    resultExplanation.textContent = currentQuestion.explanation;
    
    // Update stats
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    document.getElementById('time-taken').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('completed-priority').textContent = currentPriority;
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function goHome() {
    showPage('landing-page');
    resetGame();
}

function tryAgain() {
    startChallenge(currentPriority);
}

function resetGame() {
    clearInterval(timer);
    currentPriority = '';
    currentQuestion = null;
    selectedAnswer = null;
    timeLeft = 0;
    
    // Reset timer classes
    document.getElementById('timer').className = 'timer';
    
    // Reset submit button
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.style.display = 'block';
    submitBtn.disabled = true;
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    showPage('landing-page');
});
