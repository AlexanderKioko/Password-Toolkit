class PasswordSecurityToolkit {
    constructor() {
        this.commonPasswords = [
            'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
            'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'dragon',
            'master', 'shadow', 'qwerty123', 'football', 'baseball', 'superman',
            'hello', 'freedom', 'whatever', 'ninja', 'mustang', 'maggie'
        ];
        
        this.commonPatterns = [
            /^(.)\1+$/, // All same character
            /^(012|123|234|345|456|567|678|789|890)+/, // Sequential numbers
            /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+/i, // Sequential letters
            /^(.{1,3})\1+$/, // Repeated short patterns
            /^(19|20)\d{2}$/, // Years
            /^\d{2}\/\d{2}\/\d{4}$/, // Dates
            /^(\d{3})-?(\d{2})-?(\d{4})$/ // SSN-like patterns
        ];
        
        this.characterSets = {
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
            ambiguous: 'il1Lo0O'
        };
        
        this.passwordHistory = [];
        this.breachDatabase = this.generateMockBreachDatabase();
    }
    
    generateMockBreachDatabase() {
        // Simulate a breach database with hashed common passwords
        const breaches = {};
        this.commonPasswords.forEach(pwd => {
            breaches[this.simpleHash(pwd)] = {
                password: pwd,
                breachCount: Math.floor(Math.random() * 1000000) + 1000,
                lastSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
            };
        });
        
        // Add some random variations
        const variations = ['1', '!', '123', '2023', '2024', '2025'];
        this.commonPasswords.forEach(pwd => {
            variations.forEach(suffix => {
                const variant = pwd + suffix;
                breaches[this.simpleHash(variant)] = {
                    password: variant,
                    breachCount: Math.floor(Math.random() * 100000) + 100,
                    lastSeen: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
                };
            });
        });
        
        return breaches;
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }
    
    analyzePassword(password) {
        if (!password || typeof password !== 'string') {
            return { error: 'Password must be a non-empty string' };
        }
        
        const analysis = {
            password: password,
            length: password.length,
            strength: 'Weak',
            score: 0,
            maxScore: 100,
            breakdown: {},
            recommendations: [],
            timeToCrack: '',
            entropy: 0,
            isCompromised: false,
            breachInfo: null
        };
        
        // Length analysis
        analysis.breakdown.length = this.analyzeLengthStrength(password.length);
        analysis.score += analysis.breakdown.length.score;
        
        // Character variety analysis
        analysis.breakdown.variety = this.analyzeCharacterVariety(password);
        analysis.score += analysis.breakdown.variety.score;
        
        // Pattern analysis
        analysis.breakdown.patterns = this.analyzePatterns(password);
        analysis.score += analysis.breakdown.patterns.score;
        
        // Common password check
        analysis.breakdown.commonality = this.checkCommonPassword(password);
        analysis.score += analysis.breakdown.commonality.score;
        
        // Breach check
        analysis.breakdown.breach = this.checkBreachDatabase(password);
        analysis.isCompromised = analysis.breakdown.breach.isCompromised;
        analysis.breachInfo = analysis.breakdown.breach.breachInfo;
        
        // Calculate entropy
        analysis.entropy = this.calculateEntropy(password);
        
        // Determine overall strength
        analysis.strength = this.determineStrength(analysis.score);
        
        // Calculate time to crack
        analysis.timeToCrack = this.calculateTimeToCrack(analysis.entropy);
        
        // Generate recommendations
        analysis.recommendations = this.generateRecommendations(analysis);
        
        return analysis;
    }
    
    analyzeLengthStrength(length) {
        let score = 0;
        let feedback = '';
        
        if (length < 8) {
            score = 0;
            feedback = 'Too short - minimum 8 characters recommended';
        } else if (length < 12) {
            score = 15;
            feedback = 'Adequate length but could be longer';
        } else if (length < 16) {
            score = 25;
            feedback = 'Good length';
        } else {
            score = 30;
            feedback = 'Excellent length';
        }
        
        return { score, feedback, length };
    }
    
    analyzeCharacterVariety(password) {
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
        
        const varietyCount = [hasLower, hasUpper, hasNumbers, hasSymbols].filter(Boolean).length;
        
        let score = varietyCount * 7;
        let feedback = '';
        
        switch (varietyCount) {
            case 1:
                feedback = 'Only one character type - very weak';
                break;
            case 2:
                feedback = 'Two character types - weak';
                break;
            case 3:
                feedback = 'Three character types - good';
                break;
            case 4:
                feedback = 'All character types - excellent';
                break;
        }
        
        return {
            score,
            feedback,
            hasLower,
            hasUpper,
            hasNumbers,
            hasSymbols,
            varietyCount
        };
    }
    
    analyzePatterns(password) {
        let score = 20; // Start with full points
        const detectedPatterns = [];
        
        // Check for common patterns
        this.commonPatterns.forEach((pattern, index) => {
            if (pattern.test(password)) {
                score -= 5;
                detectedPatterns.push([
                    'Repeated characters',
                    'Sequential numbers',
                    'Sequential letters',
                    'Repeated pattern',
                    'Year pattern',
                    'Date pattern',
                    'SSN-like pattern'
                ][index]);
            }
        });
        
        // Check for keyboard patterns
        const keyboardPatterns = ['qwerty', 'asdf', '1234', 'zxcv'];
        keyboardPatterns.forEach(pattern => {
            if (password.toLowerCase().includes(pattern)) {
                score -= 3;
                detectedPatterns.push('Keyboard pattern');
            }
        });
        
        score = Math.max(0, score);
        
        return {
            score,
            feedback: detectedPatterns.length > 0 
                ? `Patterns detected: ${detectedPatterns.join(', ')}`
                : 'No common patterns detected',
            detectedPatterns
        };
    }
    
    checkCommonPassword(password) {
        const isCommon = this.commonPasswords.some(common => 
            password.toLowerCase().includes(common.toLowerCase()) ||
            common.toLowerCase().includes(password.toLowerCase())
        );
        
        return {
            score: isCommon ? -10 : 15,
            feedback: isCommon ? 'Contains common password elements' : 'Not a common password',
            isCommon
        };
    }
    
    checkBreachDatabase(password) {
        const hash = this.simpleHash(password);
        const breachInfo = this.breachDatabase[hash];
        
        return {
            isCompromised: !!breachInfo,
            breachInfo: breachInfo || null,
            feedback: breachInfo 
                ? `⚠️ Password found in breach database (${breachInfo.breachCount.toLocaleString()} occurrences)`
                : 'Password not found in known breaches'
        };
    }
    
    calculateEntropy(password) {
        let charsetSize = 0;
        
        if (/[a-z]/.test(password)) charsetSize += 26;
        if (/[A-Z]/.test(password)) charsetSize += 26;
        if (/\d/.test(password)) charsetSize += 10;
        if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) charsetSize += 32;
        
        return password.length * Math.log2(charsetSize);
    }
    
    determineStrength(score) {
        if (score >= 80) return 'Very Strong';
        if (score >= 60) return 'Strong';
        if (score >= 40) return 'Moderate';
        if (score >= 20) return 'Weak';
        return 'Very Weak';
    }
    
    calculateTimeToCrack(entropy) {
        // Assume 1 billion guesses per second
        const guessesPerSecond = 1e9;
        const totalCombinations = Math.pow(2, entropy);
        const averageTime = totalCombinations / (2 * guessesPerSecond);
        
        if (averageTime < 1) return 'Instantly';
        if (averageTime < 60) return `${Math.round(averageTime)} seconds`;
        if (averageTime < 3600) return `${Math.round(averageTime / 60)} minutes`;
        if (averageTime < 86400) return `${Math.round(averageTime / 3600)} hours`;
        if (averageTime < 31536000) return `${Math.round(averageTime / 86400)} days`;
        if (averageTime < 31536000000) return `${Math.round(averageTime / 31536000)} years`;
        return 'Millions of years';
    }
    
    generateRecommendations(analysis) {
        const recommendations = [];
        
        if (analysis.breakdown.length.score < 25) {
            recommendations.push('Increase password length to at least 12 characters');
        }
        
        if (analysis.breakdown.variety.varietyCount < 4) {
            if (!analysis.breakdown.variety.hasUpper) recommendations.push('Add uppercase letters');
            if (!analysis.breakdown.variety.hasLower) recommendations.push('Add lowercase letters');
            if (!analysis.breakdown.variety.hasNumbers) recommendations.push('Add numbers');
            if (!analysis.breakdown.variety.hasSymbols) recommendations.push('Add special symbols');
        }
        
        if (analysis.breakdown.patterns.detectedPatterns.length > 0) {
            recommendations.push('Avoid predictable patterns and sequences');
        }
        
        if (analysis.breakdown.commonality.isCommon) {
            recommendations.push('Avoid common passwords and dictionary words');
        }
        
        if (analysis.isCompromised) {
            recommendations.push('⚠️ URGENT: Change this password immediately - it has been compromised');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Excellent password! Consider enabling 2FA for additional security');
        }
        
        return recommendations;
    }
    
    generatePassword(options = {}) {
        const defaults = {
            length: 16,
            includeUppercase: true,
            includeLowercase: true,
            includeNumbers: true,
            includeSymbols: true,
            excludeAmbiguous: false,
            excludeSimilar: true,
            ensureVariety: true
        };
        
        const config = { ...defaults, ...options };
        
        if (config.length < 4) {
            throw new Error('Password length must be at least 4 characters');
        }
        
        let charset = '';
        if (config.includeLowercase) charset += this.characterSets.lowercase;
        if (config.includeUppercase) charset += this.characterSets.uppercase;
        if (config.includeNumbers) charset += this.characterSets.numbers;
        if (config.includeSymbols) charset += this.characterSets.symbols;
        
        if (config.excludeAmbiguous) {
            charset = charset.split('').filter(char => 
                !this.characterSets.ambiguous.includes(char)
            ).join('');
        }
        
        if (charset.length === 0) {
            throw new Error('No valid characters available with current options');
        }
        
        let password = '';
        
        // Ensure variety if requested
        if (config.ensureVariety) {
            const requiredSets = [];
            if (config.includeLowercase) requiredSets.push(this.characterSets.lowercase);
            if (config.includeUppercase) requiredSets.push(this.characterSets.uppercase);
            if (config.includeNumbers) requiredSets.push(this.characterSets.numbers);
            if (config.includeSymbols) requiredSets.push(this.characterSets.symbols);
            
            // Add one character from each required set
            requiredSets.forEach(set => {
                const availableChars = config.excludeAmbiguous 
                    ? set.split('').filter(char => !this.characterSets.ambiguous.includes(char))
                    : set.split('');
                password += availableChars[Math.floor(Math.random() * availableChars.length)];
            });
        }
        
        // Fill remaining length with random characters
        while (password.length < config.length) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }
        
        // Shuffle the password to avoid predictable patterns
        password = this.shuffleString(password);
        
        // Store in history
        this.passwordHistory.push({
            password,
            generated: new Date(),
            options: config
        });
        
        return password;
    }
    
    shuffleString(str) {
        return str.split('').sort(() => Math.random() - 0.5).join('');
    }
    
    generateMultiplePasswords(count = 5, options = {}) {
        const passwords = [];
        for (let i = 0; i < count; i++) {
            try {
                passwords.push(this.generatePassword(options));
            } catch (error) {
                passwords.push(`Error: ${error.message}`);
            }
        }
        return passwords;
    }
    
    checkPasswordsInBulk(passwords) {
        return passwords.map(pwd => ({
            password: pwd,
            analysis: this.analyzePassword(pwd)
        }));
    }
    
    generatePassphrase(wordCount = 4, separator = '-') {
        const words = [
            'apple', 'banana', 'cherry', 'dragon', 'elephant', 'forest', 'guitar', 'harmony',
            'island', 'jungle', 'kitten', 'ladder', 'mountain', 'notebook', 'ocean', 'penguin',
            'quartz', 'rainbow', 'sunset', 'thunder', 'umbrella', 'village', 'whisper', 'xylophone',
            'yellow', 'zebra', 'adventure', 'breeze', 'cascade', 'diamond', 'enigma', 'firefly',
            'galaxy', 'horizon', 'infinite', 'journey', 'kaleidoscope', 'labyrinth', 'miracle',
            'nebula', 'odyssey', 'paradise', 'quantum', 'radiance', 'serenity', 'tempest'
        ];
        
        const selectedWords = [];
        for (let i = 0; i < wordCount; i++) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            selectedWords.push(randomWord);
        }
        
        // Add random numbers for additional security
        const randomNum = Math.floor(Math.random() * 1000);
        selectedWords.push(randomNum.toString());
        
        return selectedWords.join(separator);
    }
    
    getPasswordHistory() {
        return this.passwordHistory.slice(-10); // Return last 10 generated passwords
    }
    
    testPasswordStrength() {
        const testPasswords = [
            'password',
            'Password123',
            'MyP@ssw0rd!',
            'Tr0ub4dor&3',
            'correct horse battery staple',
            '!@#$%^&*()',
            'aB3$fG7*kL9#'
        ];
        
        console.log('=== PASSWORD STRENGTH TEST ===\n');
        
        testPasswords.forEach(pwd => {
            const analysis = this.analyzePassword(pwd);
            console.log(`Password: "${pwd}"`);
            console.log(`Strength: ${analysis.strength} (${analysis.score}/100)`);
            console.log(`Time to crack: ${analysis.timeToCrack}`);
            console.log(`Compromised: ${analysis.isCompromised ? 'YES ⚠️' : 'NO ✓'}`);
            console.log('---');
        });
    }
    
    generateSecurityReport() {
        const report = {
            timestamp: new Date(),
            totalAnalyzed: this.passwordHistory.length,
            strengthDistribution: { 'Very Weak': 0, 'Weak': 0, 'Moderate': 0, 'Strong': 0, 'Very Strong': 0 },
            compromisedCount: 0,
            averageEntropy: 0
        };
        
        // Analyze recent passwords
        this.passwordHistory.forEach(entry => {
            const analysis = this.analyzePassword(entry.password);
            report.strengthDistribution[analysis.strength]++;
            if (analysis.isCompromised) report.compromisedCount++;
            report.averageEntropy += analysis.entropy;
        });
        
        if (this.passwordHistory.length > 0) {
            report.averageEntropy /= this.passwordHistory.length;
        }
        
        return report;
    }
}

// Initialize the toolkit
const passwordTool = new PasswordSecurityToolkit();

// Welcome message and examples
console.log('🔐 PASSWORD SECURITY TOOLKIT 🔐');
console.log('=====================================');
console.log('Analyze password strength and generate secure passwords!');
console.log('');
console.log('Quick Examples:');
console.log('1. passwordTool.analyzePassword("yourPassword123") - Analyze a password');
console.log('2. passwordTool.generatePassword() - Generate a secure password');
console.log('3. passwordTool.generatePassphrase() - Generate a memorable passphrase');
console.log('4. passwordTool.testPasswordStrength() - Run strength tests');
console.log('5. passwordTool.generateMultiplePasswords(5) - Generate 5 passwords');
console.log('');
console.log('Advanced Options:');
console.log('passwordTool.generatePassword({ length: 20, includeSymbols: false })');
console.log('passwordTool.checkPasswordsInBulk(["pwd1", "pwd2", "pwd3"])');
console.log('');

// Demo analysis
console.log('=== DEMO ANALYSIS ===');
const demoPassword = 'MyP@ssw0rd2024!';
const analysis = passwordTool.analyzePassword(demoPassword);
console.log(`Analyzing: "${demoPassword}"`);
console.log(`Strength: ${analysis.strength} (${analysis.score}/100 points)`);
console.log(`Time to crack: ${analysis.timeToCrack}`);
console.log(`Entropy: ${analysis.entropy.toFixed(1)} bits`);
console.log(`Compromised: ${analysis.isCompromised ? 'YES ⚠️' : 'NO ✓'}`);

// Export for Node.js
if (typeof module !== 'undefined') {
    module.exports = PasswordSecurityToolkit;
}