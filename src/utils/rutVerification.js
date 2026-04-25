const validateRut = (rut) => {
    if (!rut) return false;

    const cleanRut = String(rut).replace(/\./g, '').replace(/-/g, '').toUpperCase();

    if (cleanRut.length < 2) return false;

    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    if (!/^\d+$/.test(body)) return false;

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
        sum += Number.parseInt(body[i], 10) * multiplier;
        multiplier = multiplier < 7 ? multiplier + 1 : 2;
    }

    const remainder = sum % 11;
    const expected = 11 - remainder;

    let expectedDv = '';
    if (expected === 11) expectedDv = '0';
    else if (expected === 10) expectedDv = 'K';
    else expectedDv = String(expected);

    return dv === expectedDv;
};

module.exports = validateRut;
