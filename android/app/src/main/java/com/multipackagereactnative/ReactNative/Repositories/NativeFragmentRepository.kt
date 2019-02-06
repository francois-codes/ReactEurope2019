package com.multipackagereactnative.ReactNative.Repositories

import android.os.Bundle
import android.support.v4.app.Fragment
import com.multipackagereactnative.BlankFragment

class NativeFragmentRepository(val message: String, val props: Bundle) : FragmentRepository {
    override fun getFragment(): Fragment {
        val fragment = BlankFragment()
        val args = Bundle()
        args.putString("MESSAGE", message)
        fragment.setArguments(args)
        return fragment
    }
}