//
//  GreenAppViewController.swift
//  MultiPackageReactNative
//
//  Created by François Roland on 08/01/2019.
//  Copyright © 2019 François Roland. All rights reserved.
//

import UIKit

class GreenAppViewController: UIViewController {
    @IBOutlet weak var reactContainerView: UIView!

    override func viewDidLoad() {
        super.viewDidLoad()
        let reactLauncher = ReactNativeLauncher(
            moduleName: "GreenApp",
            initialProperties: initialProps
        )
        
        reactLauncher.mountReactApp(parentView: reactContainerView)
    }
    
    let initialProps = [
        "foo": "bar"
    ]
}
