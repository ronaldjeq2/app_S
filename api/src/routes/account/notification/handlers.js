const api_user = require("../../../database/banner_api/usr_info");
const Boom = require('boom');
let internals = {};

internals.getNotificationTags = async function (request, h) {
    let credentials = request.auth.credentials;

    const db = request.app.db;

    const queryUserInfo = await db.execute(
        ...api_user.get_identification(credentials.pidm)
    );

    let tags = {
        userId: credentials.pidm,
        firstName: queryUserInfo.rows[0]["FIRST_NAME"]
    };

    return {
        data: { tags },
        tags
    };
};

internals.postNotificationToken = function (request, h) {
    let credentials = request.auth.credentials;

    let token = request.payload.token;

    const db = request.mongo.db;

    db.collection("devices").updateOne(
        { playerId: token },
        {
            $set: {
                pidm: credentials.pidm,
                lastModified: new Date()
            }
        },
        { upsert: true }
    );
    return {};
};

internals.getNotifications = async function (request, h) {
    let credentials = request.auth.credentials;
    const dbOracle = request.app.db;
    const db = request.mongo.db;
    const queryUserInfo = await dbOracle.execute(
        ...api_user.get_identification(credentials.pidm)
    );
    const firstName = queryUserInfo.rows[0]["FIRST_NAME"]
    const arrayNotifications = [];
    return await db
        .collection("notification")
        .find({ users: credentials.pidm })
        .project({ users: 0 })
        .sort({ createdDate: -1 })
        .toArray()
        .then(result => {
            result.map(item => {
                if (item.title.includes(" {{ firstName |") || item.message.includes(" {{ firstName |")) {
                    item.title = item.title.replace(/ *\{{[^}}]*\}} */g, ` ${firstName} `);
                    item.message = item.message.replace(/ *\{{[^}}]*\}} */g, ` ${firstName} `);
                }
                const dateString = item.createdDate.toISOString().split('T')[0];
                const dateFragment = dateString.split('-')
                item.created = `${dateFragment[2]}-${dateFragment[1]}-${dateFragment[0]}`;
                arrayNotifications.push(item)
            })
            return arrayNotifications;
        }).catch(e => {
            console.log(e);
            return Boom.badGateway(e.message)
        });;
};

internals.createNotification = async function (request, h) {
    let credentials = request.auth.credentials;
    /**
     * HardCoded Auth
     */
    const authorizedId = [111012];

    if (!credentials.pidm in authorizedId) {
        return Boom.unauthorized();
    }

    const { title, message, icon, linkPath, linkLabel, users } = request.payload;

    const db = request.mongo.db;

    /* Find player Id by userId */
    const devicesByUser = await db
        .collection("devices")
        .find({ pidm: { $in: users } })
        .project({ playerId: 1, pidm: 1, _id: 0 })
        .toArray();

    const playerIds = devicesByUser.map(device => device.playerId);
    const userIds = devicesByUser.map(device => device.pidm);

    const notification = {
        headings: { es: title, en: title },
        contents: { es: message, en: message },
        include_player_ids: playerIds
    };

    const today = fnsFormat(new Date(), "DD-MM-YYYY");

    const query = await db.collection("notification").insertOne({
        title,
        message,
        linkLabel,
        linkPath,
        icon,
        createdDate: new Date(),
        created: today,
        createdBy: credentials.pidm,
        source: "api",
        users: userIds
    });

    onesignal.sendNotification(notification);

    return query.result;
};

module.exports = internals;
