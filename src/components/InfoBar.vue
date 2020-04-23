<template>
    <div id='app'>
    <table border='1'>
        <thead>
            <tr><th colspan='7'>{{ month }}</th></tr>
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
                <td v-for='day in 7' :key='day'>
                    {{ day + ((week - 1) * 7) }}
                </td>
            </tr>
        </tbody>
    </table>
    </div>
</template>

<script>
export default {
    name: 'info-bar',
    props: {
        month: String
    }
}
</script>

<style scoped>
table {
  table-layout: fixed ;
  width: 100% ;
}
td {
  width: 25% ;
} 
thead {
    align: center ;
}
</style>

<!--- 
TODO:
- Get for loop to work to render the calendar
- Get new Date.now(), d.getDay()
- Button to go to birthday
- Pull file names from s3
-->