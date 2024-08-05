import {
    COURSE_CURRENT_SUCCESS,
    COURSE_REQUEST,
    COURSE_HISTORY_SUCCESS,
    COURSE_DETAIL_REQUEST,
    COURSE_DETAIL_SUCCESS,
    COURSE_SCHEDULE_REQUEST,
    COURSE_SCHEDULE_SUCCESS,
    ASSISTANCE_REQUEST,
    ASSISTANCE_SUCCESS,
} from "../actions/course";

const initialState = {
    isLoadedCurrent: false,
    isLoadedHistory: false,
    isLoadedAssistance: false,
    detail: {},
    isloadedDetail: false,
    scheduleListByNRC: {},
    scheduleIsLoading: true,
    assitanceCourse: {},
    courseList: {
        current: [],
        historical: [],
    },
    lastUpdated: null,
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
    case COURSE_REQUEST:
        return {
            ...state,
            // isLoadedCurrent: false,
            // isLoadedHistory: false,
        };
    case COURSE_CURRENT_SUCCESS:
        return {
            ...state,
            courseList: action.courseList,
            isLoadedCurrent: true,
            lastUpdated: action.lastUpdated,
        };
    case COURSE_HISTORY_SUCCESS:
        return {
            ...state,
            courseList: action.courseList,
            isLoadedHistory: true,
            lastUpdated: action.lastUpdated,
        };
    case COURSE_DETAIL_REQUEST:
        return {
            ...state,
            isloadedDetail: false,
        };
    case COURSE_DETAIL_SUCCESS:
        return {
            ...state,
            detail: action.detail,
            isloadedDetail: true,
            lastUpdated: action.lastUpdated,
        };
    case COURSE_SCHEDULE_REQUEST:
        return {
            ...state,
            scheduleIsLoading: true,
        };

    case COURSE_SCHEDULE_SUCCESS:
        return {
            ...state,
            scheduleListByNRC: {
                ...state.scheduleListByNRC,
                ...action.scheduleListByNRC,
            },
            // courseList: action.courseList,
            lastUpdated: action.lastUpdated,
            scheduleIsLoading: false,
        };
    case ASSISTANCE_REQUEST:
        return {
            ...state,
            isLoadedAssistance: false,
        };

    case ASSISTANCE_SUCCESS:
        return {
            ...state,
            assitanceCourse: action.assitanceCourse,
            lastUpdated: action.lastUpdated,
            isLoadedAssistance: true,
        };

    default:
        return state;
    }
};

export default reducer;
