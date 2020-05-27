<template>
  <div class='calendar'>
    <vue-picture-swipe :items='[]'></vue-picture-swipe>
    <div class="calendar__month">
        <div v-on:click='month -= 1' class='calendar__month__prev'>&#10094;</div>
        <div>{{ getMonthName(month) }}<br>{{ getYearName(month) }}</div>
        <div v-on:click='month += 1' class='calendar__month__next'>&#10095;</div>
    </div>

    <div class="calendar__weekday">
      <div>Sunday</div>
      <div>Monday</div>
      <div>Tuesday</div>
      <div>Wednesday</div>
      <div>Thursday</div>
      <div>Friday</div>
      <div>Saturday</div>
    </div>
    
    <div class='calendar__day' :class='{"calendar__day--visible":showCalendar}'>
      <div class='calendar__day__grid'>
        <div v-on:click='dateClicked' v-for='day in 42' :key='day'>{{getDay(day)}}<div class='my-gallery' :key='picturesObtained'>{{getPicturesSize(day)}}</div></div>
      </div>
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
        picturesObtained: false,
        showCalendar: false
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
                console.log('error: ', err)
                console.log('result: ', result)
                var item = {
                  src: pictures[picture],
                  w: result.width,
                  h: result.height
                }
                items.push(item)
                if(items.length == pictures.length) {
                  console.log(items)
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
        },
      },
      watch: {
        month: {
          handler(month) {
            this.month = month;
            this.picturesObtained = false;
            this.showCalendar = false;
            setTimeout(() => {this.showCalendar = true}, 250);
          },
          immediate: true,
        }
      }
    }
</script>

<style lang='scss'>

.calendar {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;

  &__month, &__weekday {
    display: flex;
    place-items: center;
    text-align: center;
  }

  &__month {
    background-color: color('primary', 'base');

    &__prev {
      flex-grow: 1;
      text-align: left;
      padding-left: 2rem;
    }

    &__next {
      flex-grow: 1;
      text-align: right;
      padding-right: 2rem;
    }

    &__prev:hover, &__next:hover {
      cursor: pointer;
    }
  }

  &__weekday {
    background-color: color('primary', 'light');
  }

  &__weekday > div {
    flex-grow: 1;
  }

  &__day {
    display:flex;
    height: 100%;
    opacity: 0;
    transition: opacity 0.25s ease-in;

    &__grid {
      flex: 1 1 auto;
      display: grid;
      grid-template-rows: repeat(6, 1fr);
      grid-template-columns: repeat(7, 1fr);

      & > div {
        border: dotted 1px black;
        background-color: color('primary', 'blue_hover');
      }

      & > div:hover {
        background-color: color('primary', 'blue_');
      }
    }

    &--visible {
        opacity: 1;
    }

  }
}
</style>