import session from "./session";
import sinfo from "./sinfo";
import student from "./student";
import birthday from "./birthday";
import error from "./error";
import course from "./course";
import classtimes from "./classtimes";
import permissions from "./permissions";
import notification from "./notification";
import network from "./network";
import news from "./news";
import payments from "./payments";
import appVersion from "./appVersion";
import places from "./places";

const reducers = {
    student,
    session,
    birthday,
    error,
    sinfo,
    course,
    classtimes,
    permissions,
    notification,
    network,
    news,
    payments,
    appVersion,
    places
};

export default reducers;
