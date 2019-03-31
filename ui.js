


var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      selected: 'master',
      merge_select: 'master',
      command: 'command',
    //   working: git.working,
    //   staged: git.staged,
    //   repo: git.repo,
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
            this.$data.selected = this.$data.message;
            update();
            this.$forceUpdate();
        },
        merge: function(event){
            git.merge(this.$data.merge_select);
            update();
        },
        setSelected: function(event, name){
            this.$data.selected = name;
            git.checkout(this.$data.selected);
            update();
        },

        run_command: function(event){
            console.log(this.$data.command);
            run_git(this.$data.command);
            this.$data.command = '';
            this.$forceUpdate();
        },
        working: function(){
            return git.files.filter(function(file){
                return !file.is_staged && (file.state === 'new' || file.state === 'modified');
            })
        },
        staged: function(){
            return git.files.filter(file => file.is_staged);
        },
        repo: function(){
            return git.files.filter(file => file.state === 'commited');
        }
    },
    computed: {
        branches: function(){
            return git.branches;
        }

    }
  });

//   app.methods.changeBranch();