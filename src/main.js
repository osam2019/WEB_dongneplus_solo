import Vue from 'vue'
import Vuex from "vuex"
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        list: [],
        markers: [],
        markersPos:[],
        infoWindow:null,
        categoryMarkers:[],
        categoryMarkerActiveName:null,
        categoryPos:[],
        drawings:[],
        search_history:[],
        adImage:'/1.png',
        tweet_search:null,
        clickedSearch:false,
        changedImage:false,
        animated:false
    },
    mutations: {
        addItem(state, item) {
            state.list.push(item);
        },
        deleteAll(state) {
            state.list.splice(0, state.list.length);
        },
        deleteMarkers(state) {
            for (var i = 0; i < state.markers.length; i++) {
                state.markers[i].setMap(null);
            }
            if(state.drawings.length>0)
                for (var i = 0; i < state.drawings.length; i++) {
                    state.drawings[i].setMap(null);
                }
            state.markers=[];
            state.markersPos=[];
            state.drawings=[];

        },
        deleteMarkersCategory(state) {
            for (var i = 0; i < state.categoryMarkers.length; i++) {
                state.categoryMarkers[i].setMap(null);
            }
            if(state.drawings.length>0)
                for (var i = 0; i < state.drawings.length; i++) {
                    state.drawings[i].setMap(null);
                }

            state.categoryMarkers=[];
            state.categoryMarkersPos=[];
            state.categoryMarkerActiveName=null;
            state.drawings=[];
        },
        deleteDrawings(state){
            if(state.drawings.length>0)
                for (var i = 0; i < state.drawings.length; i++) {
                    state.drawings[i].setMap(null);
                }
            state.drawings=[];
        },
        deleteSearchHistory(state){
            if(state.search_history.length>0){
                for (var i = 0; i < state.search_history.length; i++) {
                    state.search_history[i].setMap(null);
                }
            }
            state.search_history=[];
        }

    },
    actions: {
        addItem({commit, state}, data) {
            commit("addItem", data);
        },
        deleteAll({commit, state}) {
            commit("deleteAll");
        },
        deleteMarkers({commit, state}) {
            commit("deleteMarkers");
        },

        deleteMarkersCategory({commit, state}) {
            commit("deleteMarkersCategory");
        },

        deleteDrawings({commit, state}) {
            commit("deleteDrawings");
        },
        deleteSearchHistory({commit, state}) {
            commit("deleteSearchHistory");
        }
    }
});


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
