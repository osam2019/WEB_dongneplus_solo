<template>
    <div id="menu_contents">
        <div id="header">
            <el-avatar id="userIcon"
                       src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            <p id="userName">안재형</p>
            <el-button id="back_button" icon="el-icon-back" circle @click="$router.go(-1)"></el-button>
        </div>
        <hr>

        <div id="contents">
            <el-button round id="notice" class="animated fadeInUp" @click="onClickNotice">
                <p>#공지사항</p>
            </el-button>
            <el-button round id="history" class="animated fadeInUp" @click="onClickHistory">
                <p>#검색기록</p>
            </el-button>
            <el-button round id="advertisement" class="animated fadeInUp" @click="onClickAdvertisement">
                <p>#광고등록</p>
            </el-button>
        </div>
        <hr>
        <div id="footer">

            <el-button round id="logout">
                <i class="el-icon-switch-button" style="float:left; font-size: 1.5em; position:relative; top:20px"></i>
                <p style="float:right; margin-left:10px">로그아웃</p>
            </el-button>
        </div>

        <!--
        <div v-if="clickedNotice">
        <menu_notice ></menu_notice>
        </div>-->

        <transition name="myanim3" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div id="menu_notice" v-show="clickedNotice">
                <el-table class="myTable"
                          :data="tableData"
                          max-height="550"
                          style="width: 100%">

                    <el-table-column
                            prop="author"
                            label="글쓴이"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="title"
                            label="제목"
                            width="380">
                    </el-table-column>
                    <el-table-column
                            prop="date"
                            label="날짜">
                    </el-table-column>
                </el-table>

            </div>
        </transition>


        <transition name="myanim4" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div id="menu_history_" v-show="clickedHistory">
                <el-table class="myTable"
                          :data="tableDataHistory"
                          max-height="550"
                          style="width: 100%">

                    <el-table-column
                            prop="date"
                            label="날짜"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="keyword"
                            label="검색어"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="place_name"
                            label="장소명"
                            width="280">
                    </el-table-column>
                    <el-table-column
                            prop="tag"
                            label="태그">
                    </el-table-column>
                </el-table>

            </div>

        </transition>


        <transition name="myanim5" enter-active-class="animated flipInX" leave-active-class="animated flipOutX">
            <div id="menu_advertisement_" v-show="clickedAdvertisement">
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="주소">
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                    <el-form-item label="장소명">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="전화번호">
                        <el-input v-model="form.tel"></el-input>
                    </el-form-item>
                    <el-form-item label="설명">
                        <el-input type="textarea" v-model="form.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="이미지 첨부">
                        <el-upload
                                action="#" :auto-upload="false"
                                list-type="picture-card"
                                :on-change="onSuccessUpload">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog>
                            <img width="100%" alt="">
                        </el-dialog>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" style=" width:100px" @click="onClickFormOk">등록</el-button>
                        <el-button style="width:100px" @click="onClickAdvertisement">취소</el-button>
                    </el-form-item>
                </el-form>

            </div>
        </transition>


    </div>
</template>

<script>
    import menu_notice from "@/components/menu_notice";

    export default {
        name: "menu_contents",
        data() {
            return {
                clickedNotice: false,
                clickedHistory: false,
                clickedAdvertisement: false,
                tableData: [
                    {
                        author: '관리자',
                        title: '안녕하세요!! 안내사항 첫 번째 입니다!',
                        date: '2019-10-21'
                    },
                    {
                        author: '관리자',
                        title: '안녕하세요!! 안내사항 두 번째 입니다!',
                        date: '2019-10-22'
                    }
                ],
                tableDataHistory: null,
                form: {
                    address: '',
                    name: '',
                    tel: '',
                    desc: '',
                    img:''
                },
                dialogImageUrl:null,
                adImage:'/1.png',
                imageCheck:false
            }
        },
        methods: {
            onClickNotice() {
                this.clickedNotice = !this.clickedNotice;
            },
            onClickHistory() {
                this.tableDataHistory = this.$store.state.search_history;
                this.clickedHistory = !this.clickedHistory;
            },
            onClickAdvertisement() {
                this.clickedAdvertisement = !this.clickedAdvertisement;

            },
            onSuccessUpload(file, fileList){
                this.form.img=file.url;

            },
            onClickFormOk(){
                this.$store.state.animated=true;
                this.$store.state.changedImage=true;
                this.$store.state.adImage=this.form.img;
                this.clickedAdvertisement = !this.clickedAdvertisement;

            }
        },
        components: {
            menu_notice
        }
    }
</script>

<style scoped>
    @import "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css";


    #menu_notice {
        background: #fff;
        position: fixed;
        left: 500px;
        top: 100px;
        z-index: 2000;
        width: 800px;
        height: 500px;
        border-radius: 20px;
        padding: 30px;
        animation-duration: 0.25s;

    }

    #menu_history_ {
        background: #fff;
        position: fixed;
        left: 500px;
        top: 100px;
        z-index: 2000;
        width: 800px;
        height: 500px;
        border-radius: 20px;
        padding: 30px;
        animation-duration: 0.25s;


    }

    #menu_advertisement_ {
        background: #fff;
        position: fixed;
        left: 500px;
        top: 100px;
        z-index: 2000;
        width: 800px;
        height: 500px;
        border-radius: 20px;
        padding: 30px;
        animation-duration: 0.5s;
    }

    #menu_contents {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 390px;
        height: 100vh;
        z-index: 1000;
        background: #fff;
        overflow: hidden;
        margin: 0px;
        padding: 0px;
    }

    #header {
        width: 100%;
        height: 100px;
        overflow: hidden;
    }

    #userIcon {
        float: left;
        margin: 10px;
        width: 80px;
        height: 80px;
    }

    #userName {
        float: left;
        font-size: 2em;
        margin-top: 28px;
        margin-left: 10px;

    }

    #back_button {
        float: right;
        border: 0px;
        font-size: 3em;
        margin-top: 16px;
        margin-right: 10px;
    }

    #contents {
        margin: 0px;
        margin-left: 25px;
        margin-right: 25px;
        padding: 10px;
        overflow: hidden;
        height: 70%;
        text-align: center;
    }

    #notice {
        width: 310px;
        font-size: 2em;
        margin-bottom: 40px;
        border: 0px;
        animation-delay: 0.1s;

    }

    #history {
        width: 310px;
        font-size: 2em;
        margin-bottom: 40px;
        border: 0px;
        animation-delay: 0.3s;
    }

    #advertisement {
        width: 310px;
        font-size: 2em;
        margin-bottom: 40px;
        border: 0px;
        animation-delay: 0.5s;
    }

    #footer {
        margin-left: 20px;
        position: absolute;
        bottom: 0px;
        text-align: center;
        width: 320px;
    }

    #logout {
        font-size: 2em;
        margin-left: 10px;
        margin-bottom: 20px;
        border: 0px;
        height: 100px
    }

    .fadeInUp {
        animation-duration: 0.5s;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }

</style>