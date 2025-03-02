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
        
        // Parse markdown for bot messages
        if (sender === 'bot') {
            messageElement.innerHTML = `
                <div class="message-bubble markdown-content">
                    ${parseMarkdown(message)}
                </div>
            `;
        } else {
            messageElement.innerHTML = `
                <div class="message-bubble">
                    ${message}
                </div>
            `;
        }
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to parse markdown text to HTML
    function parseMarkdown(text) {
        // Handle headers
        text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        
        // Handle bold text
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Handle italic text
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Handle links
        text = text.replace(/\[([^\[]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Handle bullet lists
        text = text.replace(/^\* (.*$)/gm, '<li>$1</li>');
        text = text.replace(/<li>(.*)<\/li>/gm, function(match) {
            if (match.startsWith('<li>')) {
                return '<ul>' + match + '</ul>';
            }
            return match;
        });
        
        // Handle numbered lists
        text = text.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
        text = text.replace(/<li>(.*)<\/li>/gm, function(match, p1) {
            if (match.startsWith('<li>') && match.match(/\d+\./)) {
                return '<ol>' + match + '</ol>';
            }
            return match;
        });
        
        // Handle paragraphs
        text = text.replace(/^(?!<[h|ul|ol|li])(.*$)/gm, '<p>$1</p>');
        
        // Fix any duplicated list wrapper tags
        text = text.replace(/<\/ul>\s*<ul>/g, '');
        text = text.replace(/<\/ol>\s*<ol>/g, '');
        
        // Handle code blocks
        text = text.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
        
        // Handle inline code
        text = text.replace(/`(.*?)`/g, '<code>$1</code>');
        
        return text;
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
            // Check if API key is available
            if (!CONFIG.GEMINI_API_KEY) {
                console.error('API key is missing');
                return "I'm sorry, but I'm unable to process your request right now due to a configuration issue. Please try again later or contact support.";
            }
            
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
                const errorData = await response.text();
                console.error(`API request failed with status ${response.status}:`, errorData);
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
                console.error('Unexpected API response format:', data);
                throw new Error('Unexpected API response format');
            }
            
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Gemini API Error:', error);
            return "I'm sorry, but I encountered an error while processing your request. Please try again later.";
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
            return "I'm not sure I understand. Could you rephrase your question? Or contact us at info@mamidi.co.in or reach out to 9293725736.";
        }
    }
});
