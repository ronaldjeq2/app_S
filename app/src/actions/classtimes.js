export const CLASSTIMES_SUCCESS = "CLASSTIMES_SUCCESS";
export const CLASSTIMES_REQUEST = "CLASSTIMES_REQUEST";

export const classtimesSucces = classTimesList => ( {
    type: CLASSTIMES_SUCCESS,
    classTimesList,
} );
export const classtimesRequest = actualDate => ( {
    type: CLASSTIMES_REQUEST,
    actualDate,
} );
