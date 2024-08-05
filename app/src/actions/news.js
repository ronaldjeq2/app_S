export const NEWSLIST_REQUEST = "NEWSLIST_REQUEST";
export const NEWSLIST_SUCCES = "NEWSLIST_SUCCES";
export const NEWSDETAILS_SUCCES = "NEWSDETAILS_SUCCES";

export const newsListRequest = ( url, typeRequest ) => ( {
    type: NEWSLIST_REQUEST,
    url,
    typeRequest,
} );
export const newsListSuccess = () => ( {
    type: NEWSLIST_SUCCES,
} );

export const newsDetailsSuccess = () => ( {
    type: NEWSDETAILS_SUCCES,
} );
