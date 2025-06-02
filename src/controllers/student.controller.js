const catchAsync = require('../utils/catchAsync');
const { studentService, authService, caverService } = require("../services");
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status')
const {
    GetStudentListDTO,
    CreateStudentDTO,
    UpdateStudentDTO,
} = require('../dtos/student.dto');
const constants = require('../config/constants');
const config = require('../config/config');

const getStudentList = catchAsync(async (req, res) => {
    const getStudentListDTO = new GetStudentListDTO({ ...req.query, ...req.params, ...req.body })
    const studentList = await studentService.getStudentList(getStudentListDTO);

    return res.status(httpStatus.OK).json(studentList);
})

const createStudent = catchAsync(async (req, res) => {
    // validation : password and passwordConfirm is equal
    const { password, passwordConfirm } = { ...req.query, ...req.params, ...req.body }
    if (password !== passwordConfirm) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'password and passwordConfirm must be equal')
    }

    // validation : check walletAddress already used
    const { walletAddress } = { ...req.query, ...req.params, ...req.body }
    if (await studentService.getStudentByWalletAddress(walletAddress)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'walletAddress already used')
    }

    // validation : check studentId already used
    const { studentId } = { ...req.query, ...req.params, ...req.body }
    if (await studentService.getStudentById(studentId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'studentId already used')
    }

    const { rawTransaction, studentHash} = { ...req.query, ...req.params, ...req.body }

    // md5, salt를 사용한 password 암호화, db에 저장되는 값은 암호화된 password 입니다.
    const md5password = authService.hashPassword(password);
    const salt = authService.generateSalt();
    const hashPassword = authService.getSaltPassword(salt, md5password);

    // DB create student
    // tx전송 후 DB에 등록 -> 소켓 폴링에 의해 확정 상태라면 is_active = 1로 변경
    try{
        const receipt = await caverService.sendRawTransactionWithSignAsFeePayer(rawTransaction)

        const createStudentDTO = new CreateStudentDTO({ ...req.query, ...req.params, ...req.body, salt, password: hashPassword, transactionHash: receipt.transactionHash, studentHash:studentHash })
        const student = await studentService.createStudent(createStudentDTO);

        return res.status(httpStatus.CREATED).json({
            ...student,
            // receipt
        });
    } 
    catch(error){
        //await studentService.deleteStudent(createStudentDTO.student_id)
        throw new ApiError(error.response?.status || 500, error.message);
    }
    
    // 블록체인 등록 및 return
//     try {
//     const txReceipt = await caverService.registerStudent(
//       config.contract.studentManagerContractAddress,  // StudentManager 컨트랙트 주소
//       studentId,                          // ex. "20250001"
//       walletAddress                       // msg.sender 역할의 지갑 주소
//     );
//     // 최종 응답에 txHash 함께 포함
//     return res.status(httpStatus.CREATED).json({
//       ...student,
//       chainTxHash: txReceipt.transactionHash,
//     });
//   } catch (chainErr) {
//     // // 블록체인 등록 실패 시 DB 롤백 (선택사항)
//     await studentService.deleteStudent(createStudentDTO.student_id);
//     throw new ApiError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       `Student registered in DB but failed on-chain: ${chainErr.message}`
//     );
//   }
})

const getStudentById = catchAsync(async (req, res) => {
    const { role, studentId: verifiedStudentId } = { ...req.verifiedPayload }
    const { studentId } = { ...req.query, ...req.params, ...req.body }
    if (role === constants.ROLE.STUDENT && verifiedStudentId !== studentId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized client")
    }

    const student = await studentService.getStudentById(studentId);
    if (!student) {
        throw new ApiError(httpStatus.NOT_FOUND, 'student not found')
    }

    return res.status(httpStatus.OK).json(student);
})

const updateStudent = catchAsync(async (req, res) => {
    const { role, studentId: verifiedStudentId } = { ...req.verifiedPayload }
    const { studentId } = { ...req.query, ...req.params, ...req.body }
    if (role === constants.ROLE.STUDENT && verifiedStudentId !== studentId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized client")
    }

    const student = await studentService.getStudentById(studentId);
    if (!student) {
        throw new ApiError(httpStatus.NOT_FOUND, 'student not found')
    }

    const updateStudentDTO = new UpdateStudentDTO({ ...req.query, ...req.params, ...req.body })
    const updatedStudent = await studentService.updateStudent(studentId, updateStudentDTO);

    return res.status(httpStatus.OK).json(updatedStudent);
})

const deleteStudent = catchAsync(async (req, res) => {
    const { role, studentId: verifiedStudentId } = { ...req.verifiedPayload }
    const { studentId } = { ...req.query, ...req.params, ...req.body }
    if (role === constants.ROLE.STUDENT && verifiedStudentId !== studentId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized client")
    }

    const student = await studentService.getStudentById(studentId);
    if (!student) {
        throw new ApiError(httpStatus.NOT_FOUND, 'student not found')
    }

    await studentService.deleteStudent(studentId);

    return res.sendStatus(httpStatus.NO_CONTENT);
})

module.exports = {
    getStudentList,
    createStudent,
    getStudentById,
    updateStudent,
    deleteStudent,
}
