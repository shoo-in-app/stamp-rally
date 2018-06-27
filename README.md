# Shoo-in

A React Native app used to collect digital stamps in a stamp rally.

**This was created during our time as students at Code Chrysalis.**

## How it works

A user can use this app to take part in stamp rallies. Their progress is stored on a CRUD server separate from this app. Creating new rallies is also done using that server. You can find the repository for the server at [/flower](https://github.com/cc4-butterfly/flower).

## Getting started

First, fork and clone this repository, and download the dependencies:

```sh
git clone https://github.com/[username]/stamp-rally.git
cd stamp-rally
yarn
```

You will need Expo to build this app.

### Expo

[Expo](https://expo.io/) is an SDK which extends the functionality of [React Native](https://facebook.github.io/react-native/). It is also used to build native binaries and handle assets. Development with Expo requires both a local development tool and a mobile client to open the app.

Expo requires [Node.js](https://nodejs.org/en/) to be installed in order to build apps.

#### Expo Development Environment (XDE)

Make sure both the command-line tools and the [XDE](https://xde-updates.exponentjs.com/download/) are installed.

#### Mobile Client: Expo for iOS and Android

Expo Client allows you to view your projects while you are developing them. When you serve your project from XDE, it generates a dev URL that you can open in Expo Client to preview the app. It is available for [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) and [iOS](https://itunes.com/apps/exponent).

To be able to run the app locally, simulators are required. For iOS, [Xcode](https://developer.apple.com/xcode/) will need to be installed (macOS only). For Android, we recommend the use of [Genymotion](https://www.genymotion.com/).

## Starting the app

Once Expo is installed, the app can be started opening the cloned directory in Expo XDE. Expo XDE will build and serve the app. Click on the 'Device' button to open the app in a local simulator, or 'Share' to open the app on a real device.

## Contributing

Please feel free to contribute to this app. Make a pull request!

## Authors

- **Alexander Ogilvie** - _Mobile Development_ - [a-ogilvie](https://github.com/a-ogilvie)
- **Takahiro Morita** - _Web Development_ - [morita657](https://github.com/morita657)
- **Yusuke Hayashi** - _Server Development_ - [yhay81](https://github.com/yhay81)

## Acknowledgements

- Inspired by [Yan Fan](https://github.com/yanarchy) and Kani Munidasa
- Mentored by [Felix Kirmse](https://github.com/FelixKirmse) and [Dylan Tran](https://github.com/controtie)
