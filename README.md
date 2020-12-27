# Traceroute Map

Simple application to show trace result to destination host on the world map.

> This application created for fun and not indented to be a network tool or something like that.

<img src="screenshot0.png" alt="Preview" />

# Requirements

Application depends on external network tools. For Linux and Mac OS `traceroute` util and for Windows `tracert`. Ensure you have it.

# Installing

Go to [releases](https://github.com/Hokid/traceroute-map/releases) page and download application or installer for your OS. To run application on MacOS read [this](#running-not-verifed-app-on-macos).

# Running not verified app on MacOS

This application created for fun and not verified. If you try to open you will see warning like "TracerouteMap cannot be opened because the developer cannot be verified" in this case just click Cancel and go to System Preferences -> Security & Privacy. There you should see message like "TracerouteMap was blocked from use because it is not from an identified developer" and Open Anyway button. Click that button and in warring window click Open.

# Development

Used tools in development:

 - [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
 - [electron-builder](https://github.com/electron-userland/electron-builder)
 - [electron](https://github.com/electron)
 - [react](https://github.com/facebook/react)
 - [nodejs-traceroute](https://github.com/zulhilmizainuddin/nodejs-traceroute)
 - [Leaflet](https://github.com/Leaflet/Leaflet)
 - [react-leaflet](https://github.com/PaulLeCam/react-leaflet)
 - ...and many other

Theme inspired by [yaru](https://github.com/ubuntu/yaru).

To run locally clone the repo and install dependencies

```bash
$ yarn install
```

Then run

```bash
$ yarn start
```

Or make build for your OS

```bash
$ yarn package
```

For more information about commands read the [docs](https://github.com/electron-react-boilerplate/electron-react-boilerplate).
