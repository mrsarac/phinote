<template>
  <div>
    <div class="app-container container">
      <div class="main">
        <div class="main-left">
          <Menu></Menu>
        </div>
        <div class="map">
          <div class="search-area">
            <form @submit.prevent="getMap(qCity)">
              <label for="city">Search a place: (Example: London, Tokyo)</label>
              <input type="text" class="city" id="city" v-model="qCity">
            </form>
            <div>
              <ul>
                <li v-for="address in addressResults">
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

<script>
  import Menu from "./Menu";
  import GoogleMapsLoader from 'google-maps'
  import axios from 'axios';

  export default {
    components: {Menu},

    data() {
      return {
        qCity: '',
        addressResults: {},
        lat: 51.5073509,
        lng: -0.1277583,
      }
    },
    methods: {
        getMap: function (qCity) {

          const config = {
            params: {
              key: '-',
              address: qCity
            }
          }

          let url = 'https://maps.googleapis.com/maps/api/geocode/json';

          axios.get(url, config)
            .then(response => this.mSuccess(response))
            .catch(() => this.mFailed())
        },

        mSuccess: function (response) {
          this.addressResults = response.data.results;
        },

        mFailed: function () {
          console.log("Failed");
        },

        setMap: function(address) {

          if (address) {
            this.lat = address.geometry.location.lat;
            this.lng = address.geometry.location.lng;
          }

          GoogleMapsLoader.KEY = '-';

          GoogleMapsLoader.load(function(google) {

            let map = new google.maps.Map(document.getElementById('map'), {
              zoom: 10,
              center: {lat:this.lat, lng: this.lng},
              place_id : "ChIJW8Va5TnED4gRY91Ng47qy3Q",
            })
          }.bind(this))

        }
    },
    mounted: function () {
        this.setMap()
    }

  }

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
        margin-top:10px
        }
      }

    .search-area {

      padding: 20px;
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
