const expect = require('chai').expect;
const faker = require('faker');

const MeetupRenderer = require('../../src/meetup/renderer');

describe('renderer', () => {
  it('renders the upcoming meetup', () => {
    const meetup = {
      name: faker.hacker.adjective(),
      time: new Date('2017-05-04T18:00:00+10:00'),
      duration: 10800000,
      group: {
        name: faker.hacker.noun(),
      },
      link: faker.internet.url(),
    };

    const groupName = `${meetup.group.name}`;
    const meetupName = meetup.name;
    const date = 'May 4, 6:00 PM to 9:00 PM';
    const meetupLink = meetup.link;

    expect(MeetupRenderer.render(meetup)).to
      .eql(`> *${groupName}* :: ${meetupName} - ${date} - ${meetupLink}`);
  });

  it('calculates times for different timezones', () => {
    const meetup = {
      name: faker.hacker.adjective(),
      time: new Date('2017-05-04T18:00:00+10:00'),
      duration: 10800000,
      venue: {
        city: 'Tokyo',
        localized_country_name: 'Asia',
      },
      group: {
        name: faker.hacker.noun(),
      },
      link: faker.internet.url(),
    };

    expect(MeetupRenderer.render(meetup)).to.contains('May 4, 5:00 PM to 8:00 PM');
  });

  it('uses Australia/Sydney as default timezone when given city is unknown', () => {
    const meetup = {
      name: faker.hacker.adjective(),
      time: new Date('2017-05-04T18:00:00+10:00'),
      duration: 10800000,
      venue: {
        city: 'Unkown',
        localized_country_name: 'Asia',
      },
      group: {
        name: faker.hacker.noun(),
      },
      link: faker.internet.url(),
    };

    expect(MeetupRenderer.render(meetup)).to.contains('May 4, 6:00 PM to 9:00 PM');
  });

  it('uses Australia/Sydney as default timezone when given country is unknown', () => {
    const meetup = {
      name: faker.hacker.adjective(),
      time: new Date('2017-05-04T14:00:00+10:00'),
      duration: 10800000,
      venue: {
        city: 'New_York',
        localized_country_name: 'Unknown',
      },
      group: {
        name: faker.hacker.noun(),
      },
      link: faker.internet.url(),
    };

    expect(MeetupRenderer.render(meetup)).to.contains('May 4, 2:00 PM to 5:00 PM');
  });
});
