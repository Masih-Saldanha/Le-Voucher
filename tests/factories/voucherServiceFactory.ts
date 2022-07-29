import { faker } from "@faker-js/faker";

function createVoucher() {
    return {
        id: randomPercentage(),
        code: faker.random.alphaNumeric(6),
        discount: randomPercentage(),
        used: true || false
    };
};

function randomPercentage(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const voucherServiceFactory = {
    createVoucher,
    randomPercentage,
};

export default voucherServiceFactory;