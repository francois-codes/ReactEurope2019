# Multi Package React Native app

This is a draft proposal for ReactConf, illustrating the tooling & workflow for having a native app using several independant react-native packages bundled together in the same app.

## About this Repo

At [Applicaster](https://applicaster.com) we are building a platform which enables easy release & management of native mobile apps on iOS and Android, as well as a few TV platforms. As such, React-Native revealed itself as a very interesting option, especially with the promise of write once, run everywhere.

Our apps are typically based on three things :

- a layout configured in our Zapp CMS. This provides the main UI configuration for the app : screens, navigations, content for each component in each screen...
- a SDK which leverages the layout configuration to create an app for a given platform
- a series of plugins - some of them built in-house, others built by external developers - to provide the app with more features, or replace some built-in features of the SDK.

We started using React-Native two years ago, mainly for creating plugins providing full screen experiences : a program guide page, a social feed, a live screen with an inline video player and a channel switcher...
So not only we had to integrate React-Native in a _brown field_ context since we already had native apps that we wanted to build upon, but we also had to design a stable and scalable infrascture for mounting arbitrary react-native bundles as separated plugins.

We started out by publishing to a server individual React-Native bundles for each plugin, and then downloading & mounting those bundles individually.
Several issues arose from this :

- Each bundle included the react-native js library code. Even a simple hello world react-native app will weight at least 1MB
- It required to force a version of react-native at the SDK level to ensuire the native side & js code where all running on the same React-Native version. Updating was a problem as it would require all plugins to be updated
- Versioning of the react native bundles needed to be handled separately.

We then figured we could counter all these issues by refering to React-Native plugins as plain npm packages, and add tooling to automatically wrap, bundle and expose those individual React-Native packages to the native side. This is the mechanism that this repo illustrates, and which we would like to talk about at ReactConf. It can be valuable in any _brown field_ React Native integration, as it would allow to separately work on all the React Native parts independently, yet still provide a reliable, simple and effective tooling to mount arbitrary React-Native views anywhere in the app.

## Set up

### requirements

- ruby 2.4.4
- cocopaods
- node 8.12
- yarn >= 1.6.0
- Xcode 10

the android project is not set up currently

### Set up

1. clone this repo
2. run `yarn` to install dependencies
3. run `yarn pod:update` to install pods

### How to run the app

On iOS, simply run `yarn ios` to run on the simulator.
On Android, you need to do the following :

- run `yarn start` to start the RN packager
- run `adb reverse TCP:8081 TCP:8081` to proxy the RN packager port to the emulator or device
- open android studio and start the app on the emulator / device.

### How does it work

At the root of the workspace, you have a file called `reactModules.json`. In this file, simply list the names of the npm packages and the versions you want to use. Currently it shows only packages inside the workspace, but it will also work with react native components defined outside of this repo. The only requirement is that the package uses a default export and not a named export.

Once you've added the react bundles you want to use, simply run `yarn aggregate:bundles`.
This script will make sure all the packages defined in `reactModules.json` are installed, and generate an index.js file which imports & registers all these modules. For each module with a standard `npm-package-name`, it will generate a moduleName like `NpmPackageName`. You can override this automatically assigned package name by providing a specific `moduleName` property in `reactModules.json`

run `yarn start` to start the React Native packager.

if you want to build the bundle for iOS or android, you can use the build commands `yarn build:ios` or `yarn build:android`

#### iOS

Now open the ios project in `ios/MultiPackageReactNative.xcworkspace`. There, you can add controllers and whatever you want in the storyboard. If you want to place a view with a specific RN component, simply add the following in your controller :

```swift

import UIKit

class MyViewController: UIViewController {
  override func viewDidLoad() {
    super.viewDidLoad()
    mountReactView()
  }
}

extension MyViewController {

  private let moduleName = "NpmPackageName"
  private let initialReactProps = [
    "foo": "bar"
  ]

  func mountReactView() {
    let reactLauncher = ReactNativeLauncher(moduleName: moduleName, initialProperties: initialReactProps)
    reactLauncher.mountReactApp(self.view) // or any parent view you want to use
  }
}

```

There is a bit of boilerplate code :

- The `ReactNativeBridge` and `ReactNativeLauncher` classes in the iOS project
- The statement in `AppDelegate.swift` to pass `launchOptions` to the react bridge
- the `react-bundle-aggregator` script

In time, we can work to make these part of open source libraries so this can be used easily and seamlessly used in any react-native project

that's it !

enjoy :)

#### Android

on android, before running `yarn start` to start the react native packager, you need to make sure you proxy the TCP port to the emulator or device with adb
`adb reverse TCP:8081 TCP:8081`

Android's implementation is inspired from [Airbnb's Native Navigation](https://github.com/airbnb/native-navigation).
It is not maintained anymore, but it's a very nice starting point for what we want to do. Have a look [here](https://www.youtube.com/watch?v=tWitQoPgs8w) for an explanatory video of what they did

The basic idea is to rely on an activity which extends the `ReactAwareActivity`, and contains a FrameLayout with a given `container` id. In this container, we can use the `ReactNativePresenter` class to present a React Native fragment

```java

public class MainActivity extends ReactAwareActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    setContentView(R.layout.activity_main);
    FrameLayout container = findViewById(R.id.container);

    ReactNativePresenter reactNativePresenter = new ReactNativePresenter(this, container);
    reactNativePresenter.presentScreen(reactModuleName(), reactProps());
  }

  private String reactModuleName() {
    return "GreenApp"; // this must match what is declare on the js side in AppRegistry.registerComponent call
  }

  private Bundle reactProps() {
    Bundle bundle = new Bundle();
    bundle.putString("foo", "bar");
    return bundle;
  }
}

```
