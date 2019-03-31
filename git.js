
var git = (function () {
    var Commit = function (parent_commits) {
        console.log("new commit: " + parent_commits.length);
        if (parent_commits.length > 0) {
            parent_commits.forEach(function (parent_commit, index) {
                console.log("parent " + index + ": ", parent_commit.id);
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
        console.log("new Branch: ", node.id);
        this.name = name;
        this.id = node.id;
        this.color = getRandomColor();
        this.popper = cy.popperRef();
        let popper = {};
        popper.pop = cy.popperRef();
        popper.tip = makePopTippy(this.pop, name, 'top');
        poppers[name] = popper
        console.log(popper);
        // poppers[name].tip.show();

        this.move_to = function (node) {
            console.log(node, this);
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
            console.log("head move: ", node.id);



            if (this.branch_name) {
                
                remove_branch_to_commit('HEAD', this);
                let n = cy.getElementById(this.id);
                n.data('label_color', 'white');
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
                n.data('label_color', 'pink');
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

    // initialize
    (function () {
        // create root
        root = new Commit([]);
        branches['master'] = new Branch(root, 'master');
        head.move_to(branches['master'], 'master');

        let node = cy.getElementById(root.id);
        node.data('color', head.color);
    })();

    // functions
    var commit = function () {
        console.log("git commit ", head);
        let commit = new Commit([head]);
        head.move_to(commit);
        // tippy_commit(commit);
    }

    var createBranch = function (name, should_move = true) {
        console.log("git branch ", name, should_move);
        branches[name] = new Branch(head, name);
        if (should_move) {
            head.move_to(branches[name], name);
        }
    }

    var merge = function (name) {
        if (head.id == branches[name].id) return;
        console.log("git merge ", name);

        let commit = new Commit([head, branches[name]]);
        head.move_to(commit);
        // branches[name].move_to(commit);
    }

    return {
        head: head,
        branches: branches,
        commit: commit,
        merge: merge,
        Branch: Branch,
        checkout: function (name) {
            // if branch doesn't exists
            console.log("git checkout ", name);
            if (!branches[name]) createBranch(name);
            head.move_to(branches[name], name);
        }
    }
})();

// new git.Commit();
// new git.Branch();
// git.commit();
// git.commit();
// git.checkout('apple');
// // git.commit();
// // git.commit();
// git.checkout('master');
// // git.merge('apple');
// // git.commit();
// // git.checkout('master');
// // git.commit();
// git.checkout('hello');
// git.checkout('fish');
// // git.commit();
// // git.checkout('master');
// // git.commit();
update();

console.log("branches: ", git.branches)


// function Commit(parent_commits){
//     console.log("commit");
//     // console.log(parent_commits[0].renderedPosition());
//     // this.commit = cy.add({
//     //     group: 'nodes', 
//     //     data:{
//     //         color:head.branch.color,

//     //     },
//     //     renderedPosition: {
//     //         x: parent_commits[0].renderedPosition().x+50,
//     //         y: parent_commits[0].renderedPosition().y,
//     //     },
//     // });
//     console.log(parent_commits[0].position());
//     this.commit = cy.add({
//         group: 'nodes', 
//         data:{
//             color:head.branch.color,

//         },
//         renderedPosition: {
//             x: parent_commits[0].position().x+50,
//             y: parent_commits[0].position().y,
//         },
//     });

//     parent_commits.forEach(function(parent_commit, index){
//             cy.add({
//                 group: 'edges', 
//                 data: {
//                     source: parent_commit.id(), 
//                     target: this.commit.id(),
//                 }
//             });
//         }, this
//     );
//     // updateView();

//     head.move_to(this.commit);
//     
// }

// function Branch(commit) {
//     this.commit = commit;
//     this.color = getRandomColor();
//     this.id = function(){
//         return this.commit.id();
//     };

//     this.copy = function(){
//         return new Branch(this.commit);
//     };
// };

// var root = cy.add({
//     group: 'nodes',
//     renderedPosition: {
//         x: 0,
//         y: 0,
//     },
// });


// var branches = {};
// branches['master'] = new Branch(root);
// root.data('color', branches['master'].color);

// var head = {
//     branch: branches['master'],
//     move_to: function(commit){
//         this.branch.commit = commit;
//         updateView();
//     },
//     id: function(){
//         return this.branch.id();
//     }
// }



// function commit(){
//     new Commit([head.branch.commit]);
// }

// function branch(name){
//     branches[name] = head.branch.copy();
//     head.branch = branches[name];
// }

// function change_branch(name){
//     head.branch = branches[name];
// }

// function merge(name){
//     new Commit([head, branches[name]]);
//     // var commit = cy.add({group: 'nodes'});
//     // cy.add({group: 'edges', data: {source:head.id(), target: commit.id()}})
//     // cy.add({group: 'edges', data: {source:branches[name].id(), target: commit.id()}})
//     // head.move_to(commit);
//     // updateView();
// }

function tippy_commit(node) {
    let a = cy.getElementById(node.id);

    let tippyA = makeTippy(a, a.id().substring(0, 5));

    tippyA.show();
}

// // commit();
// // commit();
// // branch('b1');
// // commit();
// // commit();
// // branch('b2');
// // commit();
// // commit();
// // change_branch('master');
// // commit();
// // commit();
// // change_branch('b1');
// // commit();
// // commit();
// // change_branch('master');
// // merge('b1');
// // commit();
// // commit();
// // commit();
// // updateView(root, true);
// updateView(root, true);
// console.log(branches);



