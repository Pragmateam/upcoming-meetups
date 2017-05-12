const expect = require('chai').expect;
const faker = require('faker');
const sinon = require('sinon');

const api = require('../src/meetup/api');
const renderer = require('../src/meetup/renderer');

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
    const meetup = {
      group: { name: faker.hacker.noun() },
    };

    api.upcomingMeetup
      .withArgs(meetup.group.name, TOKEN)
      .returns(Promise.resolve(meetup));

    renderer.render
      .withArgs(meetup)
      .returns(meetup);

    getUpcomingMeetups([meetup.group.name], TOKEN)
      .then((upcomingMeetups) => { expect(upcomingMeetups).to.eql([meetup]); })
      .then(done).catch(err => done(err));
  });

  it('returns multiple upcoming meetups', (done) => {
    const someMeetup = {
      group: { name: faker.hacker.noun() },
    };

    const anotherMeetup = {
      group: { name: faker.hacker.noun() },
    };

    api.upcomingMeetup
      .withArgs(someMeetup.group.name, TOKEN)
      .returns(Promise.resolve(someMeetup));

    api.upcomingMeetup
      .withArgs(anotherMeetup.group.name, TOKEN)
      .returns(Promise.resolve(anotherMeetup));

    renderer.render
      .withArgs(someMeetup)
      .returns(someMeetup);

    renderer.render
      .withArgs(anotherMeetup)
      .returns(anotherMeetup);

    const wantedMeetups = [someMeetup.group.name, anotherMeetup.group.name];

    getUpcomingMeetups(wantedMeetups, TOKEN)
      .then((upcomingMeetups) => {
        expect(upcomingMeetups).to.eql([someMeetup, anotherMeetup]);
      }).then(done).catch(err => done(err));
  });

  it('sorts upcoming meetups by time, returning the upcoming first', (done) => {
    const firstMeetup = {
      time: new Date('2017-06-02T06:00:00+10:00'),
      group: { name: faker.hacker.noun() },
    };

    const secondMeetup = {
      time: new Date('2017-06-02T06:30:00+10:00'),
      group: { name: faker.hacker.noun() },
    };

    const thirdMeetup = {
      time: new Date('2017-06-02T07:00:00+10:00'),
      group: { name: faker.hacker.noun() },
    };

    api.upcomingMeetup
      .withArgs(firstMeetup.group.name, TOKEN)
      .returns(Promise.resolve(firstMeetup));

    api.upcomingMeetup
      .withArgs(secondMeetup.group.name, TOKEN)
      .returns(Promise.resolve(secondMeetup));

    api.upcomingMeetup
      .withArgs(thirdMeetup.group.name, TOKEN)
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
      thirdMeetup.group.name,
      firstMeetup.group.name,
      secondMeetup.group.name,
    ];

    getUpcomingMeetups(unorderedMeetups, TOKEN)
      .then((upcomingMeetups) => {
        expect(upcomingMeetups).to.eql([firstMeetup, secondMeetup, thirdMeetup]);
      }).then(done).catch(err => done(err));
  });

  it('ignores malformed meetups from API', (done) => {
    const meetup = {
      group: { name: faker.hacker.noun() },
    };

    const malformedMeetup = undefined;

    api.upcomingMeetup
      .withArgs(meetup.group.name, TOKEN)
      .returns(Promise.resolve(meetup));

    api.upcomingMeetup
      .withArgs(undefined, TOKEN)
      .returns(Promise.resolve(malformedMeetup));

    renderer.render
      .withArgs(meetup)
      .returns(meetup);

    getUpcomingMeetups([meetup.group.name, undefined], TOKEN)
      .then((upcomingMeetups) => { expect(upcomingMeetups).to.eql([meetup]); })
      .then(done).catch(err => done(err));
  });
});
