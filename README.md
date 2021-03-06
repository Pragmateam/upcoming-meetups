# upcoming-meetups

<p align="center">
  <img src="https://img.shields.io/travis/Pragmateam/upcoming-meetups.svg" alt="travis">
  <img src="https://img.shields.io/github/license/Pragmateam/upcoming-meetups.svg" alt="license">
  <img src="https://img.shields.io/codeclimate/github/Pragmateam/upcoming-meetups.svg" alt="codeclimate score">
</p>

Get posted about upcoming meetups from meetup.com

### Setup

To ensure you're using the correct node.js version, run this command first:

```
$ nvm use $(cat .nvmrc)
```

Then you can install the dependencies.

```
$ make install
```

### Testing

```
$ make test
```

### Running locally

Export all environment variables as follows:

```
# meetup.com API
export MEETUP_API_KEY='<VALUE>'

$ make run meetupName=software-craftsmanship-sydney,sydney-node-ninjas,React-Sydney
```

### Deploy to AWS Lambda + API Gateway:

```
# setup to deploy with claudia.js
export AWS_REGION='<VALUE>'
export FUNCTION_NAME='<VALUE>'
export CLAUDIA_LAMBDA_ROLE='<VALUE>'
export CLAUDIA_LAMBDA_NAME='<VALUE>'
export CLAUDIA_API_ID='<VALUE>'

$ make deploy
```

### Contributing

There are many ways to contribute, such as fixing opened issues, creating them
or suggesting new ideas.
Either way will be very appreciated.

### License

Pragmateam/upcoming-meetups is released under the [MIT License](http://www.opensource.org/licenses/MIT).
