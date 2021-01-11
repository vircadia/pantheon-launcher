Vircadia Launcher (codename Pantheon) supports Vircadia on Windows 64-bit. Future support may be added for MacOS and Linux.

## Building Vircadia Launcher

### Dependencies

You will need Node.js, Vue CLI, and the Vue CLI Electron Builder plugin.

#### Step 1. Node.js

If you don’t have Node.js, download and install [the latest LTS](https://nodejs.org/en/). Vue CLI requires Node.js version 8.9 or above (8.11.0+ recommended).

#### Step 2. Vue CLI 

To install Vue CLI, use one of the following commands. You need administrator privileges to execute these unless npm was installed on your system through a Node.js version manager (e.g. n or nvm).

```
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```

After installation, you will have access to the Vue binary in your command line. You can verify that it is properly installed by simply typing `vue`, which should present you with a message listing all available commands.

You can check the version with this command:

```
vue --version
```

### Test, Run, and Build

Open a terminal in the source directory:

```
cd pantheon-launcher
```

#### On first setup

We need to get the modules and dependencies installed.

If you use Yarn:
```
yarn install
```
or if you use NPM:
```
npm install
```

#### To start a development server:

A development server allows you to test changes without having to recompile the application every time. It also enables development mode which activates the dev tools.

You will need to run any of these commands with administrative privileges.

If you use Yarn:
```
yarn electron:serve
```
or if you use NPM:
```
npm run electron:serve
```
#### To build the launcher:

With Yarn:
```
yarn electron:build
```
or with NPM:
```
npm run electron:build
```

Building the launcher will generate an installer executable and an unpacked folder that allows you to run the built launcher without running the setup. You can find the build artifacts in the **dist_electron** folder.

#### Update your build environment:

When new dependencies are added and required by the codebase, you will need to add them.

If you use Yarn:
```
yarn update
```
or if you use NPM:
```
npm update
```

#### Code Signing

The builder will automatically package and sign your application. You will however need to ensure you have the following environment variables set:

```
CSC_LINK=[The path to your .pfx file.]
CSC_KEY_PASSWORD=[The password for your .pfx file.]
```

#### Configuration

`vue.config.js`: To alter build, code signing, and other general properties.
* https://www.electron.build/
* https://cli.vuejs.org/config/#vue-config-js

`pantheon.config.js`: A new configuration file, more properties will be centralized and specified in this file as updates are pushed to the launcher.

`package.json`: Dependencies and version information can be adjusted here.
* https://docs.npmjs.com/cli/v6/configuring-npm/package-json

This project also uses the Vue CLI Plugin Electron Builder. Visit the [website](https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/guide.html) to learn more about how to customize it if necessary.