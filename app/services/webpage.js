const Webpage 	= require('../models/webpage')

module.exports = {

  fillWebpage: function(result, user){
      let webpage = new Webpage()

	    let meta = {
            titles : [result.meta.title, result.extract.title, result.extract.softTitle],
            authors: [result.meta.author, result.extract.author],
            descriptions : [result.meta.description, result.extract.description],
            images : [result.meta.image, result.extract.image],
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
        webpage.author = result.extract.author;
        webpage.description = result.extract.description;
        webpage.image = result.extract.image; 
        webpage.url = result.meta.url;
        webpage.user = user;
        webpage.meta = meta;

        return webpage;

  },   

};