class ImageGenerator {
    constructor() {
        this.isEnabled = false;
        this.setupControls();
    }

    setupControls() {
        this.dalleToggle = document.getElementById('dalle-mode');
        this.imageOptions = document.getElementById('image-options');
        this.sizeSelect = document.getElementById('image-size');
        this.qualitySelect = document.getElementById('image-quality');
        this.styleSelect = document.getElementById('image-style');
        this.imageBtn = document.getElementById('image-btn');

        // Event listeners
        this.dalleToggle.addEventListener('change', this.toggleImageGeneration.bind(this));
        this.imageBtn.addEventListener('click', this.openImagePrompt.bind(this));
    }

    toggleImageGeneration() {
        this.isEnabled = this.dalleToggle.checked;
        this.imageOptions.style.display = this.isEnabled ? 'block' : 'none';
        this.updateImageButton();
    }

    updateImageButton() {
        if (this.isEnabled) {
            this.imageBtn.style.display = 'flex';
            this.imageBtn.title = 'Generate Image with DALL-E 3';
        } else {
            this.imageBtn.style.display = 'none';
        }
    }

    openImagePrompt() {
        const prompt = window.prompt(
            'Enter a description for the image you want to generate:',
            'A beautiful landscape with mountains and a lake at sunset'
        );
        
        if (prompt && prompt.trim()) {
            this.generateImage(prompt.trim());
        }
    }

    async generateImage(prompt) {
        try {
            this.showLoading('Generating image...');

            const imageParams = {
                model: 'dall-e-3',
                prompt: prompt,
                size: this.sizeSelect.value,
                quality: this.qualitySelect.value,
                style: this.styleSelect.value,
                n: 1
            };

            // Use Puter.js to generate image
            const response = await puter.ai.image.generate(imageParams);
            
            if (response && response.data && response.data[0]) {
                const imageUrl = response.data[0].url;
                this.displayGeneratedImage(imageUrl, prompt);
            } else {
                throw new Error('No image data received');
            }

        } catch (error) {
            console.error('Image generation error:', error);
            this.showError('Failed to generate image: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    displayGeneratedImage(imageUrl, prompt) {
        // Create image message in chat
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai';
        
        const timestamp = this.formatTime(new Date());
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.5L14.5 12L19 18H5L8.5 13.5Z"/>
                </svg>
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="generated-image-container">
                        <p><strong>Generated Image:</strong> ${this.escapeHtml(prompt)}</p>
                        <img src="${imageUrl}" alt="Generated image" class="generated-image" onclick="window.open('${imageUrl}', '_blank')">
                        <div class="image-actions">
                            <button onclick="window.open('${imageUrl}', '_blank')" class="image-action-btn">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3M19 19H5V5H12V3H5C3.89 3 3 3.9 3 5V19A2 2 0 0 0 5 21H19A2 2 0 0 0 21 19V12H19V19Z"/>
                                </svg>
                                View Full Size
                            </button>
                            <button onclick="navigator.clipboard.writeText('${imageUrl}')" class="image-action-btn">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 21H8V7H19M19 5H8A2 2 0 0 0 6 7V21A2 2 0 0 0 8 23H19A2 2 0 0 0 21 21V7A2 2 0 0 0 19 5M16 1H4A2 2 0 0 0 2 3V17H4V3H16V1Z"/>
                                </svg>
                                Copy URL
                            </button>
                        </div>
                    </div>
                </div>
                <div class="message-meta">Generated at ${timestamp}</div>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        // Add CSS for image container if not exists
        this.addImageStyles();
    }

    addImageStyles() {
        if (document.getElementById('image-styles')) return;

        const style = document.createElement('style');
        style.id = 'image-styles';
        style.textContent = `
            .generated-image-container {
                max-width: 100%;
            }
            
            .generated-image {
                max-width: 400px;
                width: 100%;
                height: auto;
                border-radius: var(--radius-lg);
                border: 1px solid var(--border-primary);
                margin: var(--spacing-md) 0;
                cursor: pointer;
                transition: transform var(--transition-fast);
            }
            
            .generated-image:hover {
                transform: scale(1.02);
            }
            
            .image-actions {
                display: flex;
                gap: var(--spacing-sm);
                margin-top: var(--spacing-sm);
                flex-wrap: wrap;
            }
            
            .image-action-btn {
                display: flex;
                align-items: center;
                gap: var(--spacing-xs);
                padding: var(--spacing-xs) var(--spacing-sm);
                background: var(--bg-tertiary);
                border: 1px solid var(--border-primary);
                border-radius: var(--radius-sm);
                color: var(--text-secondary);
                font-size: 0.75rem;
                cursor: pointer;
                transition: all var(--transition-fast);
                text-decoration: none;
            }
            
            .image-action-btn:hover {
                background: var(--bg-accent);
                color: var(--text-primary);
                border-color: var(--accent-primary);
            }
            
            .image-action-btn svg {
                width: 0.875rem;
                height: 0.875rem;
            }
            
            @media (max-width: 768px) {
                .generated-image {
                    max-width: 100%;
                }
                
                .image-actions {
                    flex-direction: column;
                }
                
                .image-action-btn {
                    justify-content: center;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Utility methods
    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showLoading(message = 'Loading...') {
        const loadingOverlay = document.getElementById('loading-overlay');
        const loadingText = loadingOverlay?.querySelector('.loading-text');
        
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
        if (loadingText) {
            loadingText.textContent = message;
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    showError(message) {
        // Create error toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-error);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Check if image generation is available
    isImageGenerationEnabled() {
        return this.isEnabled;
    }

    // Get current image generation settings
    getImageSettings() {
        return {
            enabled: this.isEnabled,
            size: this.sizeSelect.value,
            quality: this.qualitySelect.value,
            style: this.styleSelect.value
        };
    }
}

// Export for global access
window.ImageGenerator = ImageGenerator;
