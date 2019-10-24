<template>
    <div id="searchbox">
        <el-input placeholder="동네 이름을 검색해볼까요?" v-model="search_value"></el-input>
        <el-button class="search_button" v-on:click="onClick" icon="el-icon-search" circle></el-button>

        <div id="searchbox_list" v-show="clicked">

            <el-table
                    :data="tableData"
                    style="width: 100%"
                    max-height="550" @cell-click="onClilckCell">
                <el-table-column
                        prop="place_name"
                        label="장소명"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="address_name"
                        label="주소명"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="tel"
                        label="전화번호">
                </el-table-column>
            </el-table>
            <el-button id="back_button" v-show="clicked" icon="el-icon-back" circle @click="onClickBack"></el-button>
            <el-pagination id="page"
                           :page-size="1"
                           layout="prev, pager, next"
                           :total="page_number.last" @current-change="handle_current_change"
                           :current-page="page_number.current">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "searchbox",
        data() {
            return {
                search_value: '',
                clicked: false,
                tableData: [],
                page_number: {},
                drawingOverlay: new kakao.maps.CustomOverlay({
                    xAnchor: 0,
                    yAnchor: 0,
                    zIndex: 1000
                }),
                caclculatedDistance: false,
                clientX: 0,
                clientY: 0,
                totalDistance: 0,
                walk: 0,
                bycicleMin: 0
            }
        },
        methods: {
            handle_current_change(val) {
                this.page_number.gotoPage(val);
                var that = this;
                that.$store.dispatch("deleteMarkers");
                that.$store.state.infoWindow.close();

                let markers = [];

                let bounds = new kakao.maps.LatLngBounds();

                for (let i = 0; i < that.$store.state.list[0].length; i++) {
                    let placePosition = new kakao.maps.LatLng(that.$store.state.list[0][i].y, that.$store.state.list[0][i].x);
                    let marker = that.addMarker(placePosition, i);
                    markers.push(marker);  // 배열에 생성된 마커를 추가합니다
                    bounds.extend(placePosition);
                    that.$store.state.kmap.setBounds(bounds);
                }

                that.$store.state.markers = markers;

            },
            onClilckCell(row, column, cell, event) {
                var that = this;
                var drawingLine = new kakao.maps.Polyline({
                    strokeWeight: 3, // 선의 두께입니다
                    strokeColor: '#00a0e9', // 선의 색깔입니다
                    strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
                    strokeStyle: 'solid' // 선의 스타일입니다
                });
                that.$store.dispatch("deleteDrawings");

                // 주소-좌표 변환 객체를 생성합니다
                var geocoder = new kakao.maps.services.Geocoder();
                geocoder.addressSearch(row.address_name, function (result, status) {
                    // 정상적으로 검색이 완료됐으면
                    if (status === kakao.maps.services.Status.OK) {
                        // 이동할 위도 경도 위치를 생성합니다
                        var pos = new kakao.maps.LatLng(result[0].y, result[0].x);


                        // 지도 중심을 부드럽게 이동시킵니다
                        // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
                        that.$store.state.kmap.panTo(pos);

                        kakao.maps.event.trigger(row.marker, 'mouseover'); // 사용자 이벤트가 발생했습니다.
                        var linePath = [
                            new kakao.maps.LatLng(row.y, row.x),
                            new kakao.maps.LatLng(that.$store.state.categoryMarkersPos[0].y, that.$store.state.categoryMarkersPos[0].x)
                        ];
                        drawingLine.setPath(linePath);
                        var len = drawingLine.getLength();
                        var minLen = len;
                        var minLenIdx = 0;
                        for (let i = 1; i < that.$store.state.categoryMarkersPos.length; i++) {
                            var linePath = [
                                new kakao.maps.LatLng(row.y, row.x),
                                new kakao.maps.LatLng(that.$store.state.categoryMarkersPos[i].y, that.$store.state.categoryMarkersPos[i].x)
                            ];
                            drawingLine.setPath(linePath);
                            var len = drawingLine.getLength();
                            if (minLen > len) {
                                minLen = len;
                                minLenIdx = i;
                            }
                        }
                        linePath = [
                            new kakao.maps.LatLng(row.y, row.x),
                            new kakao.maps.LatLng(that.$store.state.categoryMarkersPos[minLenIdx].y, that.$store.state.categoryMarkersPos[minLenIdx].x)
                        ];
                        drawingLine.setPath(linePath);
                        drawingLine.setMap(that.$store.state.kmap);


                        var drawingCircle = new kakao.maps.Circle({
                            strokeWeight: 1, // 선의 두께입니다
                            strokeColor: '#00a0e9', // 선의 색깔입니다
                            strokeOpacity: 0.1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
                            strokeStyle: 'solid', // 선의 스타일입니다
                            fillColor: '#00a0e9', // 채우기 색깔입니다
                            fillOpacity: 0.2 // 채우기 불투명도입니다
                        });
                        that.$store.state.drawings.push(drawingCircle);
                        that.$store.state.drawings.push(drawingLine);

                        var circleOptions = {
                            center: new kakao.maps.LatLng(row.y, row.x),
                            radius: drawingLine.getLength(),
                        };

                        // 그려지고 있는 원의 옵션을 설정합니다
                        drawingCircle.setOptions(circleOptions);
                        drawingCircle.setMap(that.$store.state.kmap);

                        that.drawingOverlay.setPosition(new kakao.maps.LatLng(that.$store.state.categoryMarkersPos[minLenIdx].y, that.$store.state.categoryMarkersPos[minLenIdx].x));

                        // 반경 정보를 표시할 커스텀 오버레이의 표시할 내용을 설정합니다
                        that.drawingOverlay.setContent(that.getTimeHTML(Math.round(circleOptions.radius)));
                        // 그려지고 있는 원의 반경정보 커스텀 오버레이를 지도에 표시합니다
                        that.drawingOverlay.setMap(that.$store.state.kmap);


                        var currentDateWithFormat = new Date().toJSON().slice(0,10).replace(/-/g,'/');
                        console.log(currentDateWithFormat);
                        that.$store.state.search_history.push({date:currentDateWithFormat,
                        keyword:that.search_value,
                            place_name:row.place_name,
                            tag:that.$store.state.categoryMarkerActiveName
                        });
                        console.log(that.$store.state.search_history);
                    }
                });


            },
            addMarker(position, idx) {
                var imageSrc = 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
                    imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
                    imgOptions = {
                        spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
                        spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                        offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
                    },
                    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
                this.$store.commit("deleteMarkers");
                var marker = new kakao.maps.Marker({
                    position: position, // 마커의 위치
                    image: markerImage
                });
                this.$store.state.markers = marker;

                marker.setMap(this.$store.state.kmap); // 지도 위에 마커를 표출합니다


                return marker;
            },
            onClickBack() {
                this.clicked = false;
            },
            onClick() {
                var that = this;
                var value = that.search_value;

                var ps = new kakao.maps.services.Places();

                if(this.drawingOverlay!=null)
                    this.drawingOverlay.setMap(null);

                that.$store.state.clickedSearch=false;
                that.$store.state.infoWindow.close();
                searchPlaces();


                function searchPlaces() {

                    var keyword = value;

                    if (!keyword.replace(/^\s+|\s+$/g, '')) {
                        //alert('키워드를 입력해주세요!');
                        return false;
                    }


                    ps.keywordSearch(keyword, placesSearchCB);
                }


                function placesSearchCB(data, status, pagination) {
                    if (status === kakao.maps.services.Status.OK) {

                        that.$store.state.tweet_search=that.search_value;
                        that.$store.state.clickedSearch=true;
                        that.$store.dispatch("deleteAll");
                        that.$store.dispatch("deleteMarkers");
                        that.$store.dispatch("addItem", data);

                        let result = [];


                        let markers = [];
                        var markersPos = [];

                        let bounds = new kakao.maps.LatLngBounds();

                        for (let i = 0; i < that.$store.state.list[0].length; i++) {
                            var pos = {y: that.$store.state.list[0][i].y, x: that.$store.state.list[0][i].x};
                            markersPos.push(pos);
                            let placePosition = new kakao.maps.LatLng(that.$store.state.list[0][i].y, that.$store.state.list[0][i].x);
                            let marker = that.addMarker(placePosition, i);
                            markers.push(marker);  // 배열에 생성된 마커를 추가합니다
                            bounds.extend(placePosition);
                            that.$store.state.kmap.setBounds(bounds);
                            kakao.maps.event.addListener(marker, 'mouseover', function () {
                                var content = '<div style="padding:5px;z-index:1000;">' + that.$store.state.list[0][i].place_name + '</div>';

                                that.$store.state.infoWindow.setContent(content);
                                that.$store.state.infoWindow.open(that.$store.state.kmap, marker);
                            });
                            kakao.maps.event.addListener(marker, 'mouseout', function () {
                                that.$store.state.infoWindow.close();
                            });

                            result.push({
                                place_name: that.$store.state.list[0][i].place_name,
                                address_name: that.$store.state.list[0][i].address_name,
                                tel: that.$store.state.list[0][i].phone,
                                x: that.$store.state.list[0][i].x,
                                y: that.$store.state.list[0][i].y,
                                marker: marker
                            });
                        }
                        that.tableData = result;
                        that.page_number = pagination;


                        that.$store.state.markers = markers;
                        that.$store.state.markersPos = markersPos;

                        if (that.clicked == false) {

                            that.page_number.gotoPage(1);
                            that.clicked = true;
                        }


                    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

                        alert('검색 결과가 존재하지 않습니다.');
                        return;

                    } else if (status === kakao.maps.services.Status.ERROR) {

                        alert('검색 결과 중 오류가 발생했습니다.');
                        return;

                    }
                }
            },
            calcuateDistance(distance, that) {
                // 도보의 시속은 평균 4km/h 이고 도보의 분속은 67m/min입니다
                var walkTime = distance / 67 | 0;
                var walkHour = '', walkMin = '';

                // 계산한 도보 시간이 60분 보다 크면 시간으로 표시합니다
                if (walkTime > 60) {
                    walkHour = Math.floor(walkTime / 60);
                }
                walkMin = walkTime % 60;

                // 자전거의 평균 시속은 16km/h 이고 이것을 기준으로 자전거의 분속은 267m/min입니다
                var bycicleTime = distance / 227 | 0;
                var bycicleHour = '', bycicleMin = '';

                // 계산한 자전거 시간이 60분 보다 크면 시간으로 표출합니다
                if (bycicleTime > 60) {
                    bycicleHour = Math.floor(bycicleTime / 60);
                }
                bycicleMin = bycicleTime % 60;

                that.totalDistance = distance;
                that.walk = walkHour + walkMin;
                that.bycicleMin = bycicleHour + bycicleMin;
                that.caclculatedDistance = true;
            },
            getTimeHTML(distance) {

                // 도보의 시속은 평균 4km/h 이고 도보의 분속은 67m/min입니다
                var walkkTime = distance / 67 | 0;
                var walkHour = '', walkMin = '';

                // 계산한 도보 시간이 60분 보다 크면 시간으로 표시합니다
                if (walkkTime > 60) {
                    walkHour = '<span class="number">' + Math.floor(walkkTime / 60) + '</span>시간 '
                }
                walkMin = '<span class="number">' + walkkTime % 60 + '</span>분'

                // 자전거의 평균 시속은 16km/h 이고 이것을 기준으로 자전거의 분속은 267m/min입니다
                var bycicleTime = distance / 227 | 0;
                var bycicleHour = '', bycicleMin = '';

                // 계산한 자전거 시간이 60분 보다 크면 시간으로 표출합니다
                if (bycicleTime > 60) {
                    bycicleHour = '<span class="number">' + Math.floor(bycicleTime / 60) + '</span>시간 '
                }
                bycicleMin = '<span class="number">' + bycicleTime % 60 + '</span>분'

                // 거리와 도보 시간, 자전거 시간을 가지고 HTML Content를 만들어 리턴합니다
                var content = '<ul class="info">';
                content += '    <li>';
                content += '        <span class="label">총거리</span><span class="number">' + distance + '</span>m';
                content += '    </li>';
                content += '    <li>';
                content += '        <span class="label">도보</span>' + walkHour + walkMin;
                content += '    </li>';
                content += '    <li>';
                content += '        <span class="label">자전거</span>' + bycicleHour + bycicleMin;
                content += '    </li>';
                content += '</ul>'

                return content;
            }
        }
    }
</script>

<style scoped>

    @import "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css";

    #searchbox {
        position: absolute;
        left: 146px;
        top: 10px;
    }

    .info {
        position: relative;
        top: 5px;
        left: 5px;
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

    .myinfo {
        position: relative;
        left: 0px;
        top: 0px;
        border-radius: 6px;
        border: 1px solid #ccc;
        border-bottom: 2px solid #ddd;
        font-size: 12px;
        padding: 5px;
        background: #fff;
        list-style: none;
        margin: 0;
    }

    .search_button {
        position: relative;
        top: -39px;
        left: 200px;
        border: 0px;
    }

    .fadeInDown {
        animation-duration: 0.3s;

    }

    .fadeOutDown {
        animation-duration: 0.3s;
    }

    #searchbox_list {
        position: fixed;
        left: 150px;
        top: 80px;
        width: 550px;
        height: 600px;
    }

    #back_button {
        position: fixed;
        left: 650px;
        top: 85px;
        font-size: 1em;
        border: 0px;
    }

    #page {
        position: fixed;
        left: 145px;
        top: 625px;
        width: 200px;
    }

    .el-pager li {
        width: 200px;
    }
</style>