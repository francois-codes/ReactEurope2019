//
//  ReactNativeLauncher.swift
//  MultiPackageReactNative
//
//  Created by François Roland on 08/01/2019.
//  Copyright © 2019 François Roland. All rights reserved.
//

import UIKit
import React

/// ReactNativeLauncher class - creates a RCTRootView and attaches it to any parent
class ReactNativeLauncher {
    
    var moduleName: String
    var initialProperties: [AnyHashable: Any]?
    
    /// Creates a launcher for the specified module name and initial props
    init(moduleName: String, initialProperties: [AnyHashable: Any]?) {
        self.moduleName = moduleName
        self.initialProperties = initialProperties
    }
    
    /// Mounts the app by appending it to the provided parent view
    func mountReactApp(parentView: UIView) {
        
        guard let reactRootView = RCTRootView(
            bridge: ReactBridge.sharedInstance.reactBridge,
            moduleName: moduleName,
            initialProperties: initialProperties ?? [:]
            ) else {
                print("react root view is nil")
                return
        }
        
        reactRootView.backgroundColor = UIColor.clear
        reactRootView.reactSetFrame(parentView.frame)
        parentView.addSubview(reactRootView)
    }
}
