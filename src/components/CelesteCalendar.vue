<template>
    <div id='app' style="overflow-x:auto;">
    {{ getMonthRange() }}
    <table border='1'>
        <thead>
            <tr><th colspan='7'>{{ getMonthName(month) }}</th></tr>
            <tr>
            <th>Sunday</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for='week in 5' :key='week'>
                <td v-for='day in 7' :key='day'><div v-show='isInRange(day, week)' class="content">{{ getDay(day, week) }}</div>
                </td>
            </tr>
        </tbody>
    </table>
    </div>
</template>

<script>
export default {
    name: 'celeste-calendar',
    props: {
        month: Number
    },
    methods: {
        getDay (dayIndex, weekIndex) {
            console.log(this.firstDayOfWeek)
            var day = (dayIndex + ((weekIndex - 1) * 7)) - this.firstDayOfWeek;
            if (day <= 0 || day > this.numOfDays)
                return 0
            return day; 
        },
        getMonthName(monthIndex) {
            var today = new Date();
            today.setMonth(monthIndex);
            return today.toLocaleString('default', {month: 'long'});
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
        }
    }
}
</script>

<style scoped>
table {
    width: 100%;
}
thead {
    align: center ;
}
td {
    width: calc(100% / 7) ;
    height: calc(100% / 7) ;
    vertical-align: top ;
    text-align: left ;
    position: relative ;
}
td:after {
    content: '' ;
    display: block ;
    margin-top: 100% ;
}
td .content {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
@media only screen and (max-width: 1080px) {
    table{
        width: 1080px ;
    }
}
</style>

<!--- 
TODO:
- Get new Date.now(), d.getDay()
- Button to go to birthday
- Pull file names from s3
-->