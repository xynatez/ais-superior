class AIApp {
    constructor() {
        this.chatManager = null;
        this.settings = this.loadSettings();
        this.theme = this.settings.theme || 'dark';
        
        this.initializeApp();
    }

    async initializeApp() {
        try {
            // Wait for Puter.js to load
            await this.waitForPuter();
            
            // Initialize chat manager
            this.chatManager = new ChatManager();
            
            // Setup UI
            this.setupUI();
            this.setupSettings();
            this.setupTheme();
            
            // Apply saved settings
            this.applySettings();
            
            console.log('AI Chat Studio initialized successfully');
            
            // Show connection status
            this.updateConnectionStatus('connected');
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.updateConnectionStatus('disconnected');
        }
    }

    async waitForPuter() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50;
            
            const checkPuter = () => {
                if (typeof puter !== 'undefined') {
                    resolve();
                } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(checkPuter, 100);
                } else {
                    reject(new Error('Puter.js failed to load'));
                }
            };
            
            checkPuter();
        });
    }

    setupUI() {
        // Mobile menu
        this.setupMobileMenu();
        
        // Quick actions
        this.setupQuickActions();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Welcome screen interactions
        this.setupWelcomeScreen();
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        
        const toggleSidebar = () => {
            sidebar.classList.toggle('open');
        };
        
        mobileMenuBtn?.addEventListener('click', toggleSidebar);
        sidebarToggle?.addEventListener('click', toggleSidebar);
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    setupQuickActions() {
        const clearChatBtn = document.getElementById('clear-chat-btn');
        const exportChatBtn = document.getElementById('export-chat-btn');
        const settingsBtn = document.getElementById('settings-btn');
        
        clearChatBtn?.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the chat history?')) {
                this.chatManager.clearChat();
            }
        });
        
        exportChatBtn?.addEventListener('click', () => {
            this.chatManager.exportChat();
        });
        
        settingsBtn?.addEventListener('click', () => {
            this.openSettings();
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: Clear chat
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (confirm('Clear chat history?')) {
                    this.chatManager.clearChat();
                }
            }
            
            // Ctrl/Cmd + S: Export chat
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.chatManager.exportChat();
            }
            
            // Ctrl/Cmd + ,: Open settings
            if ((e.ctrlKey || e.metaKey) && e.key === ',') {
                e.preventDefault();
                this.openSettings();
            }
            
            // Escape: Close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // Ctrl/Cmd + /: Toggle sidebar
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                document.getElementById('sidebar').classList.toggle('open');
            }
        });
    }

    setupWelcomeScreen() {
        const welcomeScreen = document.querySelector('.welcome-screen');
        if (welcomeScreen) {
            // Add entrance animation
            welcomeScreen.classList.add('entrance-fade');
            
            // Animate feature items
            const featureItems = document.querySelectorAll('.feature-item');
            featureItems.forEach((item, index) => {
                item.style.animationDelay = `${0.5 + index * 0.1}s`;
                item.classList.add('entrance-slide-up');
            });
        }
    }

    setupSettings() {
        this.settingsModal = document.getElementById('settings-modal');
        this.modalClose = document.getElementById('modal-close');
        
        // Settings inputs
        this.maxHistoryInput = document.getElementById('max-history');
        this.autoScrollToggle = document.getElementById('auto-scroll');
        this.streamResponsesToggle = document.getElementById('stream-responses');
        this.themeSelect = document.getElementById('theme-select');
        this.fontSizeSelect = document.getElementById('font-size');
        
        // Event listeners
        this.modalClose?.addEventListener('click', () => this.closeSettings());
        this.settingsModal?.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettings();
            }
        });
        
        // Settings changes
        this.maxHistoryInput?.addEventListener('change', () => {
            const value = parseInt(this.maxHistoryInput.value);
            if (value >= 5 && value <= 100) {
                this.settings.maxHistory = value;
                this.chatManager.setMaxHistory(value);
                this.saveSettings();
            }
        });
        
        this.autoScrollToggle?.addEventListener('change', () => {
            this.settings.autoScroll = this.autoScrollToggle.checked;
            this.chatManager.setAutoScroll(this.autoScrollToggle.checked);
            this.saveSettings();
        });
        
        this.streamResponsesToggle?.addEventListener('change', () => {
            this.settings.streamResponses = this.streamResponsesToggle.checked;
            this.chatManager.setStreamResponses(this.streamResponsesToggle.checked);
            this.saveSettings();
        });
        
        this.themeSelect?.addEventListener('change', () => {
            this.settings.theme = this.themeSelect.value;
            this.setTheme(this.themeSelect.value);
            this.saveSettings();
        });
        
        this.fontSizeSelect?.addEventListener('change', () => {
            this.settings.fontSize = this.fontSizeSelect.value;
            this.setFontSize(this.fontSizeSelect.value);
            this.saveSettings();
        });
    }

    setupTheme() {
        // Auto theme detection
        if (this.settings.theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.theme = prefersDark ? 'dark' : 'light';
        } else {
            this.theme = this.settings.theme;
        }
        
        this.setTheme(this.theme);
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (this.settings.theme === 'auto') {
                this.theme = e.matches ? 'dark' : 'light';
                this.setTheme(this.theme);
            }
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
    }

    setFontSize(size) {
        const sizeMap = {
            small: '14px',
            medium: '16px',
            large: '18px'
        };
        
        document.documentElement.style.fontSize = sizeMap[size] || '16px';
    }

    openSettings() {
        this.settingsModal?.classList.add('open');
    }

    closeSettings() {
        this.settingsModal?.classList.remove('open');
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal.open');
        modals.forEach(modal => modal.classList.remove('open'));
    }

    applySettings() {
        // Apply max history
        if (this.settings.maxHistory) {
            this.maxHistoryInput.value = this.settings.maxHistory;
            this.chatManager.setMaxHistory(this.settings.maxHistory);
        }
        
        // Apply auto scroll
        if (this.settings.autoScroll !== undefined) {
            this.autoScrollToggle.checked = this.settings.autoScroll;
            this.chatManager.setAutoScroll(this.settings.autoScroll);
        }
        
        // Apply stream responses
        if (this.settings.streamResponses !== undefined) {
            this.streamResponsesToggle.checked = this.settings.streamResponses;
            this.chatManager.setStreamResponses(this.settings.streamResponses);
        }
        
        // Apply theme
        if (this.settings.theme) {
            this.themeSelect.value = this.settings.theme;
        }
        
        // Apply font size
        if (this.settings.fontSize) {
            this.fontSizeSelect.value = this.settings.fontSize;
            this.setFontSize(this.settings.fontSize);
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('aiChatStudioSettings');
            return saved ? JSON.parse(saved) : {
                maxHistory: 20,
                autoScroll: true,
                streamResponses: true,
                theme: 'dark',
                fontSize: 'medium'
            };
        } catch (error) {
            console.warn('Failed to load settings:', error);
            return {
                maxHistory: 20,
                autoScroll: true,
                streamResponses: true,
                theme: 'dark',
                fontSize: 'medium'
            };
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('aiChatStudioSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }

    updateConnectionStatus(status) {
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.connection-status span');
        
        if (statusIndicator) {
            statusIndicator.className = `status-indicator ${status}`;
        }
        
        if (statusText) {
            const statusMap = {
                connected: 'Connected',
                connecting: 'Connecting...',
                disconnected: 'Disconnected'
            };
            statusText.textContent = statusMap[status] || 'Unknown';
        }
    }

    // Public API
    getChatManager() {
        return this.chatManager;
    }

    getSettings() {
        return { ...this.settings };
    }

    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.aiApp = new AIApp();
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    
    // Show error notification
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
        z-index: 2000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    toast.textContent = 'An error occurred. Please refresh the page.';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
});

// Export for global access
window.AIApp = AIApp;
