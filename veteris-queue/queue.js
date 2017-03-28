var kue = require('kue');     
var queue = kue.createQueue();   
var metaInspector = require('node-metainspector');
var parseDomain = require('parse-domain');
var extractor = require('unfluff');
var request = require('request');


queue.watchStuckJobs(6000);

queue.on('ready', () => {  
  // If you need to 
  console.info('Queue is ready!');
});

queue.on('error', (err) => {  
  // handle connection errors here
  console.error('There was an error in the main queue!');
  console.error(err);
  console.error(err.stack);
});


queue.process('addWebpage', 20, (job, done) => {  
  var client = new metaInspector(job.data.name, { timeout: 5000 });

  client.on("fetch", function(){
      var parseUrl = parseDomain(job.data.name);

      var unfluff = extractor(job.data.name,"en");

      request(job.data.name, function (error, response, body) {
        var unfluff =  extractor(body,"en");
        var parseWebpage = extract(client, parseUrl, unfluff);
        done(null, {webpage: parseWebpage, user: job.data.user});
      });
  });

  client.on("error", function(err){
      console.log(err);
  });

  client.fetch();  
  
});

var extract = function(client, parseUrl, unfluff){
  var parseWebpage = {
    extract: {},
    meta : {}
  };

  parseWebpage.parseUrl = parseUrl;

  parseWebpage.meta.title = client.title; // # title of the page, as string
  parseWebpage.meta.author = client.author;  //  # page author, as string
  parseWebpage.meta.description = client.description;  // # returns the meta description, or the first long paragraph if no meta description is found
  parseWebpage.meta.image = client.image; // # Most relevant image, if defined with og:image
  parseWebpage.meta.url = client.url; // # URL of the page
  parseWebpage.meta.scheme = client.scheme;   // # Scheme of the page (http, https)
  parseWebpage.meta.charset = client.charset;  //  # page charset from meta tag, as string
  //parseWebpage.meta.keywords = client.keywords; //  # keywords from meta tag, as array
  //parseWebpage.meta.host = client.host;  //  # Hostname of the page (like, markupvalidator.com, without the scheme)
  //parseWebpage.meta.rootUrl = client.rootUrl; //  # Root url (scheme + host, i.e http://simple.com/)
  //parseWebpage.meta.links = client.links;  // # array of strings, with every link found on the page as an absolute URL
  //parseWebpage.meta.images = client.images; // # array of strings, with every img found on the page as an absolute URL
  //parseWebpage.meta.feeds = client.feeds;  // # Get rss or atom links in meta data fields as array
  //parseWebpage.meta.ogTitle = client.ogTitle; //  # opengraph title
  //parseWebpage.meta.ogDescription = client.ogDescription;  // # opengraph description
  //parseWebpage.meta.ogType = client.ogType; // # Open Graph Object Type
  //parseWebpage.meta.ogUpdatedTime = client.ogUpdatedTime; // # Open Graph Updated Time
  //parseWebpage.meta.ogLocale = client.ogLocale;  //# Open Graph Locale - for languages

  parseWebpage.extract.title = client.title; // #  The document's title (from the <title> tag)
  parseWebpage.extract.softTitle  = client.softTitle;   // #  A version of title with less truncation
  parseWebpage.extract.author  = client.author ; // # The document's author
  parseWebpage.extract.description   = client.description; // # The description of the document, from <meta> tags
  parseWebpage.extract.image   = client.image ; //  #  The main image for the document (what's used by facebook, etc.)
  parseWebpage.extract.canonicalLink  = client.canonicalLink; // The canonical url of the document, if given.
  parseWebpage.extract.date  = client.date;  // #  The document's publication date
  parseWebpage.extract.copyright  = client.copyright ; //  # The document's copyright line, if present
  parseWebpage.extract.publisher  = client.publisher ;  //  #The document's publisher (website name)
  //parseWebpage.extract.text  = client.text ;  //  #  The main text of the document with all the junk thrown away
  parseWebpage.extract.lang   = client.lang; // # The language of the document, either detected or supplied by you.
  parseWebpage.extract.tags = client.tags;  // # Any tags or keywords that could be found by checking <rel> tags or by looking at href urls.
  //parseWebpage.extract.videos  = client.videos ;  //  #  An array of videos that were embedded in the article. Each video has src, width and height.
  //parseWebpage.extract.links   = client.links; // #  An array of links embedded within the article text. (text and href for each)
  //parseWebpage.extract.favicon   = client.favicon; // # The url of the document's favicon.



  return parseWebpage;
}

