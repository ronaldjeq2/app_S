/**
 * # news/handlers.js
 *
 * Get news from scrapping
 *
 */
'use strict';
const cheerio = require('cheerio'),
    rp = require('request-promise'),
    dateUtils = require('../../common/date');

const __MAIN_DOMAIN__ = "http://www.senati.edu.pe"
let internals = {};
/**
 * ## restrictedArea - you can only reach here if you've passed
 * authentication
 *
 * note: the user name is available from the credentials!
 */
internals.getList = function (request, h) {

    let page = request.params.page ? request.params.page : 0;
    try {

        const options = {
            uri: __MAIN_DOMAIN__ + '/noticias-y-eventos?type=2&page=' + page,
            transform: function (body) {
                return cheerio.load(body, { ignoreWhitespace: true });
            }
        };

        let news_list = [];
        let item;

        const response = rp(options)
            .then(function ($) {

                $(".especialidad-carreras--content").each(function (i, elem) {
                    item = {
                        href: $(this).find("a").attr("href"),
                        date: $(this).find(".box_notievento p").text().trim(),
                        title: $(this).find("h2 a").text().trim(),
                        shortDesc: $(this).find("p.trunc_dos").text().trim(),
                        thumbnail: $(this).find("img").attr("src"),
                    }

                    item.date = dateUtils.string_to_date_es(item.date);

                    news_list.push(item);

                });

                return (news_list);

            })
            .catch(function (err) {
                console.log(err);
                return err
            });
        return response
    }
    catch (e) {
        console.log(e);
        return e
    }
};
const getObjGallery = async function (item) {
    const probe = require('probe-image-size')
    let response;
    await probe(item).then(result => {
        response = result
    }).catch(e => {
        console.log(e)
        response = { 'error': e }
    })
    return response
}
internals.get = async function (request, h) {

    const href = request.payload.href;
    const probe = require('probe-image-size')
    let resultImages;

    const options = {
        uri: __MAIN_DOMAIN__ + href,
        transform: function (body) {
            return cheerio.load(body, { ignoreWhitespace: true });
        }
    };

    await rp(options)
        .then(async function ($) {
            let item = {
                title_white: $(".titulos_internos h2").text().trim().split('\n')[0].trim(),
                title_color: (
                    $(".titulos_internos h2").text().trim().split('\n')[1] || ""
                ).trim(),
                headResume: $(".textos_intban.text_cb_linea p").text().trim(),
                richText: $(".rich-text").html().replace(/\n/g, "").trim(),
                gallery: $('.galeria__item').map(function (i, el) { return $(this).attr('href'); }).get(),
                bgImage: $('.contbaninter').attr('style').split("'")[1],
                objGallery: [],
                objBgImage: {}
            }

            let aGallery = [];

            await probe(item.bgImage)
                .then(result => {
                    item.objBgImage = result;
                    // console.log(result);

                    if (!item.gallery || item.gallery.length === 0) {
                        return (item);
                    }
                    return result;
                }).then(async function () {
                    for (let i = 0; i < item.gallery.length; i++) {

                        const resultGallery = await getObjGallery(item.gallery[i]);
                        item.objGallery.push(resultGallery)
                        // console.log(resultGallery)
                        // console.log(item.objGallery)
                        if (resultGallery.error) {
                            console.log('error if')
                            resultImages = resultGallery;
                        }
                        if (item.objGallery.length === item.gallery.length) {
                            resultImages = item
                        }


                        // return probe(item.gallery[i])
                        //     .then(result => {
                        //         console.log('function4')
                        //         item.objGallery.push(result);
                        //         if (item.objGallery.length === item.gallery.length) {
                        //             return (item)
                        //         }
                        //     });
                    }
                    return resultImages
                });

            // return reply(item)

        })
        .catch(function (err) {
            console.log(err);
        });
    return resultImages
}

module.exports = internals;
