class FileHandler {
    constructor() {
        this.uploadedFiles = new Map();
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.supportedTypes = {
            text: ['.txt', '.md', '.json', '.csv', '.xml', '.yaml', '.yml'],
            images: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'],
            documents: ['.pdf', '.doc', '.docx', '.rtf'],
            code: ['.js', '.py', '.html', '.css', '.java', '.cpp', '.c', '.php', '.rb', '.go', '.rs']
        };
        
        this.setupFileUpload();
    }

    setupFileUpload() {
        this.fileInput = document.getElementById('file-input');
        this.uploadArea = document.getElementById('file-upload-area');
        this.uploadContent = document.getElementById('upload-content');
        this.filePreview = document.getElementById('file-preview');
        this.fileName = document.getElementById('file-name');
        this.fileSize = document.getElementById('file-size');
        this.removeBtn = document.getElementById('remove-file-btn');

        // Event listeners
        this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        this.removeBtn.addEventListener('click', this.removeFile.bind(this));

        // Drag and drop
        this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    async processFile(file) {
        try {
            // Validate file
            this.validateFile(file);

            // Show loading
            this.showLoading();

            // Process based on file type
            const fileType = this.getFileType(file);
            let content = '';

            switch (fileType) {
                case 'text':
                    content = await this.readTextFile(file);
                    break;
                case 'image':
                    content = await this.processImageFile(file);
                    break;
                case 'document':
                    content = await this.processDocumentFile(file);
                    break;
                default:
                    throw new Error('Unsupported file type');
            }

            // Store file data
            const fileData = {
                name: file.name,
                size: file.size,
                type: file.type,
                content: content,
                fileType: fileType,
                timestamp: Date.now()
            };

            this.uploadedFiles.set(file.name, fileData);
            this.showFilePreview(fileData);

        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    validateFile(file) {
        // Check file size
        if (file.size > this.maxFileSize) {
            throw new Error(`File too large. Maximum size is ${this.formatFileSize(this.maxFileSize)}`);
        }

        // Check file type
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        const allSupportedTypes = [
            ...this.supportedTypes.text,
            ...this.supportedTypes.images,
            ...this.supportedTypes.documents,
            ...this.supportedTypes.code
        ];

        if (!allSupportedTypes.includes(extension)) {
            throw new Error(`Unsupported file type: ${extension}`);
        }
    }

    getFileType(file) {
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (this.supportedTypes.images.includes(extension)) return 'image';
        if (this.supportedTypes.documents.includes(extension)) return 'document';
        if (this.supportedTypes.text.includes(extension) || this.supportedTypes.code.includes(extension)) return 'text';
        
        return 'unknown';
    }

    async readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    async processImageFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Return base64 data URL for image
                resolve(e.target.result);
            };
            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.readAsDataURL(file);
        });
    }

    async processDocumentFile(file) {
        // For PDF and Word documents, we'll return a placeholder
        // In a real implementation, you'd use libraries like pdf.js or mammoth.js
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (extension === '.pdf') {
            return `[PDF Document: ${file.name}]\nThis PDF document has been uploaded and is ready for analysis. The AI can help analyze its content when you ask questions about it.`;
        } else if (['.doc', '.docx'].includes(extension)) {
            return `[Word Document: ${file.name}]\nThis Word document has been uploaded and is ready for analysis. The AI can help analyze its content when you ask questions about it.`;
        }
        
        throw new Error('Document processing not implemented for this file type');
    }

    showFilePreview(fileData) {
        this.fileName.textContent = fileData.name;
        this.fileSize.textContent = this.formatFileSize(fileData.size);
        
        this.uploadContent.style.display = 'none';
        this.filePreview.style.display = 'block';
    }

    removeFile() {
        this.uploadedFiles.clear();
        this.fileInput.value = '';
        this.uploadContent.style.display = 'block';
        this.filePreview.style.display = 'none';
    }

    getUploadedFiles() {
        return Array.from(this.uploadedFiles.values());
    }

    hasUploadedFiles() {
        return this.uploadedFiles.size > 0;
    }

    getFilesForPrompt() {
        const files = this.getUploadedFiles();
        if (files.length === 0) return '';

        let prompt = '\n\n--- Uploaded Files ---\n';
        
        files.forEach(file => {
            prompt += `\nFile: ${file.name} (${this.formatFileSize(file.size)})\n`;
            
            if (file.fileType === 'image') {
                prompt += `[Image uploaded - Please analyze this image]\n`;
            } else {
                prompt += `Content:\n${file.content}\n`;
            }
            prompt += '---\n';
        });

        return prompt;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    showError(message) {
        // Create a temporary error toast
        const toast = document.createElement('div');
        toast.className = 'error-toast';
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
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Get file icon based on type
    getFileIcon(fileType, fileName) {
        const extension = '.' + fileName.split('.').pop().toLowerCase();
        
        const icons = {
            // Images
            '.jpg': '🖼️', '.jpeg': '🖼️', '.png': '🖼️', '.gif': '🖼️', '.webp': '🖼️',
            
            // Documents
            '.pdf': '📄', '.doc': '📝', '.docx': '📝', '.rtf': '📝',
            
            // Text
            '.txt': '📄', '.md': '📝', '.json': '📋', '.csv': '📊', '.xml': '📄',
            
            // Code
            '.js': '🟨', '.py': '🐍', '.html': '🌐', '.css': '🎨', '.java': '☕',
            '.cpp': '⚙️', '.c': '⚙️', '.php': '🐘', '.rb': '💎', '.go': '🐹', '.rs': '🦀'
        };
        
        return icons[extension] || '📄';
    }
}

// Export for global access
window.FileHandler = FileHandler;
