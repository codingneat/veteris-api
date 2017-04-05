const Webpage 	= require('../models/webpage')

module.exports = {

  fillWebpage: function(result, user){
      let webpage = new Webpage()

	    let meta = {
            tags : result.extract.tags,
            charset: result.meta.charset,
            canonicalLink: result.extract.canonicalLink,
            lang: result.extract.lang,
            publisher: result.extract.publisher,
            copyright: result.extract.copyright,
            url: {
              scheme: result.meta.scheme,
              tld: result.parseUrl.tld,
              domain: result.parseUrl.domain,
              subdomain: result.parseUrl.subdomain
            }
        }

        webpage.title = result.extract.title;
        webpage.author = (result.extract.author != null && result.extract.author != undefined) ? result.extract.author : "";
        webpage.description = (result.extract.description != null && result.extract.description != undefined) ? result.extract.description : "";
        webpage.image = (result.extract.image != null && result.extract.image != undefined) ? result.extract.image : ""; 
        webpage.url =  (result.meta.url != null && result.meta.url != undefined) ? result.meta.url : "";
        webpage.user = user;
        webpage.meta = meta;

        return webpage;

  },   

};