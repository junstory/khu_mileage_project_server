const joi = require('joi');
const { walletAddressValidation, bankCodeValidation, phoneNumberValidation, emailValidation } = require('./custom.validation')

const getStudentList = {
    query: joi.object().keys({
        offset: joi.number().default(0),
        limit: joi.number().default(3),
        lastId: joi.number(), 
    }),
    params: joi.object().keys({}),
    body: joi.object().keys({}),
}

const createStudent = {
    query: joi.object().keys({}),
    params: joi.object().keys({}),
    body: joi.object().keys({
        studentId: joi.string().required(),
        password: joi.string().required(),
        passwordConfirm: joi.string().required(),
        name: joi.string().required(),
        email: joi.string().custom(emailValidation),
        phoneNumber: joi.string().custom(phoneNumberValidation), // todo 000-0000-0000 형식으로 재 개발
        department: joi.string().required(),
        walletAddress: joi.string().custom(walletAddressValidation),
        bankAccountNumber: joi.string(),
        bankCode: joi.string().custom(bankCodeValidation),
        personalInformationConsentStatus: joi.number().valid(0, 1).required(),
        rawTransaction: joi.string().required(),
        studentHash: joi.string().required(),
    }).and("bankAccountNumber", "bankCode"),
}
const getStudentById = {
    query: joi.object().keys({}),
    params: joi.object().keys({
        studentId: joi.string().required(),
    }),
    body: joi.object().keys({}),
}

// 현재 업데이트는 walletAddress, bankAccountNumber, bankCode 만 허용합니다. 필요시 추가 작업 진행
const updateStudent = {
    query: joi.object().keys({}),
    params: joi.object().keys({
        studentId: joi.string().required(),
    }),
    body: joi.object().keys({
        // name: joi.string(),
        // email: joi.string().custom(emailValidation),
        // phoneNumber: joi.string().custom(phoneNumberValidation),
        // department: joi.string(),
        walletAddress: joi.string().custom(walletAddressValidation),
        bankAccountNumber: joi.string(),
        bankCode: joi.string().custom(bankCodeValidation),
    }).and("bankAccountNumber", "bankCode"),
}
const deleteStudent = {
    query: joi.object().keys({}),
    params: joi.object().keys({
        studentId: joi.string().required(),
    }),
    body: joi.object().keys({}),
}
module.exports = {
    getStudentList,
    createStudent,
    getStudentById,
    updateStudent,
    deleteStudent,
}
