const BookmarksService = require('../src/bookmarks-service');

const knex = require('knex');
const { expect } = require('chai');

describe(`Bookmarks service object`, function () {
  let db;
  let testBookmarks = [
    {
      id: 1,
      url: 'www.google.com',
      title: 'google',
      description: 'search engine',
      rating: 5,
    },
    {
      id: 2,
      url: 'www.youtube.com',
      title: 'youtube',
      description: 'video sharing site',
      rating: 5,
    },
    {
      id: 3,
      url: 'www.facebook.com',
      title: 'facebook',
      description: 'depressing site',
      rating: 1,
    },
  ];
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  before(() => db('bookmarks').truncate());

  afterEach(() => db('bookmarks').truncate());

  after(() => db.destroy());

  context(`Given 'bookmarks' has data`, () => {
    beforeEach(() => {
      return db.into('bookmarks').insert(testBookmarks);
    });

    it(`deleteBookmark() removes a bookmark by id from 'bookmarks' table`, () => {
      const bookmarkId = 3;
      return BookmarksService.deleteBookmark(db, bookmarkId)
        .then(() => BookmarksService.getAllBookmarks(db, bookmarkId))
        .then(allBookmarks => {
          [
            {
              id: 1,
              url: 'www.google.com',
              title: 'google',
              description: 'search engine',
              rating: 5,
            },
            {
              id: 2,
              url: 'www.youtube.com',
              title: 'youtube',
              description: 'video sharing site',
              rating: 5,
            },
          ];
          const expected = testBookmarks.filter(
            bookmark => bookmark.id !== bookmarkId
          );
          expect(allBookmarks).to.eql(expected);
        });
    });

    it(`getById() resolves a bookmark by id from 'bookmarks' table`, () => {
      const thirdId = 3;
      const thirdTestBookmark = testBookmarks[thirdId - 1];
      return BookmarksService.getById(db, thirdId).then(actual => {
        expect(actual).to.eql({
          id: thirdId,
          url: thirdTestBookmark.url,
          title: thirdTestBookmark.title,
          description: thirdTestBookmark.description,
          rating: thirdTestBookmark.rating,
        });
      });
    });

    it(`getAllBookmarks() resolves all bookmarks from 'bookmarks' table`, () => {
      return BookmarksService.getAllBookmarks(db).then(actual => {
        expect(actual).to.eql(testBookmarks);
      });
    });
  });

  context(`Given 'bookmarks' has no data`, () => {
    it(`getAllBookmarks() resolves an empty array`, () => {
      return BookmarksService.getAllBookmarks(db).then(actual => {
        expect(actual).to.eql([]);
      });
    });
    it(`insertBookmark() inserts a new bookmark and resolves the new bookmark with an 'id'`, () => {
      const newBookmark = {
        url: 'www.strongateverysize.com',
        title: 'strong at every size',
        description: 'personal training site',
        rating: 5,
      };
      return BookmarksService.insertBookmark(db, newBookmark).then(actual => {
        expect(actual).to.eql({
          id: 1,
          url: newBookmark.url,
          title: newBookmark.title,
          description: newBookmark.description,
          rating: newBookmark.rating,
        });
      });
    });
  });
});
