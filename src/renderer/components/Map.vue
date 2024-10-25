<template>
  <div>
    <div class="app-container container">
      <div class="main">
        <Menu></Menu>
        <div class="map">
          <div class="search-area">
            <form @submit.prevent="getMap(qCity)">
              <label for="city">Search a place: (Example: London, Tokyo)</label>
              <input type="text" class="city" id="city" v-model="qCity">
            </form>
            <div>
              <ul>
                <li v-for="address in addressResults" :key="address.place_id">
                  <a href="#" @click="setMap(address)">{{address.formatted_address}}</a>
                </li>
              </ul>
            </div>
          </div>
          <div id="map"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import Menu from './Menu';
import GoogleMapsLoader from 'google-maps';
import axios from 'axios';

export default defineComponent({
  components: { Menu },
  setup() {
    const qCity = ref<string>('');
    const addressResults = ref<any[]>([]);
    const lat = ref<number>(51.5073509);
    const lng = ref<number>(-0.1277583);

    const getMap = async (qCity: string) => {
      const config = {
        params: {
          key: '-',
          address: qCity
        }
      };

      const url = 'https://maps.googleapis.com/maps/api/geocode/json';

      try {
        const response = await axios.get(url, config);
        mSuccess(response);
      } catch (error) {
        mFailed();
      }
    };

    const mSuccess = (response: any) => {
      addressResults.value = response.data.results;
    };

    const mFailed = () => {
      console.log('Failed');
    };

    const setMap = (address: any) => {
      if (address) {
        lat.value = address.geometry.location.lat;
        lng.value = address.geometry.location.lng;
      }

      GoogleMapsLoader.KEY = '-';

      GoogleMapsLoader.load((google: any) => {
        const map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: { lat: lat.value, lng: lng.value },
          place_id: 'ChIJW8Va5TnED4gRY91Ng47qy3Q'
        });
      });
    };

    onMounted(() => {
      setMap(null);
    });

    return {
      qCity,
      addressResults,
      getMap,
      setMap
    };
  }
});
</script>

<style lang="scss">
#map {
  height: 100%;
  width: 100%;
}

.map {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  ul {
    li {
      margin-top: 10px;
    }
  }

  .search-area {
    padding: 20px;
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
