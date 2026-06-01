/**
 * Demo card validation for checkout.
 * @module payment-validator
 */

export function validatePaymentFields({ cardNumber, expiry, cvv }) {
    const errors = {};
    const digits = String(cardNumber || '').replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) {
        errors.cardNumber = 'invalidCardNumber';
    }

    const exp = String(expiry || '').trim();
    const m = exp.match(/^(\d{2})\s*\/\s*(\d{2})$/);
    if (!m) {
        errors.expiry = 'invalidExpiry';
    } else {
        const month = Number(m[1]);
        const year = 2000 + Number(m[2]);
        const now = new Date();
        const expDate = new Date(year, month, 0);
        if (month < 1 || month > 12 || expDate < now) {
            errors.expiry = 'expiredCard';
        }
    }

    const cvvDigits = String(cvv || '').replace(/\D/g, '');
    if (cvvDigits.length < 3 || cvvDigits.length > 4) {
        errors.cvv = 'invalidCvv';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
}
