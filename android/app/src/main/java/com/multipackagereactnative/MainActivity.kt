package com.multipackagereactnative

import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.support.design.widget.BottomNavigationView
import android.support.v4.view.ViewPager
import android.support.v7.widget.Toolbar

import com.multipackagereactnative.ReactNative.ReactAwareActivity
import com.multipackagereactnative.ReactNative.ReactNativePresenter
import com.multipackagereactnative.ReactNative.Repositories.FragmentRepository
import com.multipackagereactnative.ReactNative.Repositories.NativeFragmentRepository
import com.multipackagereactnative.ReactNative.Repositories.ReactNativeFragmentRepository
import com.multipackagereactnative.ReactNative.Utils.BundleBuilder

import java.util.ArrayList

class MainActivity : ReactAwareActivity(), BlankFragment.OnFragmentInteractionListener {


    private val OVERLAY_PERMISSION_REQ_CODE = 1

    private val TAG = "MainActivity"

    private val GREEN_APP = "GreenApp"
    private val RED_APP = "RedApp"
    private val NATIVE_SCREEN = "Native Screen"

    private val viewpager: ViewPager by lazy { findViewById<ViewPager>(R.id.viewpager) }
    private val navigation: BottomNavigationView by lazy { findViewById<BottomNavigationView>(R.id.navigation) }
    private val toolbar: Toolbar  by lazy { findViewById<Toolbar>(R.id.toolbar) }

    private var adapter: MainPageAdapter? = null
    private val reactNativePresenter: ReactNativePresenter? = null


    private val mOnNavigationItemSelectedListener = BottomNavigationView.OnNavigationItemSelectedListener { item ->
        when (item.itemId) {
            R.id.navigation_home -> {
                viewpager.currentItem = 0
                supportActionBar?.title = GREEN_APP
                return@OnNavigationItemSelectedListener true
            }
            R.id.navigation_dashboard -> {
                viewpager.currentItem = 1
                supportActionBar?.title = RED_APP
                return@OnNavigationItemSelectedListener true
            }
            R.id.navigation_notifications -> {
                viewpager.currentItem = 3
                supportActionBar?.title = NATIVE_SCREEN
                return@OnNavigationItemSelectedListener true
            }
        }
        false
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        setSupportActionBar(toolbar)
        supportActionBar?.title = GREEN_APP

        initAdapter()
        viewpager.adapter = this.adapter
        viewpager.currentItem = 0
        viewpager.offscreenPageLimit = 5
        adapter?.notifyDataSetChanged()

        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener)
    }

    private fun initAdapter() {
        val repositories = ArrayList<FragmentRepository>()
        repositories.add(ReactNativeFragmentRepository(GREEN_APP, greenAppProps()))
        repositories.add(ReactNativeFragmentRepository(RED_APP, redAppProps()))
        repositories.add(NativeFragmentRepository("this is a native fragment with just a text view for now", Bundle()))
        this.adapter = MainPageAdapter(supportFragmentManager, repositories)
    }

    private fun redAppProps() = BundleBuilder().putString("foo", "bar").toBundle()

    private fun greenAppProps() = BundleBuilder().putInt("baz", 42).toBundle()

    override fun onFragmentInteraction(uri: Uri?) = Unit

}
