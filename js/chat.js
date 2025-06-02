class ChatManager {
    constructor() {
        this.conversationHistory = [];
        this.maxHistoryLength = 20;
        this.currentModel = 'gpt-4o';
        this.isStreaming = false;
        this.autoScroll = true;
        this.streamResponses = true;
        
        // Initialize components
        this.latexManager = new LaTeXManager();
        this.fileHandler = new FileHandler();
        this.imageGenerator = new ImageGenerator();
        
        this.initializeElements();
        this.bindEvents();
        this.updateModelInfo();
    }

    initializeElements() {
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-btn');
        this.chatForm = document.getElementById('chat-form');
        this.modelSelect = document.getElementById('model-select');
        this.reasoningSection = document.getElementById('reasoning-section');
        this.reasoningToggle = document.getElementById('reasoning-mode');
        this.reasoningEffort = document.getElementById('reasoning-effort');
        this.modelStatus = document.getElementById('model-status');
        this.tokenCount = document.getElementById('token-count');
        this.modelIndicator = document.getElementById('model-indicator');
        this.latexBtn = document.getElementById('latex-btn');
        this.imageBtn = document.getElementById('image-btn');
    }

    bindEvents() {
        // Form submission
        this.chatForm.addEventListener('submit', this.handleSubmit.bind(this));

        // Input events
        this.chatInput.addEventListener('input', this.handleInputChange.bind(this));
        this.chatInput.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Model selection
        this.modelSelect.addEventListener('change', this.handleModelChange.bind(this));

        // Reasoning controls
        this.reasoningToggle.addEventListener('change', this.updateModelInfo.bind(this));
        this.reasoningEffort.addEventListener('change', this.updateModelInfo.bind(this));

        // Tool buttons
        this.latexBtn.addEventListener('click', () => this.latexManager.openModal());
        this.imageBtn.addEventListener('click', () => this.imageGenerator.openImagePrompt());

        // Auto-resize textarea
        this.chatInput.addEventListener('input', this.autoResizeTextarea.bind(this));
    }

    handleSubmit(e) {
        e.preventDefault();
        this.sendMessage();
    }

    handleInputChange() {
        this.updateSendButton();
        this.updateTokenCount();
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }

    handleModelChange() {
        this.currentModel = this.modelSelect.value;
        this.updateModelInfo();
    }

    updateModelInfo() {
        const modelInfo = ModelManager.getModelInfo(this.currentModel);
        if (!modelInfo) return;

        // Update reasoning section visibility
        if (modelInfo.supportsReasoning) {
            this.reasoningSection.style.display = 'block';
        } else {
            this.reasoningSection.style.display = 'none';
            this.reasoningToggle.checked = false;
        }

        // Update model badge
        const modelBadge = document.getElementById('model-badge');
        if (modelBadge) {
            modelBadge.textContent = modelInfo.badge === 'reasoning' ? 'Reasoning' : 'Standard';
            modelBadge.className = `model-badge ${modelInfo.badge}`;
        }

        // Update model description
        const modelDescription = document.getElementById('model-description');
        if (modelDescription) {
            modelDescription.textContent = modelInfo.description;
        }

        // Update status
        this.updateModelStatus();
    }

    updateModelStatus() {
        const modelInfo = ModelManager.getModelInfo(this.currentModel);
        if (!modelInfo) return;

        let status = `${modelInfo.name}`;
        
        if (modelInfo.supportsReasoning && this.reasoningToggle.checked) {
            const effort = this.reasoningEffort.value;
            const effortInfo = REASONING_EFFORTS[effort];
            status += ` • Reasoning (${effortInfo.name})`;
        } else {
            status += ` • ${modelInfo.type === 'reasoning' ? 'Reasoning' : 'Standard'}`;
        }
        
        status += ' • Ready';

        this.modelStatus.textContent = status;
        this.modelIndicator.textContent = modelInfo.name;
    }

    updateSendButton() {
        const hasText = this.chatInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasText || this.isStreaming;
    }

    updateTokenCount() {
        const text = this.chatInput.value;
        const approxTokens = Math.ceil(text.length / 4); // Rough estimation
        this.tokenCount.textContent = `${approxTokens} tokens`;
    }

    autoResizeTextarea() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 200) + 'px';
    }

    async sendMessage() {
        const userInput = this.chatInput.value.trim();
        if (!userInput || this.isStreaming) return;

        // Prepare message content
        let messageContent = userInput;

        // Add file content if uploaded
        if (this.fileHandler.hasUploadedFiles()) {
            messageContent += this.fileHandler.getFilesForPrompt();
        }

        // Add reasoning prompt if enabled
        const modelInfo = ModelManager.getModelInfo(this.currentModel);
        if (modelInfo.supportsReasoning && this.reasoningToggle.checked) {
            const effort = this.reasoningEffort.value;
            messageContent = `Please think step-by-step and provide detailed reasoning for your answer. Use ${effort} reasoning effort and show your thought process clearly.\n\n${messageContent}`;
        }

        // Clear input and display user message
        this.chatInput.value = '';
        this.autoResizeTextarea();
        this.updateSendButton();
        this.displayUserMessage(userInput);

        // Add to conversation history
        this.addToHistory('user', messageContent);

        // Show typing indicator and stream response
        this.showTypingIndicator();
        this.isStreaming = true;

        try {
            await this.streamAIResponse();
        } catch (error) {
            this.hideTypingIndicator();
            this.displayErrorMessage(error.message);
            console.error('Chat error:', error);
        } finally {
            this.isStreaming = false;
            this.updateSendButton();
            
            // Clear uploaded files
            if (this.fileHandler.hasUploadedFiles()) {
                this.fileHandler.removeFile();
            }
        }
    }

    async streamAIResponse() {
        try {
            const requestParams = {
                model: this.currentModel,
                stream: this.streamResponses
            };

            // Add reasoning parameters for supported models
            const modelInfo = ModelManager.getModelInfo(this.currentModel);
            if (modelInfo.supportsReasoning && this.reasoningToggle.checked) {
                requestParams.reasoning = {
                    effort: this.reasoningEffort.value
                };
            }

            // Send request to Puter.js
            const response = await puter.ai.chat(this.conversationHistory, requestParams);
            
            this.hideTypingIndicator();
            const messageElement = this.createAIMessageElement();
            
            let fullResponse = '';
            
            if (this.streamResponses) {
                // Stream the response
                for await (const part of response) {
                    const text = part.text || part.message?.content || part.content || '';
                    fullResponse += text;
                    this.updateAIMessage(messageElement, fullResponse);
                    
                    if (this.autoScroll) {
                        this.scrollToBottom();
                    }
                }
            } else {
                // Handle non-streaming response
                fullResponse = response.message?.content || response.content || response.text || '';
                this.updateAIMessage(messageElement, fullResponse);
            }

            // Add complete response to history
            if (fullResponse) {
                this.addToHistory('assistant', fullResponse);
                this.updateTokenInfo(response.usage || {});
            }

        } catch (error) {
            this.hideTypingIndicator();
            throw error;
        }
    }

    displayUserMessage(content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user message-enter';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4A4 4 0 0 1 16 8A4 4 0 0 1 12 12A4 4 0 0 1 8 8A4 4 0 0 1 12 4M12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z"/>
                </svg>
            </div>
            <div class="message-content">
                <div class="message-bubble">${this.processMessageContent(content)}</div>
                <div class="message-meta">${this.formatTime(new Date())}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        if (this.autoScroll) {
            this.scrollToBottom();
        }
    }

    createAIMessageElement() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai message-enter';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L19 7L14.74 12L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12L5 7L10.91 8.26L12 2Z"/>
                </svg>
            </div>
            <div class="message-content">
                <div class="message-bubble"></div>
                <div class="message-meta">${this.formatTime(new Date())}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        return messageDiv;
    }

    updateAIMessage(messageElement, content) {
        const bubble = messageElement.querySelector('.message-bubble');
        bubble.innerHTML = this.processMessageContent(content);
    }

    processMessageContent(content) {
        // Process LaTeX
        content = this.latexManager.parseAndRenderMessage(content);
        
        // Process markdown-like formatting
        content = this.formatMarkdown(content);
        
        return content;
    }

    formatMarkdown(text) {
        // Bold text
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic text
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Inline code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Code blocks
        text = text.replace(/``````/g, (match, language, code) => {
            return `<pre><code class="language-${language || ''}">${this.escapeHtml(code.trim())}</code></pre>`;
        });
        
        // Line breaks
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L19 7L14.74 12L19 17L13.09 15.74L12 22L10.91 15.74L5 17L9.26 12L5 7L10.91 8.26L12 2Z"/>
                </svg>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;

        this.chatMessages.appendChild(typingDiv);
        if (this.autoScroll) {
            this.scrollToBottom();
        }
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    displayErrorMessage(error) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai error message-enter';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 13H11V7H13M13 17H11V15H13M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2Z"/>
                </svg>
            </div>
            <div class="message-content">
                <div class="message-bubble" style="background: var(--accent-error); color: white;">
                    <strong>Error:</strong> ${this.escapeHtml(error)}
                </div>
                <div class="message-meta">${this.formatTime(new Date())}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        if (this.autoScroll) {
            this.scrollToBottom();
        }
    }

    addToHistory(role, content) {
        this.conversationHistory.push({ role, content });
        
        // Limit history
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
        }
    }

    clearChat() {
        // Remove all messages except welcome screen
        const messages = this.chatMessages.querySelectorAll('.message');
        messages.forEach(msg => msg.remove());
        
        this.conversationHistory = [];
        this.tokenCount.textContent = '0 tokens';
        this.updateModelStatus();
    }

    exportChat() {
        const messages = this.conversationHistory;
        const exportData = {
            timestamp: new Date().toISOString(),
            model: this.currentModel,
            messages: messages
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    // Utility methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    updateTokenInfo(usage) {
        if (usage.total_tokens) {
            this.tokenCount.textContent = `${usage.total_tokens} tokens used`;
            if (usage.output_tokens_details?.reasoning_tokens) {
                this.tokenCount.textContent += ` (${usage.output_tokens_details.reasoning_tokens} reasoning)`;
            }
        }
    }

    // Settings
    setMaxHistory(count) {
        this.maxHistoryLength = Math.max(5, Math.min(100, count));
    }

    setAutoScroll(enabled) {
        this.autoScroll = enabled;
    }

    setStreamResponses(enabled) {
        this.streamResponses = enabled;
    }
}

// Export for global access
window.ChatManager = ChatManager;
