//
//  ReactBridge.swift
//  MultiPackageReactNative
//
//  Created by François Roland on 08/01/2019.
//  Copyright © 2019 François Roland. All rights reserved.
//

import Foundation
import React

/// This is the react native bridge. We're using a singleton to make sure the bridge is reused across React native instances

class ReactBridge: NSObject {
    
    static let sharedInstance = ReactBridge()
    
    private let jsBundleUrl = RCTBundleURLProvider.sharedSettings()?.jsBundleURL(forBundleRoot: "index", fallbackResource: nil)
    private let jsBundleFile = Bundle.main.url(forResource: "main", withExtension: "jsBundle")
    
    /// The logic here can be tweaked at will to use different logic
    /// for figuring out wether we should use the react packager (dev)
    /// or the bundled react
    private var shouldUseReactServer: Bool {
        #if DEBUG
        return true
        #else
        return false
        #endif
    }
    
    /// these are passed from the AppDelegate
    var launchOptions: [AnyHashable: Any] {
        get {
            return _launchOptions ?? [:]
        }
        
        set {
            _launchOptions = newValue
        }
    }
    
    private var _launchOptions: [AnyHashable: Any]?
    
    /// this is the bridge - the lazy instantiation makes sure that it's only 
    /// created once
    lazy var reactBridge: RCTBridge = RCTBridge(
        delegate: self as RCTBridgeDelegate,
        launchOptions: launchOptions
    )
}

/// RCTBridgeDelegate protocol extension
extension ReactBridge: RCTBridgeDelegate {

    public func sourceURL(for bridge: RCTBridge!) -> URL! {
        guard shouldUseReactServer, let bundleUrl = jsBundleUrl else {
            if let bundleFile = jsBundleFile {
                return bundleFile
            }
            return nil
        }
        
        return bundleUrl
    }
}
