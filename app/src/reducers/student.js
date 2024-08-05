import { ACCOUNT_REQUEST_INFO, ACCOUNT_REQUEST_INFO_SUCCESS } from "../actions/student";

const initialState = {
    id: null,
    pidm: null,
    isLoading: false,
    hasStudentCard: false,
    hasWorkCard: false,
    workerDetail: {
        Zonal: "",
        Cargo: "",
        Fecha_Cese: "",
    },
    studentCard: {
        career: "",
        program: "",
    },
    hasPhoto: false,
    photo: {
        height: 150,
        width: 150,
    },
    docType: null,
    numDoc: null,
    firstName: null,
    middleName: null,
    lastName: null,
    addressList: [
        // {
        //     key: "",
        //     address: "",
        //     district: "",
        //     type: "",
        // },
    ],
    phoneList: [
        // {
        //     key: "",
        //     number: "",
        //     type: "",
        // }
    ],
    emailList: [
        // {
        //     key: "",
        //     code: "PERS",
        //     email: "asds@asd.com",
        //     status: "active",
        //     preferred: true,
        // },
    ],
    lastUpdated: null,
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
    case ACCOUNT_REQUEST_INFO:
        return {
            ...state,
            isLoading: true,
        };
    case ACCOUNT_REQUEST_INFO_SUCCESS:
        return {
            ...state,
            ...action.userInfo,
            isLoading: false,
        };
    default:
        return state;
    }
};

export default reducer;
