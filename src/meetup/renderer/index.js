class MeetupRenderer {
  static render(meetup) {
    const startTime = meetup.startTime.format('MMMM D, h:mm A');
    const endTime = meetup.endTime.format('h:mm A');

    const formattedTimeRange = `${startTime} to ${endTime}`;

    return `> *${meetup.groupName}* :: ${meetup.name} - ${formattedTimeRange} - ${meetup.url}`;
  }
}

module.exports = MeetupRenderer;
