const expect = require('chai').expect;

const Meetup = require('../../src/meetup/model');

describe('meetup/model', () => {
  describe('#groupName', () => {
    it('returns group name', () => {
      const rawData = {
        group: {
          name: 'group name',
        },
      };

      const model = new Meetup(rawData);

      expect(model.groupName).to.eql('group name');
    });
  });

  describe('#name', () => {
    it('returns meetup name', () => {
      const rawData = {
        name: 'meetup name',
      };

      const model = new Meetup(rawData);

      expect(model.name).to.eql('meetup name');
    });
  });

  describe('#url', () => {
    it('returns meetup url', () => {
      const rawData = {
        link: 'https://meetup.com',
      };

      const model = new Meetup(rawData);

      expect(model.url).to.eql('https://meetup.com');
    });
  });

  describe('#startTime', () => {
    const FORMAT = 'MMM D, h:mm A';

    it('returns start time', () => {
      const rawData = {
        time: new Date('2017-05-04T18:00:00+10:00'),
      };

      const model = new Meetup(rawData);

      expect(model.startTime.format(FORMAT)).to.eql('May 4, 6:00 PM');
    });

    it('returns start time from a different timezone', () => {
      const rawData = {
        time: new Date('2017-05-04T18:00:00+10:00'),
        venue: {
          city: 'Tokyo',
          localized_country_name: 'Asia',
        },
      };

      const model = new Meetup(rawData);

      expect(model.startTime.format(FORMAT)).to.eql('May 4, 5:00 PM');
    });

    it('returns Australia/Sydney as default startTime when given city is unknown', () => {
      const rawData = {
        time: new Date('2017-05-04T18:00:00+10:00'),
        venue: {
          city: 'Unkown',
          localized_country_name: 'Asia',
        },
      };

      const model = new Meetup(rawData);

      expect(model.startTime.format(FORMAT)).to.eql('May 4, 6:00 PM');
    });

    it('returns Australia/Sydney as default startTime when given country is unknown', () => {
      const rawData = {
        time: new Date('2017-05-04T18:00:00+10:00'),
        venue: {
          city: 'Tokyo',
          localized_country_name: 'Unknown',
        },
      };

      const model = new Meetup(rawData);

      expect(model.startTime.format(FORMAT)).to.eql('May 4, 6:00 PM');
    });
  });

  describe('#endTime', () => {
    const FORMAT = 'MMM D, h:mm A';

    it('returns start time', () => {
      const rawData = {
        time: new Date('2017-05-04T18:00:00+10:00'),
        duration: 10800000,
      };

      const model = new Meetup(rawData);

      expect(model.endTime.format(FORMAT)).to.eql('May 4, 9:00 PM');
    });

    it('returns end time from a different timezone', () => {
      const rawData = {
        time: new Date('2017-05-04T18:00:00+10:00'),
        duration: 10800000,
        venue: {
          city: 'Tokyo',
          localized_country_name: 'Asia',
        },
      };

      const model = new Meetup(rawData);

      expect(model.endTime.format(FORMAT)).to.eql('May 4, 8:00 PM');
    });
  });
});
