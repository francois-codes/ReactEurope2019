package com.multipackagereactnative.ReactNative.Utils;

import android.os.Bundle;

public class BundleBuilder extends ExtendableBundleBuilder<BundleBuilder> {

    public BundleBuilder() {}

    public BundleBuilder(Bundle bundle) {
        putAll(bundle);
    }

}
