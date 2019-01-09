# Multi Package React Native app

This is a draft proposal for ReactConf, illustrating the tooling & workflow for having a native app using several independant react-native packages bundled together in the same app.

## About this Repo

// coming soon

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
4. run `yarn ios` to run on the simulator

### How does it work

At the root of the workspace, you have a file called `reactModules.json`. In this file, simply list the names of the npm packages and the versions you want to use. Currently it shows only packages inside the workspace, but it will also work with react native components defined outside of this repo. The only requirement is that the package uses a default export and not a named export.

Once you've added the react bundles you want to use, simply run `yarn aggregate:bundles`.
This script will make sure all the packages defined in `reactModules.json` are installed, and generate an index.js file which imports & registers all these modules. For each module with a standard `npm-package-name`, it will generate a moduleName like `NpmPackageName`

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
