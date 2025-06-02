class LaTeXManager {
    constructor() {
        this.isKaTeXLoaded = false;
        this.renderQueue = [];
        this.initializeKaTeX();
        this.setupModal();
    }

    async initializeKaTeX() {
        // Wait for KaTeX to load
        while (typeof katex === 'undefined') {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        this.isKaTeXLoaded = true;
        this.processRenderQueue();
    }

    setupModal() {
        this.modal = document.getElementById('latex-modal');
        this.input = document.getElementById('latex-input');
        this.preview = document.getElementById('latex-preview');
        this.insertBtn = document.getElementById('latex-insert');
        this.cancelBtn = document.getElementById('latex-cancel');
        this.closeBtn = document.getElementById('latex-modal-close');

        // Event listeners
        this.input.addEventListener('input', this.updatePreview.bind(this));
        this.insertBtn.addEventListener('click', this.insertLatex.bind(this));
        this.cancelBtn.addEventListener('click', this.closeModal.bind(this));
        this.closeBtn.addEventListener('click', this.closeModal.bind(this));

        // Example buttons
        const exampleBtns = document.querySelectorAll('.example-btn');
        exampleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const latex = btn.getAttribute('data-latex');
                this.input.value = latex;
                this.updatePreview();
            });
        });

        // Close modal on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    openModal() {
        this.modal.classList.add('open');
        this.input.focus();
        this.updatePreview();
    }

    closeModal() {
        this.modal.classList.remove('open');
        this.input.value = '';
        this.preview.innerHTML = '';
    }

    updatePreview() {
        const latex = this.input.value.trim();
        if (!latex) {
            this.preview.innerHTML = '<span style="color: var(--text-muted);">Preview will appear here</span>';
            return;
        }

        try {
            this.renderLatex(this.preview, latex, true);
        } catch (error) {
            this.preview.innerHTML = `<span style="color: var(--accent-error);">Error: ${error.message}</span>`;
        }
    }

    insertLatex() {
        const latex = this.input.value.trim();
        if (!latex) return;

        const chatInput = document.getElementById('chat-input');
        const cursorPos = chatInput.selectionStart;
        const textBefore = chatInput.value.substring(0, cursorPos);
        const textAfter = chatInput.value.substring(chatInput.selectionEnd);
        
        const latexBlock = `$$${latex}$$`;
        chatInput.value = textBefore + latexBlock + textAfter;
        chatInput.selectionStart = chatInput.selectionEnd = cursorPos + latexBlock.length;
        
        this.closeModal();
        chatInput.focus();
        
        // Trigger input event to update UI
        chatInput.dispatchEvent(new Event('input'));
    }

    renderLatex(element, latex, displayMode = false) {
        if (!this.isKaTeXLoaded) {
            this.renderQueue.push({ element, latex, displayMode });
            return;
        }

        try {
            katex.render(latex, element, {
                displayMode: displayMode,
                throwOnError: true,
                strict: false,
                trust: false,
                macros: {
                    "\\R": "\\mathbb{R}",
                    "\\N": "\\mathbb{N}",
                    "\\Z": "\\mathbb{Z}",
                    "\\Q": "\\mathbb{Q}",
                    "\\C": "\\mathbb{C}",
                    "\\vec": "\\overrightarrow{#1}",
                    "\\abs": "\\left|#1\\right|",
                    "\\norm": "\\left\\|#1\\right\\|"
                }
            });
        } catch (error) {
            element.innerHTML = `<span style="color: var(--accent-error); font-size: 0.875rem;">LaTeX Error: ${error.message}</span>`;
        }
    }

    processRenderQueue() {
        while (this.renderQueue.length > 0) {
            const { element, latex, displayMode } = this.renderQueue.shift();
            this.renderLatex(element, latex, displayMode);
        }
    }

    parseAndRenderMessage(text) {
        if (!text) return text;

        // Replace display math ($$...$$)
        text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, latex) => {
            const id = 'latex-' + Math.random().toString(36).substr(2, 9);
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    this.renderLatex(element, latex.trim(), true);
                }
            }, 0);
            return `<div id="${id}" class="latex-display"></div>`;
        });

        // Replace inline math ($...$)
        text = text.replace(/\$([^$\n]+?)\$/g, (match, latex) => {
            const id = 'latex-' + Math.random().toString(36).substr(2, 9);
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    this.renderLatex(element, latex.trim(), false);
                }
            }, 0);
            return `<span id="${id}" class="latex-inline"></span>`;
        });

        return text;
    }

    // Common LaTeX templates
    getTemplates() {
        return {
            fraction: '\\frac{numerator}{denominator}',
            sqrt: '\\sqrt{expression}',
            power: 'base^{exponent}',
            subscript: 'base_{subscript}',
            integral: '\\int_{lower}^{upper} expression \\, dx',
            sum: '\\sum_{i=1}^{n} expression',
            limit: '\\lim_{x \\to a} expression',
            matrix: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
            system: '\\begin{cases} equation1 \\\\ equation2 \\end{cases}',
            align: '\\begin{align} equation1 \\\\ equation2 \\end{align}'
        };
    }

    insertTemplate(templateName) {
        const templates = this.getTemplates();
        const template = templates[templateName];
        if (template) {
            this.input.value = template;
            this.updatePreview();
        }
    }
}

// Export for global access
window.LaTeXManager = LaTeXManager;
