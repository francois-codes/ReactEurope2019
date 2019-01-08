# Multi Package React Native app

This is a draft proposal for ReactConf, illustrating the tooling & workflow for having a native app using several independant react-native packages bundled together in the same app

## requirements

- ruby 2.4.4
- cocopaods
- node 8.12
- yarn >= 1.6.0
- Xcode 10

the android project is not set up currently

## Set up

1. clone this repo
2. run `yarn` to install dependencies
3. run `yarn pod:update` to install pods
4. run `yarn ios` to run on the simulator

## How does it work

At the root of the workspace, you have a file called `reactModules.json`. In this file, simply list the name of the npm packages and the versions you want to use. Currently it shows only packages inside the workspace, but it will also work with react native components defined outside of this repo. The only requirement is that the package uses a default export and not a named export

Once you've added the react bundles you want to use, simply run `yarn aggregate:bundles`.
This script will make sure all the packages defined in `reactModules.json` are installed, and generate an index.js file which imports & registers all these modules. For each module with a standard `npm-package-name`, it will generate a moduleName like `NpmPackageName`

Now open the ios project in `ios/MultiPackageReactNative.xcworkspace`. There, you can add controllers and whatever you want in the storyboard. If you want to place a view with a specific RN component, simply add the following in your controller :

```swift

func mountReactView() {
  let reactLauncher = ReactNativeLauncher(moduleName: "NpmPackageName", initialProperties: ["foo": "bar"])
  reactLauncher.mountReactApp(self.view) // or any parent view you want to use
}

```

that's it !

enjoy :)
