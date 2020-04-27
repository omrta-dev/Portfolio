<template>
  <div id='app'>
    <vue-picture-swipe :items="[]"></vue-picture-swipe>
    <div class="month">
      <ul>
        <li v-on:click='month -= 1, picturesObtained = false' class="prev">&#10094;</li>
        <li v-on:click='month += 1, picturesObtained = false' class="next">&#10095;</li>
        <li>
          {{ getMonthName(month) }}<br>
          <span> {{ getYearName(month) }}</span>
        </li>
      </ul>
    </div>

    <ul class="weekdays">
      <li>Sunday</li>
      <li>Monday</li>
      <li>Tuesday</li>
      <li>Wednesday</li>
      <li>Thursday</li>
      <li>Friday</li>
      <li>Saturday</li>
    </ul>
    
    <div class='days'>
    <ul>
      <li v-on:click='dateClicked()' v-for='day in 42' :key='day'>{{getDay(day)}}<div class='my-gallery' :key='picturesObtained'>{{getPicturesSize(day)}}</div></li>
    </ul>
    </div>
  </div>
</template>

<script>
var AWS = require('aws-sdk');
var probe = require('probe-image-size');
import PhotoSwipe from 'photoswipe/dist/photoswipe';
import * as DefaultPhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default';

export default {
    name: 'celeste-calendar',
    data() {
      return {
        month: 3,
        year: 2020,
        baseUrl: 'https://martinez-family.s3.us-west-2.amazonaws.com/',
        picturesObtained: false
      }
    },
    created() {
      this.getMonthRange();
      this.cacheS3Contents();
    },
    beforeUpdate() {
      this.getMonthRange();
      this.cacheS3Contents();
    },
    methods: {
        // returns the date based on startDate from the calendar 
        getDay (dayIndex) {
            var day = dayIndex - this.firstDayOfWeek;
            if (day <= 0 || day > this.numOfDays)
                day = '_';
            return day; 
        }, 
        getMonthName(monthIndex) {
            var today = new Date();
            today.setYear(this.year);
            today.setMonth(monthIndex);
            var currentMonth = today.toLocaleString('default', {month: 'long'});
            return currentMonth;
        },
        getYearName(monthIndex) {
            var today = new Date();
            today.setYear(this.year);
            today.setMonth(monthIndex);
            return (today.getYear() + 1900);
        },
        // returns the start and end day based on day of the week of the specified month
        getMonthRange() { 
            var currentDate = new Date();
            currentDate.setMonth(this.month + 1);
            currentDate.setDate(0);
            this.numOfDays = currentDate.getDate();
            currentDate.setMonth(this.month);
            currentDate.setDate(1);
            this.firstDayOfWeek = currentDate.getDay();
        },
        dateClicked() {
          if(event.target.firstChild.nodeValue != "_") {
            var pictures = this.getPictures(event.target.firstChild.nodeValue)
            var items = []
            for(let picture in pictures) {
              probe(pictures[picture], function (err, result) {
                var item = {
                  src: pictures[picture],
                  w: result.width,
                  h: result.height
                }
                items.push(item)
                if(items.length == pictures.length) {
                  const pswpElement = document.querySelectorAll('.pswp')[0];
                  const gallery = new PhotoSwipe(pswpElement, DefaultPhotoSwipeUI,
                  items,
                  {
                    captionEl: false,
                    shareEl: false,
                  });
                  gallery.init(); 
                }
              });
            }
          }
        },
        cacheS3Contents() {
          let s3 = new AWS.S3({region: 'us-west-2'});
          var params = {
            Bucket: "martinez-family",
            Prefix: this.getS3Location(),
            MaxKeys: 100
          }
          s3.makeUnauthenticatedRequest('listObjectsV2', params, (err, data) => {
            if (err) {
              console.log(err, err.stack);
            }
            else {
              console.log(data);
              this.s3Contents = data.Contents;
              this.picturesObtained = true;
              return data;
            }
          });
        },
        getS3Location() {
            var today = new Date();
            today.setYear(this.year);
            today.setMonth(this.month);
            var year = (today.getYear() + 1900) + '/';
            var month = today.getMonth() + 1;
            month = month < 10 ? '0' + month : month;
            return year + month + '/';
        },
        getPictures(day) {
          var pictures = []
          for(let pictureIndex in this.s3Contents) {
            var content = this.s3Contents[pictureIndex];
            var formattedDay = day < 10 ? '0' + day : day;
            var dayStamp = this.getS3Location().replace(/\//g, '')+formattedDay;
            if (content.Key.includes(dayStamp)) {
              pictures.push(this.baseUrl + content.Key);
            }
          }
          return pictures;
        },
        getPicturesSize(day) {
          var pictures = this.getPictures(this.getDay(day))
          return pictures.length > 0 ? pictures.length + ' pics' : ''; 
        }
      }
    }
</script>

<style scoped>
* {box-sizing: border-box;}
ul {list-style-type: none;}

.month {
  padding: 70px 25px;
  background: #1abc9c;
  text-align: center;
  border: 1px solid black;
}

.month ul {
  margin: 0;
  padding: 0;
}

.month ul li {
  color: white;
  text-transform: uppercase;
  letter-spacing: 3px;
}

.month .prev {
  float: left;
  cursor: pointer;
}

.month .next {
  float: right;
  padding-top: 10px;
  cursor: pointer;
}

.weekdays {
  border-left: 1px solid black;
  border-right: 1px solid black;
  margin: 0;
  padding: 10px 0;
  background-color: #ddd;
}

.weekdays li {
  display: inline-block;
  width: calc(100% / 7) ;
  color: #666;
  text-align: center;
}

.days {
  background-color: #eee;
  height: 100%;
}

.days ul {
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  text-align: left;
}

.days ul li {
  font-size: 30px;
  list-style: none;
  flex: 0 0 calc(100% / 7);
  height: calc(100vh / 6) ;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.days .my-gallery {
  text-align: right;
  font-size: 18px;
}
</style>