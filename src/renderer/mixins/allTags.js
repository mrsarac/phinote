
import axios from 'axios'

export default {
  data() {
    return {
      allTags: {},
      options: [],
    }
  },
  mounted() {
    this.getAllTags()
  },
  created() {

  },
  methods: {
    showTags: function() {
      console.log("I am a mixin")
      this.getAllTags()
    },

    getAllTags: function () {
      const config = {
        headers: { 'Authorization': JSON.parse(localStorage.getItem('token'))},
      }
      let url = this.$serverURL +'/api/tags';
      axios.get(url, config)
        .then(response => this.getAllTagsSuccessful(response))
        .catch(error => this.getAllTagsFailed(error))
    },

    getAllTagsSuccessful: function(response){
      this.allTags = response.data.data.content


      this.$root.allTags = this.allTags


      console.log("GET ALL TAGS CALLED: ", response)
      this.selectOption()
    },

    getAllTagsFailed: function(error){
      console.log("Failed", error)
    },

    selectOption: function() {
      console.log("OPTION UPDATED!")
      let listOfObjects = Object.keys(this.$root.allTags).map((key) => {
        return {tagName: this.$root.allTags[key].name, tagId: this.$root.allTags[key].id }
      })
      this.options = listOfObjects
      console.log(listOfObjects)
    },

    deleteTag(id) {
      if (confirm("Are you sure?")) {
        const config = {
          headers: { 'Authorization': JSON.parse(localStorage.getItem('token'))},
        }
        let url = this.$serverURL +'/api/tags/' + id;
        axios.delete(url, config)
          .then(response => this.deleteTagSuccessful(response))
          .catch(() => this.deleteTagFailed())
      } else {
      }
    },

    deleteTagSuccessful(response){
      console.log("Success", response)
      alert("Deleted!")
      this.getAllTags()
    },

    deleteTagFailed(){
      console.log("Failed!")
    }

  }
}
