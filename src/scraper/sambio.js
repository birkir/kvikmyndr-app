const request = require('request');
const cheerio = require('cheerio');

const fetchBody = date => new Promise((resolve, reject) => {
  const dt = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  const body = 'TheatreArea=1002&dt='+dt+'&tm=&genre=&X-Requested-With=XMLHttpRequest&area=1002';
  const options = {
    url: 'http://www.sambio.is/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest, XMLHttpRequest',
    },
    body,
  };

  request(options, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      resolve(body);
    } else {
      reject(err);
    }
  });
});

const identifyMovie = el => {
  var name = el.find('.scheduleEventInfoEventName').text();
  var flags = [];
  name = name.replace(/(\(?íslenska\)?|\(?3D\)?)/, found => {
    flags.push(found.replace(/^\(/, '').replace(/\)$/, ''));
    if (found[0] === '(') return '';
    return found;
  });
  name = name.trim();
  return {
    name,
    flags,
  };
};

fetchBody(new Date())
.then(data => new Promise(resolve => {
  const $ = cheerio.load(data);
  const items = [];
  $('.scheduleEventBlock').each(function(i, block) {
    const el = $(this);
    var item = identifyMovie(el);
    var parsed = el.find('.scheduleEventShows').children();
    item.showtimes = [];
    var cinema;
    parsed.each(function(i, block) {
      var node = $(this);
      if (node.get(0).tagName === 'div') {
        cinema = 'Sambíóin ' + node.text().split(',').shift().trim();
      }
      if (node.get(0).tagName === 'a') {
        var hall = node.attr('title').trim();
        var ticketUrl = node.attr('href');
        var hour = node.text().trim();
        item.showtimes.push({
          cinema,
          hall,
          ticketUrl,
          hour,
          flags: item.flags,
        });
      }
    });
    items.push(item);
  });
  setTimeout(() => resolve(items), 110);
}))
.then(movies => {
  // Match movies up with themoviedb
  var runner = movies.map(movie => new Promise(resolve => {
    request('https://api.themoviedb.org/3/search/movie?query='+encodeURIComponent(movie.name)+'&api_key=' + api, (err, res, body) => {
      var data = JSON.parse(body);
      if (data.results.length > 0) {
        movie.tmdb = data.results.shift();
      }
    })
  }));

  runner[0]();
});
