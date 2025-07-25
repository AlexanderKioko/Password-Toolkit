A comprehensive password security analyzer and generator written in pure JavaScript. Analyze password strength, detect compromised passwords, generate secure passwords, and create memorable passphrases.
Features

Advanced Password Analysis: Multi-factor strength assessment with detailed scoring
Breach Detection: Simulated database check for compromised passwords
Secure Password Generation: Customizable generation with entropy calculations
Passphrase Generator: Create memorable yet secure word-based passwords
Pattern Recognition: Detects common patterns, keyboard sequences, and weak structures
Time-to-Crack Estimation: Calculate theoretical crack times based on entropy
Bulk Operations: Analyze multiple passwords simultaneously
Security Reporting: Generate comprehensive security reports

Quick Start
javascript// Analyze a password
const analysis = passwordTool.analyzePassword("MyP@ssw0rd123");
console.log(`Strength: ${analysis.strength}`);
console.log(`Score: ${analysis.score}/100`);

// Generate a secure password
const securePassword = passwordTool.generatePassword();
console.log(`Generated: ${securePassword}`);

// Create a memorable passphrase
const passphrase = passwordTool.generatePassphrase(4);
console.log(`Passphrase: ${passphrase}`);
Core Methods
Password Analysis
javascript// Basic analysis
passwordTool.analyzePassword("yourPassword");

// Returns detailed analysis object:
{
  strength: "Strong",
  score: 85,
  entropy: 52.3,
  timeToCrack: "2 years",
  isCompromised: false,
  recommendations: ["Add more symbols"],
  breakdown: {
    length: { score: 25, feedback: "Good length" },
    variety: { score: 28, varietyCount: 4 },
    patterns: { score: 20, detectedPatterns: [] },
    commonality: { score: 15, isCommon: false },
    breach: { isCompromised: false }
  }
}
Password Generation
javascript// Default secure password (16 chars, all character types)
passwordTool.generatePassword();

// Custom options
passwordTool.generatePassword({
  length: 20,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: false,
  excludeAmbiguous: true,
  ensureVariety: true
});

// Generate multiple passwords
passwordTool.generateMultiplePasswords(5, { length: 12 });
Passphrase Generation
javascript// Default: 4 words + number, separated by dashes
passwordTool.generatePassphrase();
// Output: "mountain-whisper-galaxy-thunder-847"

// Custom configuration
passwordTool.generatePassphrase(6, "_");
// Output: "ocean_dragon_harmony_sunset_miracle_forest_293"
Analysis Features
Strength Factors
The toolkit evaluates passwords across multiple dimensions:
FactorWeightDescriptionLength30%Character count (8+ chars recommended)Variety28%Mix of uppercase, lowercase, numbers, symbolsPatterns20%Absence of predictable sequencesCommonality15%Not found in common password listsBreach Status7%Not found in breach databases
Pattern Detection

Sequential patterns: 123, abc, qwerty
Repeated characters: aaa, 111
Keyboard patterns: asdf, zxcv
Date patterns: 01/01/2024
Common substitutions: @ for a, 3 for e

Security Levels
Score RangeStrengthDescription80-100Very StrongExcellent security, hard to crack60-79StrongGood security for most uses40-59ModerateAcceptable but could be improved20-39WeakEasy to crack, needs improvement0-19Very WeakExtremely vulnerable
Utility Methods
javascript// Run built-in strength tests
passwordTool.testPasswordStrength();

// Analyze multiple passwords
passwordTool.checkPasswordsInBulk(['pwd1', 'pwd2', 'pwd3']);

// View generation history
passwordTool.getPasswordHistory();

// Generate security report
passwordTool.generateSecurityReport();
Example Usage
Password Security Audit
javascriptconst passwords = [
  'password123',
  'MySecureP@ssw0rd!',
  'correct-horse-battery-staple'
];

const results = passwordTool.checkPasswordsInBulk(passwords);
results.forEach(result => {
  console.log(`"${result.password}": ${result.analysis.strength}`);
});
Custom Password Generator
javascript// Generate password for system with symbol restrictions
const systemPassword = passwordTool.generatePassword({
  length: 14,
  includeSymbols: false,
  excludeAmbiguous: true
});

// Generate passphrase for human memorization
const userPassphrase = passwordTool.generatePassphrase(3, ' ');
Security Features
Breach Database Simulation
The toolkit includes a simulated breach database containing:

24 common passwords with realistic breach counts
Pattern variations (password1, password!, etc.)
Timestamps showing when passwords were last seen in breaches

Entropy Calculation
Uses information theory to calculate password entropy:

Analyzes actual character set usage
Accounts for password length
Provides theoretical crack time estimates

Pattern Recognition Engine
Advanced pattern detection including:

Keyboard layout sequences
Number/letter sequences
Repeated segments
Common substitution patterns
Date and year patterns

Installation & Usage
Browser Console
javascript// Copy and paste the entire code into browser console
// Start using immediately
passwordTool.analyzePassword("test123");
Node.js
bash# Save as password-toolkit.js
node password-toolkit.js

# Or require in your project
const PasswordTool = require('./password-toolkit.js');
const tool = new PasswordTool();
Technical Details

Pure JavaScript: No external dependencies
Entropy Calculation: Information-theoretic password strength
Pattern Matching: Regular expressions for common weaknesses
Secure Generation: Cryptographically random character selection
Memory Efficient: Minimal storage footprint
Cross-Platform: Works in browsers and Node.js environments

Use Cases

Security Audits: Evaluate existing password policies
User Education: Demonstrate password strength concepts
System Integration: Add password validation to applications
Security Training: Interactive password security learning
Personal Use: Generate and analyze your own passwords

Contributing
Perfect for expanding with:

Additional breach databases
More sophisticated pattern recognition
Password policy compliance checking
Integration with real breach APIs
Advanced entropy calculations
Machine learning password strength prediction

License
Open source - use freely for educational and commercial purposes.
