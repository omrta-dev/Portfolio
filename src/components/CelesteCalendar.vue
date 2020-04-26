<template>
  <div id='app'>
    {{ getMonthRange() }}
    <vue-picture-swipe :items="[]"></vue-picture-swipe>
    <div class="month">      
      <ul>
        <li v-on:click='month -= 1' class="prev">&#10094;</li>
        <li v-on:click='month += 1' class="next">&#10095;</li>
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
      <li v-on:click='dateClicked()' v-for='day in 42' :key='day'>{{getDay(day)}}<div class='my-gallery'>{{ getPictureCount(getDay(day)) }}</div></li>
    </ul>
    </div>
  </div>
</template>

<script>
import PhotoSwipe from 'photoswipe/dist/photoswipe';
import * as DefaultPhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default';

export default {
    name: 'celeste-calendar',
    data() {
      return {
        month: 3,
        year: 2020,
        items: [{
          src: 'http://via.placeholder.com/600x400',
          thumbnail: 'http://via.placeholder.com/64x64',
          w: 600,
          h: 400,
          alt: 'some numbers on a grey background' // optional alt attribute for thumbnail image
        },
        {
          src: 'http://via.placeholder.com/1200x900',
          w: 1200,
          h: 900
        }]  
      }
    },
    methods: {
        getDay (dayIndex) {
            var day = dayIndex - this.firstDayOfWeek;
            if (day <= 0 || day > this.numOfDays)
                day = '_';
            return day; 
        },
        getMonthName(monthIndex) {
            var today = new Date();
            today.setYear(this.year)
            today.setMonth(monthIndex);
            var currentMonth = today.toLocaleString('default', {month: 'long'});
            return currentMonth;
        },
        getYearName(monthIndex) {
            var today = new Date();
            today.setYear(this.year)
            today.setMonth(monthIndex);
            return (today.getYear() + 1900);
        },
        getMonthRange() { 
            var currentDate = new Date();
            currentDate.setMonth(this.month + 1);
            currentDate.setDate(0);
            this.numOfDays = currentDate.getDate();
            currentDate.setMonth(this.month);
            currentDate.setDate(1);
            this.firstDayOfWeek = currentDate.getDay();
        },
        isInRange(day, week) {
            if (this.getDay(day, week) != 0)
                return true
            return false
        },
        dateClicked() {
          console.log("clicked");
          const pswpElement = document.querySelectorAll('.pswp')[0];
          const gallery = new PhotoSwipe(pswpElement, DefaultPhotoSwipeUI,
          this.items,
          {
            captionEl: false,
            shareEl: false,
          });
          gallery.init();
        },
        getPictureCount(day) {
          return day;
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