<template>
    <div id="app">
        <div id="kmap"></div>
        <div id="over_the_map">
            <menu_button></menu_button>
            <searchbox></searchbox>
            <categorybox></categorybox>
        </div>

        <div id="ad" v-show="this.$store.state.changedImage"
             :class="{'animated tada': this.$store.state.animated}"
             @animationend="animationEnded">

            <a href="#">
                <img :src="this.$store.state.adImage" style="width:100%; height:100%; border-radius: 20px;">
            </a>
        </div>
        <transition name="myanim_hoho" enter-active-class="animated zoomIn " leave-active-class="animated fadeOut">
            <div class="tweet_hot" v-show="this.$store.state.clickedSearch">
                <a class="tweet" href="#"><h2>{{this.$store.state.tweet_search}} 인기 트윗 1</h2></a>
                <a class="tweet" style="left:250px;" href="#"><h2>{{this.$store.state.tweet_search}} 인기 트윗 2</h2></a>
                <a class="tweet" style="left:500px;" href="#"><h2>{{this.$store.state.tweet_search}} 인기 트윗 3</h2></a>
            </div>

        </transition>
    </div>
</template>

<script>

    //components
    import menu_button from './components/menu_button.vue'
    import searchbox from "./components/searchbox";
    import categorybox from "@/components/categorybox";

    export default {
        mounted() {
            var container = document.getElementById('kmap');
            var mapOptions = {
                center: new kakao.maps.LatLng(33.450701, 126.570667),
                level: 4//지도의 레벨(확대, 축소 정도)
            };
            var kmap = new kakao.maps.Map(container, mapOptions);
            var kmap_search = new kakao.maps.services.Places();
            var infowindow = new kakao.maps.InfoWindow({zIndex: 1000});
            this.$store.state.kmap = kmap;
            this.$store.state.infoWindow = new kakao.maps.InfoWindow({zIndex: 1000});
        },
        methods:{
            onAfterAdChange(){
                this.$store.state.changedImage=false;
            },
            animationEnded () {
                this.$store.state.animated = false;
            }
        },
        components: {
            categorybox,
            menu_button,
            searchbox
        }
    }
</script>

<style>
    @import "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css";

    .info {
        position: relative;
        top: 5px;
        left: 5px;
        border-radius: 6px;
        border: 1px solid #ccc;
        border-bottom: 2px solid #ddd;
        font-size: 12px;
        padding: 5px;
        background: #fff;
        list-style: none;
        margin: 0;
    }

    .info:nth-of-type(n) {
        border: 0;
        box-shadow: 0px 1px 2px #888;
    }

    .info .label {
        display: inline-block;
        width: 50px;
    }

    .number {
        font-weight: bold;
        color: #00a0e9;
    }

    #ad {
        background: #fff;
        position: fixed;
        right: 100px;
        top: 700px;
        z-index: 2000;
        width: 200px;
        height: 200px;
        border-radius: 20px;
        animation-duration: 1s;
    }

    .tweet_hot {
        position: fixed;
        left: 80px;
        bottom: 40px;
        z-index: 1;
        animation-duration: 0.5s;
    }

    .tweet {
        background: #fff;
        position: absolute;
        left: 0px;
        bottom: 0px;
        z-index: 1;
        width: 200px;
        height: 200px;
        border-radius: 20px;
        animation-duration: 1s;

    }

    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
    }

    #app {
        width: 100%;
        height: 100%;
    }

    #kmap {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 0;
    }

    #over_the_map {
        z-index: 100;
    }

</style>


<!--
<div id="menu">
            <router-link to="/menu_button">menu1</router-link>
            <router-link to="/searchbox">menu2 </router-link></div>
        <router-view/>
        -->
