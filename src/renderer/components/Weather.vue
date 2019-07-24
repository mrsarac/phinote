<script src="../../../../../../Downloads/Arşiv/main.js"></script>
<template>
  <div>
    <div class="app-container container">
      <div class="main">
        <div class="main-left">
          <Menu></Menu>
        </div>
        <div class="weather">

          <div class="search-area">
            <form @submit.prevent="getWeather(qCity)">
              <label for="city">Search a City: (Example: London, Tokyo)</label>
              <input type="text" class="city" id="city" v-model="qCity">
            </form>
          </div>

          <div class="result">
            <p v-if="cityName">  <span class="icon icon-cloud"></span>  <strong>{{cityName}}</strong> <small>Min</small> <strong>{{wData.main.temp_min}}</strong> C - <small>Max</small> <strong>{{wData.main.temp_max}}</strong> C</p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Menu from "./Menu";

  import axios from 'axios';

  export default {
    components: {Menu},
    data() {
      return {
        isLoading: true,
        apiKey: 'ece2ed4d6e6e3e32f6aa03d5421add63',
        qCity: '',
        cityName: '',
        celsius: null,
        wData: {}
      }
    },
    methods: {
      getWeather: function (qCity) {

        if (qCity.length > 1) {

          const config = {
            params: {
              appid: 'ece2ed4d6e6e3e32f6aa03d5421add63',
              q: qCity,
              units: 'metric'
            }
          }

          let url = 'http://api.openweathermap.org/data/2.5/weather';

          axios.get(url, config)
            .then(response => this.wSuccess(response))
            .catch(() => this.wFailed())
        }

      },

      wSuccess: function (response) {
        this.wData = response.data;
        this.cityName = response.data.name;
      },

      wFailed: function (error) {
        console.log("Hata oldu");
      },

    }

  }

</script>

<style lang="scss">
  .weather {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .search-area {
      width: 400px;
      label {
        display: block;
        margin-bottom: 10px;
        font-size:80%;
        color: #999;
      }

      .city {
        width: 100%;
        padding: 10px;
        font-size: 16px;
        &:focus {
          outline: 0 none;
        }
      }
    }

    .result {
      width: 400px;
    }
  }
</style>
