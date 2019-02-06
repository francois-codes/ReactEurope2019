package com.multipackagereactnative.ReactNative.Repositories

import android.os.Bundle
import android.support.v4.app.Fragment
import com.multipackagereactnative.ReactNative.ReactNativeFragment

class ReactNativeFragmentRepository(val moduleName: String, val props: Bundle) : FragmentRepository {
    override fun getFragment(): Fragment {
        val frag = ReactNativeFragment()
        frag.arguments = Bundle().apply {
            putString("REACT_MODULE_NAME", moduleName)
            putBundle("REACT_PROPS", props)
        }
        return frag
    }
}