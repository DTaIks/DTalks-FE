import * as yup from 'yup';

export const signUpSchema = yup.object({
  email: yup
    .string()
    .required('이메일을 입력해 주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
  authCode: yup
    .string()
    .required('인증번호를 입력해 주세요.')
    .length(6, '인증번호 6자리를 입력하세요.'),
  employeeNumber: yup
    .string()
    .required('사원번호를 입력해 주세요.')
    .min(4, '유효하지 않은 사원번호입니다.'),
  password: yup
    .string()
    .required('비밀번호를 입력해 주세요.')
    .min(8, '비밀번호는 8~20자여야 합니다.')
    .max(20, '비밀번호는 8~20자여야 합니다.')
    .matches(/[a-zA-Z]/, '비밀번호는 문자, 숫자, 특수문자를 포함해야 합니다.')
    .matches(/\d/, '비밀번호는 문자, 숫자, 특수문자를 포함해야 합니다.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, '비밀번호는 문자, 숫자, 특수문자를 포함해야 합니다.'),
  passwordCheck: yup
    .string()
    .required('비밀번호를 다시 입력해 주세요.')
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다.')
}).required();

export type SignUpFormData = yup.InferType<typeof signUpSchema>;
