<template>
  <div>
    <div class="app-container container">
      <div class="main">
        <Menu></Menu>
        <div class="weather">
          <div class="search-area">
            <form @submit.prevent="getWeather(qCity)">
              <label for="city">Search a City: (Example: London, Tokyo)</label>
              <input type="text" class="city" id="city" v-model="qCity">
            </form>
          </div>
          <div class="result">
            <p v-if="cityName">
              <span class="icon icon-cloud"></span>
              <strong>{{ cityName }}</strong>
              <small>Min</small>
              <strong>{{ wData.main.temp_min }}</strong> C -
              <small>Max</small>
              <strong>{{ wData.main.temp_max }}</strong> C
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import Menu from './Menu';

export default defineComponent({
  components: { Menu },
  setup() {
    const isLoading = ref(true);
    const apiKey = ref('ece2ed4d6e6e3e32f6aa03d5421add63');
    const qCity = ref('');
    const cityName = ref('');
    const celsius = ref<number | null>(null);
    const wData = ref<any>({});

    const getWeather = async (qCity: string) => {
      if (qCity.length > 1) {
        const config = {
          params: {
            appid: apiKey.value,
            q: qCity,
            units: 'metric'
          }
        };

        const url = 'http://api.openweathermap.org/data/2.5/weather';

        try {
          const response = await axios.get(url, config);
          wSuccess(response);
        } catch (error) {
          wFailed();
        }
      }
    };

    const wSuccess = (response: any) => {
      wData.value = response.data;
      cityName.value = response.data.name;
    };

    const wFailed = () => {
      console.log('Hata oldu');
    };

    return {
      isLoading,
      apiKey,
      qCity,
      cityName,
      celsius,
      wData,
      getWeather,
      wSuccess,
      wFailed
    };
  }
});
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
      font-size: 80%;
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
