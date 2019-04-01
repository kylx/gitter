
var git = (function () {

    var repo = [];
    var staged = [];
    var working = [];
    var files = [];
    
    var file_history = [];

    var Commit = function (parent_commits) {
        // console.log("new commit: " + parent_commits.length);
        if (parent_commits.length > 0) {
            parent_commits.forEach(function (parent_commit, index) {
                // console.log("parent " + index + ": ", parent_commit.id);
            });
        }
        // create node for commit
        let node = cy.add({
            group: 'nodes',
            data: {
                color: head.color,
                branches: [],
                label_color: 'white',
            }
        });
        node.data('short_id', node.data('id').substring(0, 4))

        // assign id
        this.id = node.id();

        // create connections to parents
        parent_commits.forEach(function (parent_commit, index) {
            cy.add({
                group: 'edges',
                data: {
                    source: parent_commit.id,
                    target: this.id,
                }
            });
            if (index == 0) {
                let parent = cy.getElementById(parent_commit.id);
                node.renderedPosition(parent.renderedPosition());

            }
        }, this);



    }

    var poppers = {};

    var Branch = function (node, name) {
        // console.log("new Branch: ", node.id);
        this.name = name;
        this.id = node.id;
        this.color = getRandomColor();
        this.popper = cy.popperRef();
        let popper = {};
        popper.pop = cy.popperRef();
        popper.tip = makePopTippy(this.pop, name, 'top');
        poppers[name] = popper
        // console.log(popper);
        // poppers[name].tip.show();

        this.move_to = function (node) {
            // console.log(node, this);
            remove_branch_to_commit(this.name, this);
            this.id = node.id;
            // let orig = cy.getElementById(this.id);
            // let n = cy.getElementById(node.id);

            // orig.data('short_id', orig.data('id').substring(0, 4));
            // n.data('short_id', name);
            add_branch_to_commit(this.name, node);




            // poppers[name].renderedPosition = () => n.renderedPosition();
        }
    }


    var root; // root commit
    var branches = {};
    var head = {
        branch_name: null,
        color: null,
        id: null,
        move_to: function (node, branch_name = null) {
            // console.log("head move: ", node.id);



            if (this.branch_name) {
                remove_branch_to_commit('HEAD', this);
                let n = cy.getElementById(this.id);
                n.data('label_color', '#7F8C8D');
            }
            this.id = node.id;

            if (branch_name) {

                this.branch_name = branch_name;
                this.color = branches[branch_name].color;
            }

            if (this.branch_name) {


                branches[this.branch_name].move_to(this);


            }

            if (this.branch_name) {
                add_branch_to_commit('HEAD', node);
                let n = cy.getElementById(node.id);
                n.data('label_color', '#ECF0F1');
            }


        },

    };

    var stringify_array = function (arr) {
        let string = '';
        arr.forEach(function (name, index) {
            string += name + "\n";
        });
        return string;
    };

    var add_branch_to_commit = function (branch_name, commit) {
        let node = cy.getElementById(commit.id);
        let arr = node.data('branches');
        if (!arr.includes(branch_name)) {
            arr.push(branch_name);
            node.data('short_id', stringify_array(arr));
            node.data('branches', arr);
        }
    };

    var assign_short_id = function (node) {
        let orig = cy.getElementById(node.id);
        orig.data('short_id', orig.data('id').substring(0, 4));
    };

    var remove_branch_to_commit = function (branch_name, commit) {
        // console.log(commit);
        let node = cy.getElementById(commit.id);
        let arr = node.data('branches');
        // arr = arr.filter(name => name != branch_name);


        arr = arr.filter(function (value, index, arr) {

            return value != branch_name;

        });
        node.data('branches', arr);
        if (arr.length == 0) {
            assign_short_id(commit);
        }
        node.data('short_id', stringify_array(arr));
    };

    var copy_files = function(files){
        let arr = [];
        for (let j in files){
            let file = files[j];
            arr.push(new File(file.name, file.version, file.state, file.is_staged));
        }
        return arr;
    };

    // initialize
    (function () {
        // create root
        root = new Commit([]);
        branches['master'] = new Branch(root, 'master');
        head.move_to(branches['master'], 'master');
        file_history.push({
            'id': head.id, 
            'files': []
        });
        let s = 'init hist\n';
        for (let i in file_history){
            let hist = file_history[i];
            s += hist.id.substring(0,4) + ': \n';
            for (let j in hist.files){
                let f = hist.files[j];
                s += '  > ' + f.name + ' ' + f.version + '\n';
            }
        }
        console.log(s);

        let node = cy.getElementById(root.id);
        node.data('color', head.color);
    })();

    // functions
    var commit = function () {
        console.group('commit');
        console.log('head: ', this.head.branch_name);
        // console.log('files: ', this.files);
        
        let commit = new Commit([head]);
        this.files.forEach(file => {
            console.log('try commiting ' + file.name);
            if (file.is_staged){
                file.is_staged = false;
                file.state = 'commited';
            }
            
        });
        console.log('commit id: ', commit.id);
        print_hist('hist before');

        
        file_history.push({
            'id': commit.id, 
            'files': JSON.parse(JSON.stringify(this.files))
        });
        staged = [];
        head.move_to(commit);
        print_hist('hist after');
        
        console.groupEnd('commit');
        // tippy_commit(commit);
    }

    var print_hist = function(s = ''){
        s += '\n';
        for (let i in file_history){
            let hist = file_history[i];
            s += hist.id.substring(0,4) + ': \n';
            s += string_files(hist.files);
        }
        console.log(s);
    }

    var string_files = function(files){
        // console.log("parse: " , files);
        if (files.length == 0) return '  > NONE\n';
        let s = '';
        for (let j in files){
            let f = files[j];
            s += '  > ' + f.name + ' ' + f.version + '\n';
        }
        return s;
    }

    var createBranch = function (name, should_move = true) {
        // console.log("git branch ", name, should_move);
        branches[name] = new Branch(head, name);
        if (should_move) {
            head.move_to(branches[name], name);
        }
    }

    var merge = function (name) {
        if (head.id == branches[name].id) return;
        // console.log("git merge ", name);

        let commit = new Commit([head, branches[name]]);
        head.move_to(commit);
        // branches[name].move_to(commit);
    }

    return {
        files: files,
        repo: repo,
        staged: staged,
        working: working,
        string_files: string_files,
        print_hist: print_hist,
        head: head,
        branches: branches,
        commit: commit,
        merge: merge,
        Branch: Branch,
        checkout: function (name) {
            console.group('checkout');
            console.log('switch from ' + head.branch_name + ' to ' + name);
            
            // console.log();
            // if branch doesn't exists
            // console.log("git checkout ", name);
            if (!this.branches[name]) createBranch(name);
            this.head.move_to(this.branches[name], name);

            console.log('new id: ' + head.id);
            console.log('files before\n' + string_files(this.files));

            file_history.forEach(hist=>{
                // console.log('co foreach ',string_files(hist.files));
                if (hist.id === this.head.id){
                    this.files = copy_files(hist.files);
                    return;
                }
            }, this);
            // this.files = file_history[this.head.id];
            
            console.log('files after\n' + string_files(this.files));
            console.groupEnd('checkout');
        }
    }
})();

update();


var File = function(name, version=0, state='new', is_staged=false){
    this.name = name;
    this.version = version;

    this.edit = function(){
        if (this.state !== 'new'){
            this.state = 'modified';
        }
        
    }
    this.state = state;
    this.is_staged = is_staged;
};






var run_git = function(cmd){

    if (cmd === "git commit"){
        git.commit();
    }

    let tokens = cmd.split(' ');
    if (tokens.length > 1 && tokens[0] === 'git'){
        if (tokens.length == 4 &&
            tokens[1] === 'checkout' &&
            tokens[2] === '-b'
        ){
            git.checkout(tokens[3]);
        } else if (tokens.length == 3 &&
            tokens[1] === 'checkout'
        ){
            git.checkout(tokens[2]);
        } else if (tokens.length == 3 &&
            tokens[1] === 'merge'
        ){
            git.merge(tokens[2]);
        }

        if (tokens.length > 2 && tokens[0] == 'git' && tokens[1] == 'add'){
            if (tokens[2] === '*'){
                

                git.files.forEach(function(file, index){
                    if (file.state !== 'commited') {
                        file.is_staged = true;
                    }

                });
                
                
                console.log("git add all", git.files);
            }
        }
    }

    if (tokens[0] === 'create'){

        let ss = git.string_files(git.files);

        let s = '';
        for(let i = 1; i < tokens.length; i++){
            s += tokens[i] + ' ';
        }
        console.group('create ' + s);
        git.print_hist('hist before\n');

        

        console.log("files before\n" + ss);
        for(let i = 1; i < tokens.length; i++){
            git.files.push(new File(tokens[i]));
        }
        console.log("files after\n" + git.string_files(git.files));
        git.print_hist('hist after\n');
        console.groupEnd('create ' + s);
    }

    

    update();
}
run_git('git checkout -b test');
run_git('create a b');
run_git('git add *');
run_git('git commit');
run_git('git checkout master');
run_git('git checkout test');
update();
// run_git('create a b c');




