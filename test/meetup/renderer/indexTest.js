const expect = require('chai').expect;
const faker = require('faker');

const MeetupRenderer = require('../../../src/meetup/renderer');
const Meetup = require('../../../src/meetup/model');

describe('meetup/renderer', () => {
  describe('#render', () => {
    it('renders the upcoming meetup', () => {
      const meetup = new Meetup({
        name: faker.hacker.adjective(),
        time: new Date('2017-05-04T18:00:00+10:00'),
        duration: 10800000,
        group: {
          name: faker.hacker.noun(),
        },
        link: faker.internet.url(),
      });

      const groupName = `${meetup.groupName}`;
      const meetupName = meetup.name;
      const date = 'May 4, 6:00 PM to 9:00 PM';
      const meetupUrl = meetup.url;

      expect(MeetupRenderer.render(meetup)).to
        .eql(`> *${groupName}* :: ${meetupName} - ${date} - ${meetupUrl}`);
    });
  });
});
