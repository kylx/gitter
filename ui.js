


var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      selected: 'master',
      merge_select: 'master',
      command: 'command',
    //   git_branches: bb  ,
      
    },
    methods: {
        comm: function(event){
            console.log(event);
            // console.log(branches);
            git.commit();
            update();
        },
        changeBranch: function(event){
            console.log(this.$data.selected);
            console.log('change!!!');
            // console.log(branches);
            git.checkout(this.$data.selected);
            update();
        },
        newBranch: function(event){
            // console.log(branches);
            git.checkout(this.$data.message);
            update();
            this.$forceUpdate();
        },
        merge: function(event){
            git.merge(this.$data.merge_select);
            update();
        },
        setSelected: function(event, name){
            this.$data.selected = name;
        },

        run_command: function(event){
            console.log(this.$data.command);
            this.$data.command = '';
        }
    },
    computed: {
        branches: function(){
            return git.branches
        },
    }
  });

//   app.methods.changeBranch();