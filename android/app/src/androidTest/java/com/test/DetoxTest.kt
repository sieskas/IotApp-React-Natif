package com.test

import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import androidx.test.rule.ActivityTestRule
import com.wix.detox.Detox
import com.wix.detox.config.DetoxConfig
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
@LargeTest
class DetoxTest {
    @get:Rule
    val mActivityRule = ActivityTestRule(MainActivity::class.java, false, false)

    @Test
    fun runDetoxTests() {
        val detoxConfig = DetoxConfig()
        // Increase timeouts for more stability
        detoxConfig.idlePolicyConfig.masterTimeoutSec = 120
        detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 90
        detoxConfig.rnContextLoadTimeoutSec = 240

        Detox.runTests(mActivityRule, detoxConfig)
    }
}
