<template>
    <div id="menu_button">

        <router-link to="/menu_contents">
            <el-button @click="onClickMenuButton" type="primary" icon="el-icon-s-unfold">동네플러스</el-button>
        </router-link>

        <transition name="router-anim" enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutLeft">
            <router-view/>
        </transition>

        <transition name="dot" leave-active-class="animated zoomOut" v-on:after-enter="afterEnter">
            <div class="dot" v-if="this.clicked" :style="{ left:  this.clientX + 'px', top:this.clientY+'px'}"></div>
        </transition>
    </div>

</template>

<script>

    export default {
        name: "menu_button",
        data() {
            return {
                msg: "hello,world!",
                clicked: false,
                clientX: 0,
                clientY: 0
            }
        },
        methods: {
            onClickMenuButton(event) {
                this.clicked = true;
                this.clientX = event.clientX - 13;
                this.clientY = event.clientY - 13;

            },
            afterEnter() {
                this.clicked = false;
            }


        }
    }
</script>

<style scoped>
    @import "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css";

    #menu_button {
        position: absolute;
        left: 12px;
        top: 10px;
        overflow: hidden;
    }

    .zoomOut {
        animation-duration: 0.3s;
    }

    .fadeInLeft {
        animation-duration: 0.3s;
    }

    .fadeOutLeft {
        animation-duration: 0.3s;
    }

    .dot {
        position: fixed;
        height: 26px;
        width: 26px;
        background-color: rgba(0, 0, 0, 0.25);
        border-radius: 50%;
        display: inline-block;
        z-index: 100;
    }

</style>