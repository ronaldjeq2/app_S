export const BIRTHDAY_SUCCESS = "BIRTHDAY_SUCCESS";
export const BIRTHDAY_REQUEST = "BIRTHDAY_REQUEST";
export const BIRTHDAY_REQUEST_ERROR = "BIRTHDAY_REQUEST_ERROR";
export const BIRTHDAY_UPDATELIST = "BIRTHDAY_UPDATELIST";
export const BIRTHDAY_SETLIST = "BIRTHDAY_SETLIST";
export const BIRTHDAY_EXISTLISTDAY = "BIRTHDAY_EXISTLISTDAY";

export const birthdaysuccess = birthdayList => ( {
    type: BIRTHDAY_SUCCESS,
    birthdayList,
} );
export const birthdayRequest = ref_date => ( {
    type: BIRTHDAY_REQUEST,
    ref_date,
} );
export const birthdayUpdatelist = () => ( {
    type: BIRTHDAY_UPDATELIST,
} );
export const birthdaySetlist = ( listhappybirthday, listnothappybirthday ) => ( {
    type: BIRTHDAY_SETLIST,
    listnothappybirthday,
    listhappybirthday,
} );

export const birthdayExistday = () => ( {
    type: BIRTHDAY_EXISTLISTDAY,
} );
