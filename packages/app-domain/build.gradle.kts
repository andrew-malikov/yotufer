plugins {
    kotlin("jvm")
}

dependencies {
    compile(kotlin("stdlib"))

    compile(project(":packages:youtube-api"))
}
