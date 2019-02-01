package com.multipackagereactnative.ReactNative.Utils;

import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;

import java.util.Stack;

public class BackStack {
    private final Stack<Fragment> fragments = new Stack<>();
    private final String tag;

    BackStack(String tag) {
        this.tag = tag;
    }

    public String getTag() {
        return tag;
    }

    @Nullable
    public Fragment peekFragment() {
        return fragments.isEmpty()
                ? null
                : fragments.peek();
    }

    void pushFragment(Fragment fragment) {
        fragments.push(fragment);
    }

    Fragment popFragment() {
        if (fragments.isEmpty()) {
            throw new IllegalStateException("cannot pop empty stack");
        }
        return fragments.remove(fragments.size() - 1);
    }

    public int getSize() {
        return fragments.size();
    }

    @Override
    public String toString() {
        return "BackStack{" + ", tag='" + tag +
                ", size=" + fragments.size() +
                '}';
    }
}
