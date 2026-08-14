const generatePassword = () => {
    const random = Math.random().toString(36).slice(-6);
    return `Welcome@${random}`;
};

module.exports = generatePassword;