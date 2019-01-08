//
//  RedAppViewController.swift
//  MultiPackageReactNative
//
//  Created by François Roland on 08/01/2019.
//  Copyright © 2019 François Roland. All rights reserved.
//

import UIKit

class RedAppViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let reactLauncher = ReactNativeLauncher(
            moduleName: "RedApp",
            initialProperties: initialProps
        )
        
        reactLauncher.mountReactApp(parentView: self.view)
    }
    
    let initialProps = [
        "someProp": "someVal"
    ];
}
