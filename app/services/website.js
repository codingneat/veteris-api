const Website = require('../models/website')

module.exports = {

    checkWebsite: function (result, cb) {
        let website = new Website()

        let url = "";
        if (result.parseUrl.subdomain == "") {
            url = result.meta.scheme + '://' + result.parseUrl.domain + "." + result.parseUrl.tld
        } else {
            url = result.meta.scheme + '://' + result.parseUrl.subdomain + "." + result.parseUrl.domain + result.parseUrl.tld
        }

        Website
            .findOne({ 'url': url })
            .exec(function (err, website) {
                if (err) console.log(err)

                if (website == null) {
                    website = new Website()
                    website.url = url;
                }
                return cb(null, website);
            })
    },

};