package com.multipackagereactnative

import android.support.v4.app.FragmentManager
import android.support.v4.app.FragmentStatePagerAdapter
import com.multipackagereactnative.ReactNative.Repositories.FragmentRepository

class MainPageAdapter(fm: FragmentManager, val repositories:List<FragmentRepository>) : FragmentStatePagerAdapter(fm) {

    override fun getItem(position: Int) = this.repositories.get(position).getFragment()
    override fun getCount() = this.repositories.size

}