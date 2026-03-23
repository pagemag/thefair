// Question database
const questions = {
    P1: [
        {
            title: "Urgent License issue",
            description: "Customer - URGENT: We restarted our Tyk Dashboard and Gateway nodes this morning for routine OS patching, and now the Dashboard is completely inaccessible. The Gateway is also refusing to start up. The logs are repeatedly printing License expired. All our APIs are down!",
            answers: [
                "A) The Redis database has been flushed and lost all data.",
                "B) The Tyk Enterprise license key has passed its expiration date.",
                "C) The Gateway is using the wrong MongoDB connection string.",
                "D) The API keys for all users have expired simultaneously."
            ],
            correct: 2,
            explanation: "Tyk Enterprise components require a valid license key to operate. If the license expires, the Dashboard will become inaccessible and the Gateway will refuse to start up. The immediate fix is to obtain a renewed license key from your Tyk Account Manager and update the configuration files (tyk_analytics.conf and tyk.conf)."
        },
        {
            title: "Architecture & Performance",
            description: "URGENT: All our APIs are suddenly experiencing 5000ms+ latency and random 500 errors. Upstream services are fine (responding in 50ms). Gateway logs are flooded with 'Redis connection timeout'.",
            answers: [
                "A) The upstream server is throttling Tyk.",
                "B) Redis is saturated or OOM, causing Tyk's rate-limiting and token-checking operations to block.",
                "C) The Dashboard is down, so the Gateway paused traffic.",
                "D) Tyk Pump is deleting keys from Redis too quickly."
            ],
            correct: 2,
            explanation: "Tyk Gateway relies heavily on Redis for token validation, rate limiting, and quotas on every single request. If Redis becomes a bottleneck, runs out of memory, or network latency to Redis spikes, it directly impacts the Gateway's request processing time, leading to high latency and timeouts for all API calls."
        }
    ],
    P2: [
        {
            title: "Endpoint Security & Routing",
            description: "Hi Support, we have an API with 10 endpoints. We added an 'Allow List' (White-list) rule to 9 of them because we wanted to restrict them to specific IP ranges. We intentionally left the 10th endpoint (/status) alone because it should be completely public. But now, whenever anyone calls /status, Tyk returns a '403 Forbidden' error. We didn't add a block list to it, so why is it failing?",
            answers: [
                "A) The /status endpoint requires a mock response plugin to function alongside secured endpoints.",
                "B) The API is in Keyless mode, which automatically disables unlisted endpoints.",
                "C) Defining an Allow List on an API implicitly blocks all endpoints that are not explicitly on the list.",
                "D) The Gateway's Redis cache has stale routing data and needs to be flushed."
            ],
            correct: 3,
            explanation: "C. In Tyk, the Allow List (White-list) middleware operates at the API level. Once you add an Allow List rule to any endpoint, the API's routing shifts from a 'default allow' to a 'default deny' posture. Any endpoint not explicitly added to the Allow List will be automatically blocked by the Gateway, even if it has no plugins attached to it."
        },
        {
            title: "Gateway Configuration",
            description: "We updated an API definition in the Dashboard to change the target URL, but the Gateway isn't picking up the changes. We waited 5 minutes. The Gateway logs show 'Failed to load API'.",
            answers: [
                "A) The Gateway node is not connected to the Dashboard.",
                "B) The API definition contains an invalid listen path that conflicts with another active API.",
                "C) The Gateway needs a hard restart to pick up Dashboard changes.",
                "D) The Dashboard license is invalid."
            ],
            correct: 2,
            explanation: "B. If an updated API has a listen path that exactly matches another active API, the Gateway will fail to load it during the hot reload process to prevent routing conflicts. It logs an error and keeps the old, working configuration running in memory."
        }
    ],
    P3: [
        {
            title: "Authentication",
            description: "We generated a standard Tyk auth token via the Dashboard, but when we pass it in the Authorization header to our new billing API, the gateway returns 'Key not authorized'.",
            answers: [
                "A) The token was generated with Access Rights for a different API ID.",
                "B) The Gateway is offline.",
                "C) The token needs to be base64 encoded before being sent.",
                "D) The API is set to Open (Keyless) mode."
            ],
            correct: 1,
            explanation: "A. Tyk tokens are bound to specific APIs via their Access Rights. If a token is generated for the 'Inventory API', the gateway will reject it with 'Key not authorized' if the user attempts to use it against the 'Billing API'."
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
                "A) Tell them it's not possible",
                "B) Thank them for the feedback, check if Feature Request already exist if not create a new one  ",
                "C) Suggest they adjust their monitor brightness",
                "D) Ask them why they need dark mode"
            ],
            correct: 2,
            explanation: "B) Feature requests should be acknowledged positively and added to the product roadmap for evaluation by the product team."
        },
        {
            title: "Developer Portal",
            description: "Hi Support, a new developer is trying to log into our Tyk Developer Portal but they keep getting a 'Developer not found' error. They just filled out the registration form 5 minutes ago."",
            answers: [
                "A) The portal database is currently down.",
                "B) The developer hasn't clicked the email verification link yet.",
                "C) The Tyk Gateway needs a restart to sync portal users.",
                "D) The developer's IP address is blocked by the Gateway."
            ],
            correct: 2,
            explanation: "B. In Tyk, newly registered developers must verify their email address before their account becomes active. Until the verification link is clicked, the portal will not recognize their login attempts."
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
