<template>
  <div contenteditable="true" @input="update"></div>
</template>
<script>

  export default {

    name: 'editable',
    props:['content'],
    data() {
      return {
        timeout: 0,
    }},
    mounted:function(){
      this.$el.innerText = this.content;
    },
    methods:{

      triggerNoteUpdate: function() {
        this.$parent.triggerUpdate()
      },

      triggerDisableStatus: function() {
        this.$parent.triggerDisable()
      },

      update:function(event){

        this.triggerDisableStatus();

        if(this.timeout){ clearTimeout(this.timeout);}

        this.timeout = setTimeout(function() {
          // console.log("Can you update?");
          this.triggerNoteUpdate();
        }.bind(this),500);
        // bu bind  .. yukaridaki this e erisebildim sonunda

        this.$emit('update',event.target.innerText);

      }


    }
  }

</script>
