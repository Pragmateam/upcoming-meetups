# upcoming-meetups

<p align="center">
  <img src="https://img.shields.io/travis/Pragmateam/upcoming-meetups.svg" alt="travis">
  <img src="https://img.shields.io/github/license/Pragmateam/upcoming-meetups.svg" alt="license">
  <img src="https://img.shields.io/codeclimate/github/Pragmateam/upcoming-meetups.svg" alt="codeclimate score">
</p>

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
# setup to deploy with claudia.js
export AWS_REGION='<VALUE>'
export FUNCTION_NAME='<VALUE>'
export CLAUDIA_LAMBDA_ROLE='<VALUE>'
export CLAUDIA_LAMBDA_NAME='<VALUE>'
export CLAUDIA_API_ID='<VALUE>'

# meetup.com API
export MEETUP_API_KEY='<VALUE>'
```

Running locally:

```
$ make run eventName=software-craftsmanship-sydney
```

Deploy to AWS Lambda + API Gateway:

```
$ make deploy
```

### Contributing

There are many ways to contribute, such as fixing opened issues, creating them
or suggesting new ideas.
Either way will be very appreciated.

### License

Pragmateam/upcoming-meetups is released under the [MIT License](http://www.opensource.org/licenses/MIT).
