class GetStudentListDTO {
    constructor({ }) {
        // this. = ;
    }
}

class CreateStudentDTO {
    constructor({
        studentId, password, name, email, phoneNumber, department, salt, walletAddress, bankAccountNumber, bankCode, personalInformationConsentStatus, transactionHash, studentHash
    }) {
        this.student_id = studentId;
        this.password = password;
        this.name = name;
        this.email = email;
        this.phone_number = phoneNumber;
        this.department = department;
        this.salt = salt;
        this.wallet_address = walletAddress;
        this.bank_account_number = bankAccountNumber;
        this.bank_code = bankCode;
        this.personal_information_consent_status = personalInformationConsentStatus;
        this.transaction_hash = transactionHash;
        this.student_hash = studentHash;
    }
}
class GetStudentByIdDTO {
    constructor({ }) {
        // this. = ;
    }
}

// delete password, salt
class StudentDTO {
    constructor({
        student_id, name, email, phone_number, department, wallet_address, bank_account_number, bank_code, personal_information_consent_status
    }) {
        this.student_id = student_id;
        this.name = name;
        this.email = email;
        this.phone_number = phone_number;
        this.department = department;
        this.wallet_address = wallet_address;
        this.bank_account_number = bank_account_number;
        this.bank_code = bank_code;
        this.personal_information_consent_status = personal_information_consent_status;
    }
}

class UpdateStudentDTO {
    constructor({
        walletAddress, bankAccountNumber, bankCode
    }) {
        this.wallet_address = walletAddress;
        this.bank_account_number = bankAccountNumber;
        this.bank_code = bankCode;
    }
}

class DeleteStudentDTO {
    constructor({ }) {
        // this. = ;
    }
}
module.exports = {
    GetStudentListDTO,
    GetStudentByIdDTO,
    StudentDTO,
    CreateStudentDTO,
    UpdateStudentDTO,
    DeleteStudentDTO,
};
