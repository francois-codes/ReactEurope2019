//
//  ModalViewController.swift
//  MultiPackageReactNative
//
//  Created by François Roland on 08/01/2019.
//  Copyright © 2019 François Roland. All rights reserved.
//

import UIKit

class ModalViewController: UIViewController {
    
    @IBOutlet weak var reactContainerView: UIView!
    @IBAction func dismissModal(_ sender: Any) {
        self.dismiss(animated: true, completion: nil)
    }
    
    override func viewDidLoad() {
        let reactLauncher = ReactNativeLauncher(moduleName: "ModalApp", initialProperties: nil)
        reactLauncher.mountReactApp(parentView: reactContainerView)
    }
}
