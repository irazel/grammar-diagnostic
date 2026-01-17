// DOM Elements
const form = document.getElementById('diagnosticForm');
const progressBar = document.querySelector('.progress-bar');
const steps = document.querySelectorAll('.step');
const sections = document.querySelectorAll('.form-section');
const resultsModal = document.getElementById('resultsModal');
const feedbackContent = document.getElementById('feedbackContent');
let currentSection = 1;

// Session 0 data storage
const sessionData = {
    profile: {},
    audit: {},
    challenges: {},
    commitment: []
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set first section as active
    showSection(1);
    updateProgress();
    
    // Handle other context checkbox
    const otherCheckbox = document.getElementById('otherContextCheckbox');
    const otherInput = document.getElementById('otherContext');
    
    otherCheckbox.addEventListener('change', function() {
        if (this.checked) {
            otherInput.style.display = 'inline-block';
            otherInput.focus();
        } else {
            otherInput.style.display = 'none';
            otherInput.value = '';
        }
    });
});

// Navigation Functions
function showSection(sectionNumber) {
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === `section${sectionNumber}`) {
            section.classList.add('active');
        }
    });
    
    // Update progress steps
    steps.forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.dataset.step) <= sectionNumber) {
            step.classList.add('active');
        }
    });
    
    currentSection = sectionNumber;
    updateProgress();
}

function nextSection(next) {
    // Validate current section before proceeding
    if (validateCurrentSection()) {
        saveCurrentSectionData();
        showSection(next);
        window.scrollTo(0, 0);
    } else {
        alert('Please complete all required fields in this section.');
    }
}

function prevSection() {
    if (currentSection > 1) {
        showSection(currentSection - 1);
        window.scrollTo(0, 0);
    }
}

function updateProgress() {
    const progress = ((currentSection - 1) / 3) * 100;
    progressBar.style.width = `${progress}%`;
}

// Validation
function validateCurrentSection() {
    const currentSectionElement = document.getElementById(`section${currentSection}`);
    const requiredInputs = currentSectionElement.querySelectorAll('[required]');
    
    for (let input of requiredInputs) {
        if (!input.value && !input.checked) {
            // Highlight missing field
            input.style.borderColor = '#e74c3c';
            input.addEventListener('input', function() {
                this.style.borderColor = '#e9ecef';
            });
            return false;
        }
    }
    return true;
}

// Data Handling
function saveCurrentSectionData() {
    const formData = new FormData(form);
    
    switch(currentSection) {
        case 1:
            sessionData.profile = {
                experience: formData.get('experience'),
                context: formData.getAll('context'),
                classSize: formData.get('classSize'),
                levels: formData.getAll('levels')
            };
            break;
        case 2:
            sessionData.audit = {
                confidence: formData.get('confidence'),
                application: formData.get('application'),
                feedback: formData.get('feedback'),
                traditional: formData.get('traditional'),
                understanding: formData.get('understanding')
            };
            break;
        case 3:
            sessionData.challenges = {
                challengeTopic: formData.get('challengeTopic'),
                challengeReason: formData.get('challengeReason'),
                commonError: formData.get('commonError'),
                studentExample: formData.get('studentExample'),
                hope: formData.get('hope')
            };
            break;
        case 4:
            sessionData.commitment = formData.getAll('commitment');
            sessionData.email = formData.get('email');
            break;
    }
}

// Form Submission
// Form Submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateCurrentSection()) {
        saveCurrentSectionData();
        
        // ===== NETLIFY FORMS: Populate hidden fields =====
        populateHiddenFields(sessionData);
        
        // Submit to Netlify Forms
        submitToNetlify();
        
        // Then show feedback
        generateFeedback();
        showModal();
    }
});

function populateHiddenFields(data) {
    // Map your sessionData to hidden form fields
    document.querySelector('input[name="experience"]').value = data.profile.experience || '';
    document.querySelector('input[name="context"]').value = data.profile.context.join(', ') || '';
    document.querySelector('input[name="classSize"]').value = data.profile.classSize || '';
    document.querySelector('input[name="levels"]').value = data.profile.levels.join(', ') || '';
    document.querySelector('input[name="confidence"]').value = data.audit.confidence || '';
    document.querySelector('input[name="application"]').value = data.audit.application || '';
    document.querySelector('input[name="feedback"]').value = data.audit.feedback || '';
    document.querySelector('input[name="traditional"]').value = data.audit.traditional || '';
    document.querySelector('input[name="understanding"]').value = data.audit.understanding || '';
    document.querySelector('input[name="challengeTopic"]').value = data.challenges.challengeTopic || '';
    document.querySelector('input[name="challengeReason"]').value = data.challenges.challengeReason || '';
    document.querySelector('input[name="commonError"]').value = data.challenges.commonError || '';
    document.querySelector('input[name="studentExample"]').value = data.challenges.studentExample || '';
    document.querySelector('input[name="hope"]').value = data.challenges.hope || '';
    document.querySelector('input[name="commitment"]').value = data.commitment.join(', ') || '';
    document.querySelector('input[name="email"]').value = data.email || '';
}

function submitToNetlify() {
    // Create a hidden iframe or use fetch to submit
    // Option A: Simple form submission (recommended)
    const form = document.getElementById('diagnosticForm');
    
    // Create a FormData object
    const formData = new FormData(form);
    
    // Submit via fetch
    fetch('/', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Successfully submitted to Netlify Forms');
    })
    .catch(error => {
        console.error('Error submitting to Netlify:', error);
        // Optional: Save to localStorage as backup
        localStorage.setItem('diagnostic_backup', JSON.stringify(sessionData));
    });
}

// Feedback Generation
function generateFeedback() {
    const feedbackHTML = `
        <div class="feedback-section">
            <h3><i class="fas fa-user-graduate"></i> Your Teaching Profile</h3>
            <p>With <strong>${sessionData.profile.experience}</strong> of teaching experience in <strong>${sessionData.profile.context.join(', ')}</strong>, 
            you're well-positioned to transform your grammar instruction. Your work with <strong>${sessionData.profile.classSize}</strong> classes at 
            <strong>${sessionData.profile.levels.join(', ')}</strong> levels presents unique opportunities for application.</p>
            
            <div class="insight-card">
                <p><strong>Insight:</strong> Teachers with your profile often find the greatest impact comes from adapting explanations to class size. 
                We'll focus on scalable techniques in Session 10.</p>
            </div>
        </div>
        
        <div class="feedback-section">
            <h3><i class="fas fa-chart-bar"></i> Self-Audit Analysis</h3>
            <p>Your self-assessment reveals:</p>
            <ul>
                <li><strong>Grammar Confidence:</strong> ${getRatingText(sessionData.audit.confidence)}</li>
                <li><strong>Application Gap:</strong> ${getRatingText(sessionData.audit.application)} (students struggle with spontaneous use)</li>
                <li><strong>Feedback System:</strong> ${getRatingText(sessionData.audit.feedback)}</li>
            </ul>
            
            <div class="insight-card">
                <p><strong>Focus Area:</strong> ${parseInt(sessionData.audit.confidence) < 4 ? 'Building explanatory frameworks' : 
                'Enhancing application activities'} will be particularly valuable for you.</p>
            </div>
        </div>
        
        <div class="feedback-section">
            <h3><i class="fas fa-bullseye"></i> Your Grammar Challenges</h3>
            <p><strong>Primary Challenge:</strong> ${sessionData.challenges.challengeTopic}</p>
            <p><strong>Why it's hard:</strong> ${sessionData.challenges.challengeReason}</p>
            <p><strong>Common Student Error:</strong> "${sessionData.challenges.commonError}"</p>
            <p><strong>Your Hope:</strong> ${sessionData.challenges.hope}</p>
            
            <div class="insight-card">
                <p><strong>MasterClass Connection:</strong> Your challenge with <strong>${sessionData.challenges.challengeTopic}</strong> 
                will be directly addressed in ${getRelevantSession(sessionData.challenges.challengeTopic)}. 
                The error "${sessionData.challenges.commonError}" is a classic LATAM interference pattern we'll deconstruct.</p>
            </div>
        </div>
        
        <div class="feedback-section">
            <h3><i class="fas fa-lightbulb"></i> Personalized Recommendations</h3>
            <p>Based on your diagnostic, here are your pre-session actions:</p>
            <ol>
                <li><strong>Before Session 1:</strong> Bring 2-3 examples of "${sessionData.challenges.commonError}" from your students' work</li>
                <li><strong>During Sessions:</strong> Focus on ${getFocusArea(sessionData.audit)}</li>
                <li><strong>Practice Opportunity:</strong> Try one guided discovery activity with your ${sessionData.profile.levels[0]} class this week</li>
            </ol>
        </div>
    `;
    
    feedbackContent.innerHTML = feedbackHTML;
}

// Helper Functions
function getRatingText(rating) {
    const ratings = {
        '1': 'Low (We\'ll build this)',
        '2': 'Developing (We\'ll strengthen this)',
        '3': 'Moderate (We\'ll refine this)',
        '4': 'Strong (We\'ll leverage this)',
        '5': 'Excellent (You\'ll help others with this)'
    };
    return ratings[rating] || 'Not specified';
}

function getRelevantSession(topic) {
    const sessionMap = {
        'Present Perfect': 'Session 2 (The Logic of English Tenses)',
        'Articles': 'Session 4 (The LATAM Nightmare)',
        'Conditionals': 'Session 6 (Logic, Probability, and Real World Use)',
        'Modals': 'Session 3 (Modality: Degrees of Certainty)',
        'Tense System': 'Session 2 (The Logic of English Tenses)',
        'Passive Voice': 'Session 7 (Formal Register)'
    };
    return sessionMap[topic] || 'multiple sessions throughout the MasterClass';
}

function getFocusArea(audit) {
    const lowAreas = [];
    if (parseInt(audit.confidence) < 3) lowAreas.push('logic-based explanations');
    if (parseInt(audit.application) > 3) lowAreas.push('communicative practice design');
    if (parseInt(audit.feedback) < 3) lowAreas.push('error correction strategies');
    
    return lowAreas.length > 0 ? lowAreas.join(' and ') : 'advanced application techniques';
}

// Modal Functions
function showModal() {
    resultsModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    resultsModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Download Feedback
function downloadFeedback() {
    const feedbackText = `
Grammar MasterClass - Session 0 Diagnostic Feedback
===================================================

TEACHING PROFILE
----------------
Experience: ${sessionData.profile.experience}
Context: ${sessionData.profile.context.join(', ')}
Class Size: ${sessionData.profile.classSize}
Levels: ${sessionData.profile.levels.join(', ')}

SELF-AUDIT SUMMARY
------------------
Grammar Explanation Confidence: ${sessionData.audit.confidence}/5
Student Application Gap: ${sessionData.audit.application}/5
Feedback System: ${sessionData.audit.feedback}/5
Traditional Teaching Style: ${sessionData.audit.traditional}/5
Understanding of LATAM Errors: ${sessionData.audit.understanding}/5

YOUR KEY CHALLENGES
-------------------
Primary Teaching Challenge: ${sessionData.challenges.challengeTopic}
Reason: ${sessionData.challenges.challengeReason}
Common Student Error: ${sessionData.challenges.commonError}
Student Example: ${sessionData.challenges.studentExample}
Your Goal: ${sessionData.challenges.hope}

PERSONALIZED ACTION PLAN
------------------------
1. Pre-Session Preparation: Collect examples of "${sessionData.challenges.commonError}"
2. Focus Area: ${getFocusArea(sessionData.audit)}
3. Relevant MasterClass Session: ${getRelevantSession(sessionData.challenges.challengeTopic)}
4. First Application: Try one guided discovery activity this week

NEXT STEPS
----------
- Save this feedback for reference
- Join pre-session forum discussions
- Prepare questions for Session 1
- Session 1 starts: [Date]

Generated on: ${new Date().toLocaleDateString()}
    `;
    
    const blob = new Blob([feedbackText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Grammar-MasterClass-Diagnostic-Feedback.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Example Toggle
function toggleExamples() {
    const examples = document.getElementById('errorExamples');
    const button = document.querySelector('.example-toggle');
    
    if (examples.style.display === 'block') {
        examples.style.display = 'none';
        button.textContent = 'Show Examples';
    } else {
        examples.style.display = 'block';
        button.textContent = 'Hide Examples';
    }
}

// Custom Input for Challenge Topic
function showCustomInput(select, containerId) {
    const container = document.getElementById(containerId);
    if (select.value === 'other') {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
        container.querySelector('input').value = '';
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === resultsModal) {
        closeModal();
    }
});
