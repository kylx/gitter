


var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      selected: 'master',
      merge_select: 'master',
      command: '',
      cmd_history: [],
      cmd_index: 0,
    //   working: git.working,
    //   staged: git.staged,
    //   repo: git.repo,
    //   git_branches: bb  ,
      
    },
    methods: {
        comm: function(event){
            // console.log(event);
            // console.log(branches);
            git.commit();
            update();
        },
        changeBranch: function(event){
            // console.log(this.$data.selected);
            // console.log('change!!!');
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
            if (this.$data.command !== '')
            {
                this.$data.cmd_history.push(this.$data.command);
                this.$data.cmd_index = this.$data.cmd_history.length;

                run_git(this.$data.command);
                
            }
            // console.log(this.$data.command);
            
            this.$data.command = '';
            this.$forceUpdate();
            update();

            
        },
        up_cmd: function(event){
            this.$data.cmd_index--;
            if (this.$data.cmd_index < 0) this.$data.cmd_index = 0;
            this.$data.command = this.$data.cmd_history[this.$data.cmd_index];
            console.log("up", this.$data.cmd_history);
        },
        down_cmd: function(event){
            this.$data.cmd_index++;
            if (this.$data.cmd_index >= this.$data.cmd_history.length){
                this.$data.cmd_index = this.$data.cmd_history.length;
                this.$data.command = '';
            }
            else this.$data.command = this.$data.cmd_history[this.$data.cmd_index];
            console.log("up", this.$data.cmd_history);
        },
        working: function(){
            return git.files.filter(function(file){
                return !file.is_staged && (file.state === 'new' || file.state === 'modified');
            })
        },
        new_files: function(){
            return git.files.filter(function(file){
                return !file.is_staged && file.state === 'new';
            })
        },
        modified_files: function(){
            return git.files.filter(function(file){
                return !file.is_staged && file.state === 'modified';
            })
        },
        removed_files: function(){
            return git.files.filter(function(file){
                return !file.is_staged && file.state === 'removed';
            })
        },
        staged: function(){
            return git.files.filter(file => file.is_staged);
        },
        repo: function(){
            return git.files.filter(file => file.state === 'commited');
        },
        git_error: function(){
            return git.error;
        },
        git_head: function(){
            return git.head.branch_name;
        }
    },
    computed: {
        branches: function(){
            return git.branches;
        }

    },
    filters:{
        status_code: function(state){
            if (state === 'new') return 'A';
            if (state === 'modified') return 'M';
            if (state === 'removed') return 'D';
        }
    }
  });

  update();

//   app.methods.changeBranch();