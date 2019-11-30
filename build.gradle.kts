plugins {
    base
    kotlin("jvm") version "1.3.61"
}

allprojects {
    group = "yotufer"

    version = "1.0"

    repositories {
        jcenter()
    }

    apply(plugin = "kotlin")

    kotlin.sourceSets {
        getByName("main").kotlin.srcDir("src")
        getByName("main").resources.srcDir("resources")
        getByName("test").kotlin.srcDir("test")
        getByName("test").resources.srcDir("test/resources")
    }
}

dependencies {
    subprojects.forEach {
        archives(it)
    }
}