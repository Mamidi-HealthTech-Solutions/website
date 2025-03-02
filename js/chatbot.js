document.addEventListener('DOMContentLoaded', function() {
    // Initial messages
    const initialMessage = "Hello! I'm HealthBot. How can I assist you today?";
    
    // Chat toggle functionality
    document.getElementById('chat-toggle').addEventListener('click', function() {
        const chatbox = document.getElementById('chatbox');
        chatbox.classList.toggle('show');
        
        // Initialize chat if it's being opened for the first time
        if (chatbox.classList.contains('show') && !document.querySelector('.chat-message')) {
            setTimeout(() => {
                appendMessage('bot', initialMessage);
            }, 300);
        }
    });
    
    // Close button functionality
    document.getElementById('close-chat').addEventListener('click', function() {
        document.getElementById('chatbox').classList.remove('show');
    });
    
    // Send message functionality
    document.getElementById('send-btn').addEventListener('click', sendMessage);
    document.getElementById('user-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Function to send message
    function sendMessage() {
        const userInput = document.getElementById('user-input');
        const userMessage = userInput.value.trim();
        
        if (userMessage !== '') {
            appendMessage('user', userMessage);
            userInput.value = '';
            
            // Show loading indicator
            showLoadingIndicator();
            
            // Get response from Gemini API
            getGeminiResponse(userMessage)
                .then(response => {
                    hideLoadingIndicator();
                    appendMessage('bot', response);
                })
                .catch(error => {
                    console.error('Error getting response from Gemini:', error);
                    hideLoadingIndicator();
                    // Fallback to local response if API fails
                    const fallbackResponse = getFallbackResponse(userMessage);
                    appendMessage('bot', fallbackResponse);
                });
        }
    }
    
    // Function to append message to chat
    function appendMessage(sender, message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender + '-message');
        messageElement.innerHTML = `
            <div class="message-bubble">
                ${message}
            </div>
        `;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to show loading indicator
    function showLoadingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        const loadingElement = document.createElement('div');
        loadingElement.classList.add('chat-message', 'bot-message', 'loading-message');
        loadingElement.innerHTML = `
            <div class="message-bubble">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        loadingElement.id = 'loading-indicator';
        chatMessages.appendChild(loadingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to hide loading indicator
    function hideLoadingIndicator() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }
    
    // Function to get response from Gemini API
    async function getGeminiResponse(message) {
        try {
            const apiUrl = `${CONFIG.GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are Healthbot, a helpful healthcare assistant for Mamidi, a company that develops AI-powered solutions for rare disease diagnosis. 
Our Services:
Rare Disease Diagnosis: Comprehensive AI-powered solutions for rare disease diagnosis and management
Personalized Genomic Analysis: Advanced AI-driven analysis of genetic data to identify rare disease markers and variants specific to each patient.
Genetic Risk Assessment: Comprehensive evaluation of genetic predispositions and risk factors for rare diseases.
Pharmacogenomic Consultation: Personalized medication recommendations based on genetic profile analysis.
Epigenetic Risk Analysis: Analysis of environmental factors and their impact on gene expression in rare diseases.
Hereditary Disease Screening: Comprehensive screening for inherited genetic conditions and rare diseases.
Precision Oncology Support: AI-powered analysis for targeted cancer treatment based on genetic profiles.

If someone has anyt other questions about services or pricing, please ask them to contact us at info@mamidi.co.in or reach out to 9293725736.

Please do not answer anything that is not related to the above services.
                            Please format as markdown and answer the following question concisely: ${message}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.4,
                        maxOutputTokens: 800
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }
    
    // Simple response generator as fallback
    function getFallbackResponse(message) {
        message = message.toLowerCase();
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! How can I help you today?";
        }
        else if (message.includes('service') || message.includes('offer')) {
            return "We offer various AI-powered healthcare solutions for rare disease diagnosis. Check our Services page for more details!";
        }
        else if (message.includes('contact') || message.includes('reach') || message.includes('support')) {
            return "You can reach us at info@mamidi.co.in or visit our Contact page to send us a message.";
        }
        else if (message.includes('about') || message.includes('company') || message.includes('who are you')) {
            return "Mamidi HealthTech develops AI-powered solutions to transform rare disease diagnosis, making it faster, more accurate, and affordable.";
        }
        else if (message.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with?";
        }
        else {
            return "I'm not sure I understand. Could you rephrase your question? Or you can check our FAQ section for more information.";
        }
    }
});
