const expect = require('chai').expect;
const faker = require('faker');
const sinon = require('sinon');

const api = require('../src/meetup/api');
const renderer = require('../src/meetup/renderer');
const Meetup = require('../src/meetup/model');

const getUpcomingMeetups = require('../src/getUpcomingMeetups');

describe('getUpcomingMeetups', () => {
  const TOKEN = { key: 'SECRET' };
  const sandbox = sinon.sandbox.create();

  beforeEach(() => {
    sandbox.stub(api, 'upcomingMeetup');
    sandbox.stub(renderer, 'render');
  });

  afterEach(() => sandbox.restore());

  it('returns the next upcoming meetup', (done) => {
    const meetup = new Meetup({
      group: { name: faker.hacker.noun() },
    });

    api.upcomingMeetup
      .withArgs(meetup.groupName, TOKEN)
      .returns(Promise.resolve(meetup));

    renderer.render
      .withArgs(meetup)
      .returns(meetup);

    getUpcomingMeetups([meetup.groupName], TOKEN)
      .then((upcomingMeetups) => { expect(upcomingMeetups).to.eql([meetup]); })
      .then(done).catch(err => done(err));
  });

  it('returns multiple upcoming meetups', (done) => {
    const someMeetup = new Meetup({
      group: { name: faker.hacker.noun() },
    });

    const anotherMeetup = new Meetup({
      group: { name: faker.hacker.noun() },
    });

    api.upcomingMeetup
      .withArgs(someMeetup.groupName, TOKEN)
      .returns(Promise.resolve(someMeetup));

    api.upcomingMeetup
      .withArgs(anotherMeetup.groupName, TOKEN)
      .returns(Promise.resolve(anotherMeetup));

    renderer.render
      .withArgs(someMeetup)
      .returns(someMeetup);

    renderer.render
      .withArgs(anotherMeetup)
      .returns(anotherMeetup);

    const wantedMeetups = [someMeetup.groupName, anotherMeetup.groupName];

    getUpcomingMeetups(wantedMeetups, TOKEN)
      .then((upcomingMeetups) => {
        expect(upcomingMeetups).to.eql([someMeetup, anotherMeetup]);
      }).then(done).catch(err => done(err));
  });

  it('sorts upcoming meetups by time, returning the upcoming first', (done) => {
    const firstMeetup = new Meetup({
      time: new Date('2017-06-02T06:00:00+10:00'),
      group: { name: faker.hacker.noun() },
    });

    const secondMeetup = new Meetup({
      time: new Date('2017-06-02T06:30:00+10:00'),
      group: { name: faker.hacker.noun() },
    });

    const thirdMeetup = new Meetup({
      time: new Date('2017-06-02T07:00:00+10:00'),
      group: { name: faker.hacker.noun() },
    });

    api.upcomingMeetup
      .withArgs(firstMeetup.groupName, TOKEN)
      .returns(Promise.resolve(firstMeetup));

    api.upcomingMeetup
      .withArgs(secondMeetup.groupName, TOKEN)
      .returns(Promise.resolve(secondMeetup));

    api.upcomingMeetup
      .withArgs(thirdMeetup.groupName, TOKEN)
      .returns(Promise.resolve(thirdMeetup));

    renderer.render
      .withArgs(firstMeetup)
      .returns(firstMeetup);

    renderer.render
      .withArgs(secondMeetup)
      .returns(secondMeetup);

    renderer.render
      .withArgs(thirdMeetup)
      .returns(thirdMeetup);

    const unorderedMeetups = [
      thirdMeetup.groupName,
      firstMeetup.groupName,
      secondMeetup.groupName,
    ];

    getUpcomingMeetups(unorderedMeetups, TOKEN)
      .then((upcomingMeetups) => {
        expect(upcomingMeetups).to.eql([firstMeetup, secondMeetup, thirdMeetup]);
      }).then(done).catch(err => done(err));
  });

  it('ignores malformed meetups from API', (done) => {
    const meetup = new Meetup({
      group: { name: faker.hacker.noun() },
    });

    const malformedMeetup = new Meetup(undefined);

    api.upcomingMeetup
      .withArgs(meetup.groupName, TOKEN)
      .returns(Promise.resolve(meetup));

    api.upcomingMeetup
      .withArgs(undefined, TOKEN)
      .returns(Promise.resolve(malformedMeetup));

    renderer.render
      .withArgs(meetup)
      .returns(meetup);

    getUpcomingMeetups([meetup.groupName, undefined], TOKEN)
      .then((upcomingMeetups) => { expect(upcomingMeetups).to.eql([meetup]); })
      .then(done).catch(err => done(err));
  });
});
