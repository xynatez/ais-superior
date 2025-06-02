// AI Models Configuration for Puter.js
const AI_MODELS = {
    // Reasoning Models
    'o4-mini': {
        name: 'O4 Mini',
        provider: 'OpenAI',
        type: 'reasoning',
        description: 'Latest reasoning model with step-by-step thinking capabilities',
        maxTokens: 128000,
        supportsReasoning: true,
        supportsImages: false,
        category: 'reasoning'
    },
    'o3-mini': {
        name: 'O3 Mini',
        provider: 'OpenAI',
        type: 'reasoning',
        description: 'High-performance reasoning model for complex problem solving',
        maxTokens: 128000,
        supportsReasoning: true,
        supportsImages: false,
        category: 'reasoning'
    },
    'o3': {
        name: 'O3',
        provider: 'OpenAI',
        type: 'reasoning',
        description: 'Advanced reasoning model with enhanced analytical capabilities',
        maxTokens: 128000,
        supportsReasoning: true,
        supportsImages: false,
        category: 'reasoning'
    },
    'o1-pro': {
        name: 'O1 Pro',
        provider: 'OpenAI',
        type: 'reasoning',
        description: 'Professional-grade reasoning model for expert-level analysis',
        maxTokens: 128000,
        supportsReasoning: true,
        supportsImages: false,
        category: 'reasoning'
    },
    'o1-mini': {
        name: 'O1 Mini',
        provider: 'OpenAI',
        type: 'reasoning',
        description: 'Efficient reasoning model for structured problem solving',
        maxTokens: 128000,
        supportsReasoning: true,
        supportsImages: false,
        category: 'reasoning'
    },
    'o1': {
        name: 'O1',
        provider: 'OpenAI',
        type: 'reasoning',
        description: 'Foundation reasoning model with deep analytical thinking',
        maxTokens: 128000,
        supportsReasoning: true,
        supportsImages: false,
        category: 'reasoning'
    },
    'deepseek-reasoner': {
        name: 'DeepSeek Reasoner',
        provider: 'DeepSeek',
        type: 'reasoning',
        description: 'Advanced reasoning model with mathematical and logical capabilities',
        maxTokens: 65536,
        supportsReasoning: true,
        supportsImages: false,
        category: 'reasoning'
    },

    // OpenAI GPT Models
    'gpt-4o': {
        name: 'GPT-4o',
        provider: 'OpenAI',
        type: 'standard',
        description: 'Advanced multimodal AI model with superior performance',
        maxTokens: 128000,
        supportsReasoning: false,
        supportsImages: true,
        category: 'gpt'
    },
    'gpt-4o-mini': {
        name: 'GPT-4o Mini',
        provider: 'OpenAI',
        type: 'standard',
        description: 'Efficient GPT-4 model optimized for speed and cost',
        maxTokens: 128000,
        supportsReasoning: false,
        supportsImages: true,
        category: 'gpt'
    },
    'gpt-4.5-preview': {
        name: 'GPT-4.5 Preview',
        provider: 'OpenAI',
        type: 'standard',
        description: 'Next-generation GPT model with enhanced capabilities',
        maxTokens: 128000,
        supportsReasoning: false,
        supportsImages: true,
        category: 'gpt'
    },
    'gpt-4.1': {
        name: 'GPT-4.1',
        provider: 'OpenAI',
        type: 'standard',
        description: 'Improved GPT-4 with better accuracy and performance',
        maxTokens: 128000,
        supportsReasoning: false,
        supportsImages: true,
        category: 'gpt'
    },
    'gpt-4.1-mini': {
        name: 'GPT-4.1 Mini',
        provider: 'OpenAI',
        type: 'standard',
        description: 'Compact version of GPT-4.1 for faster responses',
        maxTokens: 128000,
        supportsReasoning: false,
        supportsImages: true,
        category: 'gpt'
    },
    'gpt-4.1-nano': {
        name: 'GPT-4.1 Nano',
        provider: 'OpenAI',
        type: 'standard',
        description: 'Ultra-efficient GPT-4.1 for quick interactions',
        maxTokens: 64000,
        supportsReasoning: false,
        supportsImages: false,
        category: 'gpt'
    },

    // Claude Models
    'claude-opus-4': {
        name: 'Claude Opus 4',
        provider: 'Anthropic',
        type: 'standard',
        description: 'Most capable Claude model for complex reasoning and analysis',
        maxTokens: 200000,
        supportsReasoning: false,
        supportsImages: true,
        category: 'claude'
    },
    'claude-sonnet-4': {
        name: 'Claude Sonnet 4',
        provider: 'Anthropic',
        type: 'standard',
        description: 'Balanced Claude model with strong performance across tasks',
        maxTokens: 200000,
        supportsReasoning: false,
        supportsImages: true,
        category: 'claude'
    },
    'claude-3-7-sonnet': {
        name: 'Claude 3.7 Sonnet',
        provider: 'Anthropic',
        type: 'standard',
        description: 'Enhanced version of Claude 3.5 with improved capabilities',
        maxTokens: 200000,
        supportsReasoning: false,
        supportsImages: true,
        category: 'claude'
    },
    'claude-3-5-sonnet': {
        name: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        type: 'standard',
        description: 'Versatile Claude model with excellent text and code abilities',
        maxTokens: 200000,
        supportsReasoning: false,
        supportsImages: true,
        category: 'claude'
    },

    // Google Gemini
    'gemini-2.0-flash': {
        name: 'Gemini 2.0 Flash',
        provider: 'Google',
        type: 'standard',
        description: 'Latest Gemini model with fast response times',
        maxTokens: 1000000,
        supportsReasoning: false,
        supportsImages: true,
        category: 'gemini'
    },
    'gemini-1.5-flash': {
        name: 'Gemini 1.5 Flash',
        provider: 'Google',
        type: 'standard',
        description: 'High-performance Gemini model with multimodal capabilities',
        maxTokens: 1000000,
        supportsReasoning: false,
        supportsImages: true,
        category: 'gemini'
    },
    'google/gemma-2-27b-it': {
        name: 'Gemma 2 27B',
        provider: 'Google',
        type: 'standard',
        description: 'Open-source model from Google with strong performance',
        maxTokens: 8192,
        supportsReasoning: false,
        supportsImages: false,
        category: 'gemini'
    },

    // Meta Llama
    'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo': {
        name: 'Llama 3.1 405B',
        provider: 'Meta',
        type: 'standard',
        description: 'Largest Llama model with exceptional reasoning capabilities',
        maxTokens: 131072,
        supportsReasoning: false,
        supportsImages: false,
        category: 'llama'
    },
    'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo': {
        name: 'Llama 3.1 70B',
        provider: 'Meta',
        type: 'standard',
        description: 'High-performance Llama model for complex tasks',
        maxTokens: 131072,
        supportsReasoning: false,
        supportsImages: false,
        category: 'llama'
    },
    'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo': {
        name: 'Llama 3.1 8B',
        provider: 'Meta',
        type: 'standard',
        description: 'Efficient Llama model for general-purpose tasks',
        maxTokens: 131072,
        supportsReasoning: false,
        supportsImages: false,
        category: 'llama'
    },

    // Mistral Models
    'mistral-large-latest': {
        name: 'Mistral Large',
        provider: 'Mistral',
        type: 'standard',
        description: 'Most capable Mistral model for complex reasoning',
        maxTokens: 131072,
        supportsReasoning: false,
        supportsImages: false,
        category: 'mistral'
    },
    'pixtral-large-latest': {
        name: 'Pixtral Large',
        provider: 'Mistral',
        type: 'standard',
        description: 'Multimodal Mistral model with vision capabilities',
        maxTokens: 131072,
        supportsReasoning: false,
        supportsImages: true,
        category: 'mistral'
    },
    'codestral-latest': {
        name: 'Codestral',
        provider: 'Mistral',
        type: 'standard',
        description: 'Specialized Mistral model for code generation and analysis',
        maxTokens: 131072,
        supportsReasoning: false,
        supportsImages: false,
        category: 'mistral'
    },

    // Other Models
    'deepseek-chat': {
        name: 'DeepSeek Chat',
        provider: 'DeepSeek',
        type: 'standard',
        description: 'Conversational AI model with strong analytical capabilities',
        maxTokens: 65536,
        supportsReasoning: false,
        supportsImages: false,
        category: 'other'
    },
    'grok-beta': {
        name: 'Grok Beta',
        provider: 'xAI',
        type: 'standard',
        description: 'Real-time AI model with access to current information',
        maxTokens: 131072,
        supportsReasoning: false,
        supportsImages: false,
        category: 'other'
    }
};

// Reasoning effort levels
const REASONING_EFFORTS = {
    low: {
        name: 'Low',
        description: 'Fast reasoning with economical token usage',
        icon: '⚡',
        color: '#10b981'
    },
    medium: {
        name: 'Medium',
        description: 'Balanced reasoning between speed and thoroughness',
        icon: '⚖️',
        color: '#3b82f6'
    },
    high: {
        name: 'High',
        description: 'Comprehensive reasoning with detailed analysis',
        icon: '🎯',
        color: '#8b5cf6'
    }
};

// Model categories
const MODEL_CATEGORIES = {
    reasoning: {
        name: 'Reasoning Models',
        icon: '🧠',
        description: 'Advanced models with step-by-step thinking capabilities'
    },
    gpt: {
        name: 'OpenAI GPT',
        icon: '⚡',
        description: 'Latest GPT models from OpenAI'
    },
    claude: {
        name: 'Claude',
        icon: '🎭',
        description: 'Anthropic\'s Claude models for nuanced conversations'
    },
    gemini: {
        name: 'Google Gemini',
        icon: '💎',
        description: 'Google\'s multimodal AI models'
    },
    llama: {
        name: 'Meta Llama',
        icon: '🦙',
        description: 'Meta\'s open-source language models'
    },
    mistral: {
        name: 'Mistral',
        icon: '🌟',
        description: 'Efficient and powerful models from Mistral AI'
    },
    other: {
        name: 'Other Models',
        icon: '🚀',
        description: 'Various specialized AI models'
    }
};

// Utility functions
class ModelManager {
    static getModel(modelId) {
        return AI_MODELS[modelId] || null;
    }

    static getAllModels() {
        return AI_MODELS;
    }

    static getModelsByCategory(category) {
        return Object.entries(AI_MODELS)
            .filter(([_, model]) => model.category === category)
            .map(([id, model]) => ({ id, ...model }));
    }

    static getReasoningModels() {
        return Object.entries(AI_MODELS)
            .filter(([_, model]) => model.supportsReasoning)
            .map(([id, model]) => ({ id, ...model }));
    }

    static getMultimodalModels() {
        return Object.entries(AI_MODELS)
            .filter(([_, model]) => model.supportsImages)
            .map(([id, model]) => ({ id, ...model }));
    }

    static supportsReasoning(modelId) {
        const model = this.getModel(modelId);
        return model ? model.supportsReasoning : false;
    }

    static supportsImages(modelId) {
        const model = this.getModel(modelId);
        return model ? model.supportsImages : false;
    }

    static getMaxTokens(modelId) {
        const model = this.getModel(modelId);
        return model ? model.maxTokens : 4096;
    }

    static getModelInfo(modelId) {
        const model = this.getModel(modelId);
        if (!model) return null;

        return {
            ...model,
            badge: model.type === 'reasoning' ? 'reasoning' : 'standard',
            categoryInfo: MODEL_CATEGORIES[model.category] || MODEL_CATEGORIES.other
        };
    }
}

// Export for global access
window.ModelManager = ModelManager;
window.AI_MODELS = AI_MODELS;
window.REASONING_EFFORTS = REASONING_EFFORTS;
window.MODEL_CATEGORIES = MODEL_CATEGORIES;
