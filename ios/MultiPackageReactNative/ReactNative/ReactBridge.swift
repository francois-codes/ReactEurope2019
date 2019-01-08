//
//  ReactBridge.swift
//  MultiPackageReactNative
//
//  Created by François Roland on 08/01/2019.
//  Copyright © 2019 François Roland. All rights reserved.
//

import Foundation
import React

class ReactBridge: NSObject {
    
    static let sharedInstance = ReactBridge()
    
    private let jsBundleUrl = RCTBundleURLProvider.sharedSettings()?.jsBundleURL(forBundleRoot: "index", fallbackResource: nil)
    private let jsBundleFile = Bundle.main.url(forResource: "main", withExtension: "jsBundle")
    
    private var shouldUseReactServer: Bool {
        #if DEBUG
        return true
        #else
        return false
        #endif
    }
    
    var launchOptions: [AnyHashable: Any] {
        get {
            return _launchOptions ?? [:]
        }
        
        set {
            _launchOptions = newValue
        }
    }
    
    private var _launchOptions: [AnyHashable: Any]?
    
    lazy var reactBridge: RCTBridge = RCTBridge(
        delegate: self as RCTBridgeDelegate,
        launchOptions: launchOptions
    )
    
}

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
