<template>
    <div id="categorybox" >
        <el-row :gutter="12" style="margin-bottom: 10px;text-align:center ;" >

            <el-col :span="12" @click.native="onClick('FD6','맛집')" >
                <el-card shadow="hover" class="card" >
                    <img src="~@/assets/restraunt.png" style="width:30px; height:30px; float:left">
                    <el-button class="content" circle style="position: relative; top:-7px; float:left">맛집</el-button>
                </el-card>
            </el-col>
            <el-col :span="12" @click.native="onClick('AD5','숙박시설')">
                <el-card shadow="hover" class="card">

                    <img src="~@/assets/motel.png" style="width:30px; height:30px;">
                    <el-button class="content" circle style="position: relative; top:-7px;">숙박시설</el-button>
                </el-card>
            </el-col>


        </el-row>
        <el-row :gutter="12" style="margin-bottom: 10px">

            <el-col :span="12" @click.native="onClick('AT4','관광지')">
                <el-card shadow="hover" class="card">

                    <img src="~@/assets/travel.png" style="width:30px; height:30px; float:left">
                    <el-button class="content" circle style="position: relative; top:-7px;">관광지</el-button>
                </el-card>
            </el-col>
            <el-col :span="12"  @click.native="onClick('CS2','편의점')">
                <el-card shadow="hover" class="card">

                    <img src="~@/assets/market.png" style="width:30px; height:30px; float:left">
                    <el-button class="content" circle style="position: relative; top:-5px">편의점</el-button>
                </el-card>
            </el-col>


        </el-row>

        <el-row :gutter="12" style="margin-bottom: 10px">

            <el-col :span="12" @click.native="onClick('SW8','지하철역')">
                <el-card shadow="hover" class="card">

                    <img src="~@/assets/train.png" style="width:30px; height:30px; float:left">
                    <el-button class="content" circle style="position: relative; top:-7px;">지하철역</el-button>
                </el-card>
            </el-col>
            <el-col :span="12" @click.native="onClick('HP8','병원')">
                <el-card shadow="hover" class="card" style="overflow: hidden">

                    <img src="~@/assets/hospital.png" style="width:30px; height:30px; float:left">
                    <el-button class="content" circle style="position: relative; top:-7px; ">병원</el-button>
                </el-card>
            </el-col>


        </el-row>

    </div>
</template>

<script>
    export default {
        name: "categorybox",
        data(){
            return{
                showMarker:false,
                placeOverlay:null,
                code:null
            }
        },
        methods:{
            onClick(code,name){
                this.init();
                this.$store.state.categoryMarkerActiveName=name;
                console.log(this.$store.state.categoryMarkerActiveName);
                var that=this;
                this.code=code;
                if(this.placeOverlay==null)
                    this.placeOverlay = new kakao.maps.InfoWindow({zIndex: 1000});
                else if(this.placeOverlay!=null){
                    this.placeOverlay.close();
                }
                var ps = new kakao.maps.services.Places(this.$store.state.kmap);
                var markers=[];
                var arrPos=[];

                ps.categorySearch(code, function(data, status, pagination){
                    if (status === kakao.maps.services.Status.OK) {

                        for ( var i=0; i<data.length; i++ ) {
                            var pos={x:data[i].x, y:data[i].y};
                            arrPos.push(pos);
                            var marker = that.addMarker(new kakao.maps.LatLng(data[i].y,data[i].x),that);

                            (function(marker, place) {
                                kakao.maps.event.addListener(marker, 'click', function () {
                                    that.showMarker=!that.showMarker;

                                    if(that.showMarker){

                                        var content = '<div style="padding:5px;z-index:1000;">' + place.place_name + '</div>';

                                        that.placeOverlay.setContent(content);
                                        that.placeOverlay.open(that.$store.state.kmap, marker);
                                    }else{
                                        that.placeOverlay.close();
                                    }

                                });
                            })(marker, data[i]);

                            markers.push(marker);
                        }

                        that.$store.state.categoryMarkers=markers;
                        that.$store.state.categoryMarkersPos=arrPos;
                        console.log(arrPos);
                    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

                        alert('검색 결과가 존재하지 않습니다.');
                        return;

                    } else if (status === kakao.maps.services.Status.ERROR) {

                        alert('검색 결과 중 오류가 발생했습니다.');
                        return;

                    }
                }, {useMapBounds:true});
            },
            addMarker(position,that) {
                if(that.code=='FD6')
                    var imageSrc = '/restraunt.png';
                else if(that.code=='AT4')
                    var imageSrc = '/travel.png';
                else if(that.code=='CS2')
                    var imageSrc = '/market.png';
                else if(that.code=='SW8')
                    var imageSrc = '/train.png';
                else if(that.code=='HP8')
                    var imageSrc = '/hospital.png';
                else if(that.code=='AD5')
                    var imageSrc = '/motel.png';

                var imageSize = new kakao.maps.Size(36, 37),
                    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
                    marker = new kakao.maps.Marker({
                    position: position, // 마커의 위치
                    image: markerImage
                });

                marker.setMap(this.$store.state.kmap); // 지도 위에 마커를 표출합니다
                return marker;
            },
            init(){
                this.$store.dispatch("deleteMarkersCategory");
            }
        }
    }
</script>

<style scoped>
    #categorybox{
        z-index:1000;
        position: fixed;
        right:100px;
        top:100px;
        width:400px;
        height:270px;
        padding:20px;
        border-radius: 20px ;

        background:#fff;
    }

    .content{
        border:0px;

        font-size:1.5em;

    }
.card{
    height:80px;
}
</style>